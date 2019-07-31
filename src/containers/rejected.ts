import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import * as moment from 'moment'

import { listenStart, push, read, set } from '../firebase/database'

import Rejected from '../components/rejected'
import { signOut, getUid, isEmailConfirmed } from '../firebase/auth';
import { message, Button } from 'antd';

type State = {
  dataSource: any
  isLoading: boolean
}

type StateUpdates = {
  receiveData: (dataSource: any) => State
}

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    dataSource: [],
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
  editArticle: ({ id }: { id: string }) => void
}

const WithHandlers = withHandlers <RouteComponentProps | any, ActionProps>({
  fetchData: ({ receiveData }: any) => async () => {
    const userId = await getUid()
    listenStart(`/users/${userId}/articles/rejects`, async (val: any) => {
      if (val) {
        let dataSource: any = []
        await Promise.all(
          Object.keys(val).map(async (key, i) => {
            const {
              contents: { keyword, tags, title },
              dates: { rejected }
            } = (await read(`/articles/${val[key]}`)).val()
            dataSource.push({
              key: i,
              id: val[key],
              rejected,
              keyword,
              tags,
              title
            }) 
          })
        )
        receiveData(dataSource)
      } else {
        receiveData([])
      }
    })
    // listenStart('/articles', (val: any) => {
    //   if (val) {
    //     let dataSource: any = []
    //     Object.keys(val).forEach((key, i) => {
    //       if (val[key].status === 'rejected') {
    //         const {
    //           contents: { keyword, tags, title },
    //           dates: { ordered }
    //         } = val[key]
    //         dataSource.push({
    //           key: i,
    //           id: key,
    //           ordered,
    //           keyword,
    //           tags,
    //           title
    //         }) 
    //       }
    //     })
    //     receiveData(dataSource)
    //   } else {
    //     receiveData([])
    //   }
    // })
  },
  editArticle: ({ history, dataSource }) => async ({ id }) => {
    history.push(`/articles/edit/${id}`)
  }
})

type LifecycleProps = RouteComponentProps | ActionProps

const Lifecycle = lifecycle <LifecycleProps, {}, any> ({
  async componentDidMount () {
    const { fetchData, history } = this.props
    const userId = await getUid()

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
)(Rejected)
