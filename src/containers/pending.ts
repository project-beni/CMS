import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps } from 'react-router-dom'
import * as moment from 'moment'

import { listenStart, read, set } from '../firebase/database'
import Pengding from '../components/pending'
import { getUid, isEmailConfirmed } from '../firebase/auth'

type State = {
  dataSource: any
  isLoading: boolean
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
  editArticle: ({ id }: { id: string }) => void
}

const WithHandlers = withHandlers<RouteComponentProps | any, ActionProps>({
  fetchData: ({ receiveData }: any) => async () => {
    const uid = await getUid()
    listenStart(`/users/${uid}/articles/pendings`, async (val: any) => {
      if (val) {
        const dataSource: any = []
        await Promise.all(
          Object.keys(val).map(async (key, i) => {
            const {
              contents: { keyword, tags, title, countAll },
              dates: { ordered, pending, writingStart },
            } = (await read(`/articles/${val[key]}`)).val()

            const diff =
              7 -
              Number(
                moment().diff(
                  moment(
                    writingStart
                      .split('-')
                      .slice(0, 3)
                      .join('-')
                  ),
                  'days'
                )
              )
            const countdown = diff < 0 ? 0 : diff

            dataSource.push({
              key: i,
              id: val[key],
              ordered,
              pending,
              keyword,
              tags,
              title,
              countAll,
              countdown,
            })
          })
        )
        receiveData(dataSource)
      } else {
        receiveData([])
      }
    })
  },
  editArticle: ({ history }) => async ({ id }) => {
    history.push(`/articles/edit/${id}`)
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
)(Pengding)
