import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps } from 'react-router-dom'

import { listenStart, read, set } from '../firebase/database'
import ModelArticles from '../components/modelArticles'
import { getUid, isEmailConfirmed } from '../firebase/auth'

type State = {
  dataSource?: any
  isLoading?: boolean
}

type StateUpdates = {
  receiveData: (dataSource: any) => State
}

const stateHandlers = withStateHandlers<State, StateUpdates>(
  {
    dataSource: [],
    isLoading: true,
  },
  {
    receiveData: () => (dataSource: any) => ({
      dataSource,
      isLoading: false,
    }),
  }
)

type ActionProps = {
  fetchData: () => void
  checkArticle: ({ id }: { id: string }) => void
}

const WithHandlers = withHandlers<RouteComponentProps | any, ActionProps>({
  fetchData: ({ receiveData }: any) => async () => {
    listenStart('/articles', (val: any) => {
      if (val) {
        const dataSource: any = []
        Object.keys(val).forEach((key, i) => {
          if (val[key].type === 'model') {
            const {
              contents: { keyword, tags, title, countAll, categories },
              describe,
            } = val[key]

            dataSource.push({
              key: i,
              id: key,
              keyword,
              tags,
              title,
              countAll,
              categories,
              describe: describe || ''
            })
          }
        })
        receiveData(dataSource)
      } else {
        receiveData([])
      }
    })
  },
  checkArticle: ({ history }) => async ({ id }) => {
    history.push(`/articles/viewer/${id}`)
  },
})

type LifecycleProps = RouteComponentProps | ActionProps

const Lifecycle = lifecycle<LifecycleProps, {}, any>({
  async componentDidMount() {
    const { fetchData, history } = this.props
    const userId = await getUid()

    if (!userId) history.push('/login')

    const confirmationPath = `/users/${userId}`
    const isConfirmedOnDB = (await read(
      `${confirmationPath}/mailConfirmation`
    )).val()
    const isMailConfirmed = isEmailConfirmed()

    if (isMailConfirmed && isConfirmedOnDB) {
      fetchData()
    } else if (isMailConfirmed && !isConfirmedOnDB) {
      await set({
        path: confirmationPath,
        data: { mailConfirmation: true },
      })
      fetchData()
    } else {
      history.push('/mailConfirmation')
    }
  },
})
export default compose(
  stateHandlers,
  WithHandlers,
  Lifecycle
)(ModelArticles)
