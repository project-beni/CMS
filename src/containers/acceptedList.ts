import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps } from 'react-router-dom'

import { listenStart, read, set } from '../firebase/database'

import AcceptedList from '../components/acceptedList'
import { getUid, isEmailConfirmed } from '../firebase/auth'

type State = {
  dataSource?: any
  isLoading?: boolean
}

type StateUpdates = {
  receiveData: (dataSource: any) => State
}

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    dataSource: { filters: {} },
    isLoading: true
  },
  {
    receiveData: () => (dataSource: any) => ({
      dataSource,
      isLoading: false
    })
  }
)

type ActionProps = {
  fetchData: () => void
  checkArticle: ({ id }: { id: string }) => void
}

const WithHandlers = withHandlers <RouteComponentProps | any, ActionProps>({
  fetchData: ({ receiveData }: any) => async () => {
    const users = (await read('/users')).val()
    
    listenStart('/articles', (val: any) => {
      let writerFilters: any = []
      let dateFilters: any = []
      
      if (val) {
        let dataSource: any = { list: [] }
        Object.keys(val).forEach((key, i) => {
          
          if (val[key].status === 'accepted') {

            const {
              contents: { keyword, tags, title, countAll, categories },
              dates: { ordered, pending, accepted },
              writer
            } = val[key]

            const nickname = users[writer].profiles ? (
              users[writer].profiles.nickname ? users[writer].profiles.nickname : ''
            ) : '' 

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
              writer: nickname
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
        console.log(dataSource)
        
        
        receiveData(dataSource)
      } else {
        receiveData({})
      }
    })
  },
  checkArticle: ({ history, dataSource }) => async ({ id }) => {
    history.push(`/articles/acceptedList/${id}`)
  }
})

type LifecycleProps = RouteComponentProps | ActionProps

const Lifecycle = lifecycle <LifecycleProps, {}, any> ({
  async componentDidMount () {
    const { fetchData, history } = this.props
    const userId = await getUid()
    
    if (!userId) history.push('/login')

    const confirmationPath = `/users/${userId}`
    const isConfirmedOnDB = (await read(`${confirmationPath}/mailConfirmation`)).val()
    const isMailConfirmed = isEmailConfirmed()
    
    if (isMailConfirmed && isConfirmedOnDB) {
      fetchData()
    } else if (isMailConfirmed && !isConfirmedOnDB) {
      await set({
        path: confirmationPath,
        data: { mailConfirmation: true }
      })
      fetchData()
    } else {
      history.push('/mailConfirmation')
    }
  }
})
export default compose(
  stateHandlers,
  WithHandlers,
  Lifecycle
)(AcceptedList)
