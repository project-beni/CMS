import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps } from 'react-router-dom'

import { listenStart, read, set } from '../firebase/database'
import AllArticleList from '../components/allArticleList'
import { getUid, isEmailConfirmed } from '../firebase/auth'

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const moment = require('moment')

type Filter = {
  text: string
  value: string
}
type State = {
  dataSource: any
  isLoading: boolean
  tagFilter: Filter[]
  categoryFilter: Filter[]
}

type StateUpdates = {
  receiveData: (dataSource: any) => State
  setFilters: ({ tagFilter, categoryFilter }: State) => State
}

const stateHandlers = withStateHandlers<State, StateUpdates>(
  {
    dataSource: [],
    isLoading: true,
    tagFilter: [],
    categoryFilter: []
  },
  {
    receiveData: (props) => (dataSource: any) => ({
      ...props,
      dataSource,
      isLoading: false,
    }),
    setFilters: (props) => ({ tagFilter, categoryFilter }) => ({
      ...props,
      tagFilter,
      categoryFilter
    })
  }
)

type ActionProps = {
  fetchData: () => void
  editArticle: ({ id }: { id: string }) => void
  moreInfo: ({ id }: { id: string}) => void
}

const WithHandlers = withHandlers<RouteComponentProps | any, ActionProps>({
  fetchData: ({ receiveData, setFilters }) => async () => {
    const users = (await read('/users')).val()
    const categories = (await read('categories')).val()
    const tags = (await read('tags')).val()
    setFilters({
      tagFilter: Object.keys(tags).map((key) => ({text: tags[key], value: tags[key]})),
      categoryFilter: Object.keys(categories).map((key) => ({text: categories[key], value: categories[key]}))
    })
    listenStart(`/articles`, async (articles: any) => {
      const dataSource = await Promise.all(
        Object.keys(articles).map((key, i) => {
          const {
            status, type, writer, dates, isPublic, index,
            contents: { title, tags, categories }
          } = articles[key]
          

          return {
            key: i,
            id: key,
            status,
            type,
            dates,
            nickname: writer ? users[writer].profiles.nickname : '',
            writerPosition: writer ? users[writer].writerPosition : '',
            title,
            tags,
            categories,
            isPublic,
            index
          }
        })
      )
      receiveData(dataSource)
    })
  },
  editArticle: ({ history }) => async ({ id }) => {
    history.push(`/articles/edit/${id}`)
  },
  moreInfo: ({ history }) => ({ id }) => {
    history.push(`/articles/info/${id}`)
  }
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
)(AllArticleList)
