import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps } from 'react-router-dom'
import { parse } from 'query-string'

import { listenStart, read, set } from '../firebase/database'
import AcceptedList from '../components/acceptedList'
import { getUid, isEmailConfirmed } from '../firebase/auth'
import { withRouter } from 'react-router';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment')

type Filter = {
  text: string
  value: string
}

type State = {
  dataSource?: any
  isLoading?: boolean
  currentPage: number
  tagFilter: Filter[]
  categoryFilter: Filter[]
  filteredTags: string[]
}

type StateUpdates = {
  receiveData: (dataSource: any) => State
  changePagination: (page: number) => State
  setFilters: ({ tagFilter, categoryFilter }: State) => State
  setDefaultFilter: ({ filteredTags }: State) => State
}

const stateHandlers = withStateHandlers<State & any, StateUpdates>(
  {
    dataSource: { filters: {} },
    isLoading: true,
    currentPage: 1,
    tagFilter: [],
    categoryFilter: []
  },
  {
    receiveData: (props) => (dataSource) => ({
      ...props,
      dataSource,
      isLoading: false,
    }),
    changePagination:(props) => (page) => {
      return {
        ...props,
        currentPage: page
      }
    },
    setFilters: (props) => ({ tagFilter, categoryFilter }) => ({
      ...props,
      tagFilter,
      categoryFilter
    }),
    setDefaultFilter: (props) => ({ filteredTags }) => ({ ...props, filteredTags})
  }
)

type ActionProps = {
  fetchData: () => void
  checkArticle: ({ id }: { id: string }) => void
  pagination: (page: number) => void
}

const WithHandlers = withHandlers<RouteComponentProps | any, ActionProps>({
  fetchData: ({ receiveData, setFilters }: any) => async () => {
    const users = (await read('/users')).val()
    const categories = (await read('categories')).val()
    const tags = (await read('tags')).val()

    setFilters({
      tagFilter: Object.keys(tags).map((key) => ({text: tags[key], value: tags[key]})),
      categoryFilter: Object.keys(categories).map((key) => ({text: categories[key], value: categories[key]}))
    })

    listenStart('/articles', (val: any) => {
      const writerFilters: any = []
      const dateFilters: any = []

      if (val) {
        const dataSource: any = { list: [] }
        Object.keys(val).forEach((key, i) => {
          if (val[key].status === 'accepted') {
            const {
              contents: { keyword, tags, title, countAll, categories, body },
              dates: { ordered, pending, accepted, writingStart },
              writer,
            } = val[key]

            const types = JSON.parse(body).blocks.map((content: any) => content.text ? content.type : null).filter((v: string) => v)
            const existTwitter = types.indexOf('twitter-link')
            const existLink = types.indexOf('outside-link')

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

            const nickname = users[writer].profiles
              ? users[writer].profiles.nickname
                ? users[writer].profiles.nickname
                : ''
              : ''

            dataSource.list.push({
              key: i,
              id: key,
              ordered,
              pending,
              accepted,
              keyword,
              tags,
              title,
              countAll,
              categories,
              writer: nickname,
              days: diff,
              types: [ existTwitter, existLink ]
            })

            // generate writer filter
            if (nickname) {
              let f = true
              writerFilters.forEach(({ text }: any) => {
                if (text === nickname) f = false
              })
              if (f) writerFilters.push({ text: nickname, value: nickname })
            }

            // generate accepted date filter
            if (accepted) {
              let f = true
              const d = accepted.split('-').slice(0, 2)
              const beauty = `${d[0]}年${d[1]}`
              dateFilters.forEach(({ value }: any) => {
                if (value === beauty) f = false
              })
              if (f) dateFilters.push({ text: `${beauty}月`, value: beauty })
            }
          }
        })
        dataSource.filters = { writerFilters, dateFilters }

        receiveData(dataSource)
      } else {
        receiveData({})
      }
    })
  },
  checkArticle: ({ history }) => async ({ id }) => {
    history.push(`/articles/acceptedList/${id}`)
  },
  pagination: ({ history, changePagination }) => (page) => {
    history.push(`/articles/acceptedList?page=${page}`)
    changePagination(page)
  },
  filterTags: () => (value: any, { tags }: any) => {
    if (!tags[1]) {
      return tags[0].indexOf(value) === 0
    } else {
      return tags[0].indexOf(value) === 0 || tags[1].indexOf(value) === 0
    }
  }
})

type LifecycleProps = RouteComponentProps | ActionProps

const Lifecycle = lifecycle<LifecycleProps, {}, any>({
  async componentDidMount() {
    const { fetchData, history, location, changePagination, setDefaultFilter } = this.props
    const userId = await getUid()
    const { page, tags }: any = parse(location.search)
    setDefaultFilter({ filteredTags: tags })
    changePagination(Number(page))

    

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
  withRouter,
  WithHandlers,
  Lifecycle
)(AcceptedList)
