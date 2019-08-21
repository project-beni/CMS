import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps } from 'react-router-dom'
import * as moment from 'moment'

import { read } from '../firebase/database'
import DateSummary from '../components/dateSummary'

type State = {
  articleData: any
  isLoading: boolean
  compareDate: any
}

type StateUpdates = {
  receiveData: (articleData: any) => State
  updateDate: ({ compareDate }: State) => State
}

const stateHandlers = withStateHandlers<State, StateUpdates>(
  {
    articleData: [],
    isLoading: true,
    compareDate: moment(),
  },
  {
    receiveData: props => ({ articleData }) => ({
      ...props,
      articleData,
      isLoading: false,
    }),
    updateDate: props => ({ compareDate }) => ({
      ...props,
      compareDate,
    }),
  }
)

type ActionProps = {
  fetchData: () => void
  changeDate: (date: any) => void
}

const WithHandlers = withHandlers<RouteComponentProps | any, ActionProps>({
  fetchData: ({ receiveData }: any) => async () => {
    const users = (await read('/users')).val()
    const articles = (await read('/articles')).val()
    const todayNew: any = {
      head: '新規',
      ordered: 0,
      writingStart: 0,
      pending: 0,
      rejected: 0,
      accepted: 0,
      key: 'new',
    }
    const todayRegular: any = {
      head: '正規',
      ordered: 0,
      writingStart: 0,
      pending: 0,
      rejected: 0,
      accepted: 0,
      key: 'regular',
    }
    const todayAll: any = {
      head: '合計',
      ordered: 0,
      writingStart: 0,
      pending: 0,
      rejected: 0,
      accepted: 0,
      key: 'regular',
    }

    Object.keys(articles).forEach(key => {
      Object.keys(articles[key].dates).forEach(date => {
        const beautied = articles[key].dates[date].slice(0, 10)
        if (Number(moment(beautied).diff(moment(), 'days')) === 0) {
          let writerPosition = ''
          try {
            writerPosition = users[articles[key].writer].writerPosition
          } catch (err) {
            writerPosition = 'new'
          }
          if (writerPosition === 'regular') {
            todayRegular[date] += 1
            todayAll[date] += 1
          } else {
            todayNew[date] += 1
            todayAll[date] += 1
          }
        }
      })
    })
    receiveData({ articleData: [todayNew, todayRegular, todayAll] })
  },
  changeDate: ({ updateDate, receiveData }) => async compareDate => {
    updateDate({ compareDate })
    const users = (await read('/users')).val()
    const articles = (await read('/articles')).val()
    const todayNew: any = {
      head: '新規',
      ordered: 0,
      writingStart: 0,
      pending: 0,
      rejected: 0,
      accepted: 0,
      key: 'new',
    }
    const todayRegular: any = {
      head: '正規',
      ordered: 0,
      writingStart: 0,
      pending: 0,
      rejected: 0,
      accepted: 0,
      key: 'regular',
    }
    const todayAll: any = {
      head: '合計',
      ordered: 0,
      writingStart: 0,
      pending: 0,
      rejected: 0,
      accepted: 0,
      key: 'result',
    }

    Object.keys(articles).forEach(key => {
      Object.keys(articles[key].dates).forEach(date => {
        const beautied = articles[key].dates[date].slice(0, 10)
        if (
          Number(moment(beautied).diff(moment(), 'days')) ===
          Number(
            moment(compareDate.format('YYYY-MM-DD')).diff(moment(), 'days')
          )
        ) {
          let writerPosition = ''
          try {
            writerPosition = users[articles[key].writer].writerPosition
          } catch (err) {
            writerPosition = 'new'
          }
          if (writerPosition === 'regular') {
            todayRegular[date] += 1
            todayAll[date] += 1
          } else {
            todayNew[date] += 1
            todayAll[date] += 1
          }
        }
      })
    })
    receiveData({ articleData: [todayNew, todayRegular, todayAll] })
  },
})

type LifecycleProps = RouteComponentProps | ActionProps

const Lifecycle = lifecycle<LifecycleProps, {}, any>({
  async componentDidMount() {
    const { fetchData } = this.props
    fetchData()
  },
})
export default compose(
  stateHandlers,
  WithHandlers,
  Lifecycle
)(DateSummary)
