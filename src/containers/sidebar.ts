import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import * as moment from 'moment'

import { listenStart, push, read, set } from '../firebase/database'

import Sidebar from '../components/sidebar'
import { signOut, getUid, isEmailConfirmed } from '../firebase/auth';
import { message, Button } from 'antd';

type State = {
  position : '' | 'director' | 'writer'
  isAuth: boolean
  badges: {
    writings: boolean
    pendings: boolean
    rejects: boolean
    wrotes: boolean
  }
}

type StateUpdates = {
  receiveData: (dataSource: any) => State
  authed: () => State
  setBadge: ({ badges }: State) => State
}

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    position: '',
    isAuth: false,
    badges: {
      writings: false,
      pendings: false,
      rejects: false,
      wrotes: false
    }
  },
  {
    receiveData: (props) => ({ position }: State) => ({ ...props, position }),
    authed: (props) => () => ({ ...props, isAuth: true }),
    setBadge: (props) => ({ badges }) => ({ ...props, badges })
  }
)

type ActionProps = {
  fetchPosition: () => void
  fetchArticles: () => void
}

const WithHandlers = withHandlers <RouteComponentProps | any, ActionProps>({
  fetchPosition: ({ receiveData }: any) => async () => {
    const uid = await getUid()
    
    const position = (await read(`/users/${uid}/position`)).val()
    receiveData({ position })
  },
  fetchArticles: ({ setBadge }) => async () => {
    
    const uid = await getUid()
    await read(`/users/${uid}/articles`)
    listenStart(`/users/${uid}/articles`, async (articles: any) => {
      if (!articles) return
      let badges: any = {}
      Object.keys(articles).forEach((type) => {
        badges[type] = !!Object.keys(articles[type]).length 
      })
      setBadge({ badges })
    })
  }
})

type LifecycleProps = RouteComponentProps | ActionProps

const Lifecycle = lifecycle <LifecycleProps, {}, any> ({
  async componentDidMount () {
    
    const { fetchPosition, fetchArticles, history, authed } = this.props
    const userId = await getUid()
    
    
    if (!userId) {
      history.push('/login')
    } else {
      authed()
    }

    const confirmationPath = `/users/${userId}`
    const isConfirmedOnDB = (await read(`${confirmationPath}/mailConfirmation`)).val()
    const isMailConfirmed = isEmailConfirmed()
    
    if (isMailConfirmed && isConfirmedOnDB) {
      
      fetchPosition()
      fetchArticles()
    } else if (isMailConfirmed && !isConfirmedOnDB) {
      await set({
        path: confirmationPath,
        data: { mailConfirmation: true }
      })
      fetchPosition()
    } else {
      history.push('/mailConfirmation')
    }
  }
})
export default compose(
  withRouter,
  stateHandlers,
  WithHandlers,
  Lifecycle
)(Sidebar)
