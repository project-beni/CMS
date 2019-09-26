import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps } from 'react-router-dom'

import { read, set, fetchWithEqual } from '../firebase/database'
import Accepted from '../components/accepted'
import { getUid, isEmailConfirmed } from '../firebase/auth'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment')

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
    const userId: any = await getUid()
    const userArticles = (await fetchWithEqual('/articles', 'writer', userId)).val()

    const dataSource = Object.keys(userArticles)
      .map((articleId, i) => {
        const {
          contents: { keyword, tags, title, countAll },
          dates: { accepted, writingStart },
        } = userArticles[articleId]
        const startBeauty = writingStart
          .split('-')
          .slice(0, 3)
          .join('-')
        const acceptedBeauty = accepted
          ? accepted
              .split('-')
              .slice(0, 3)
              .join('-')
          : ''
        const diff = Number(
          moment(acceptedBeauty).diff(moment(startBeauty), 'days')
        )

        return {
          key: i,
          id: userArticles[articleId],
          accepted,
          keyword,
          tags,
          title,
          countAll,
          days: diff,
        }
      })
      .filter((v: any) => v.status === 'accepted')
    receiveData(dataSource)
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
)(Accepted)
