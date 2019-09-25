import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps } from 'react-router-dom'

import { read, set, fetchWithEqual } from '../firebase/database'
import RecruitingArticles from '../components/orderedArticles'
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
    const articles: any = (await fetchWithEqual('/articles', 'writer', userId)).val()
    
    const writingArticles: any = Object.keys(articles)
      .map((articleId) => articles[articleId].status === 'writing' ? {...articles[articleId], articleId } : null)
      .filter(v => v)
    
    const dataSource = writingArticles.map((article: any, i: number) => {
      const {
        contents: { keyword, tags, title },
        dates: { ordered, writingStart },
        articleId
      } = article
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

      return {
        key: i,
        id: articleId,
        ordered,
        keyword,
        tags,
        title,
        countdown,
      }
    })
    
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
)(RecruitingArticles)
