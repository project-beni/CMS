import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps } from 'react-router-dom'

import { listenStart, read, set, listenCheckingArticles } from '../firebase/database'
import Check from '../components/check'
import { getUid, isEmailConfirmed } from '../firebase/auth'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment')

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
    const users = (await read('/users')).val()

    listenCheckingArticles('articles', (val: any) => {
      if (val) {
        const dataSource: any = []
        Object.keys(val).forEach((key, i) => {
          if (val[key].status === 'pending') {
            const {
              contents: { keyword, tags, title, countAll, categories },
              dates: { ordered, pending, writingStart },
              writer,
            } = val[key]

            const diff =
              3 -
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
              id: key,
              ordered,
              pending,
              keyword,
              tags,
              title,
              countAll,
              categories,
              countdown,
              writer: users[writer].profiles
                ? users[writer].profiles.nickname
                : '',
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
    history.push(`/checkList/${id}`)
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
)(Check)
