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
}

type StateUpdates = {
  receiveData: (dataSource: any) => State
  authed: () => State
}

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    position: '',
    isAuth: false
  },
  {
    receiveData: (props) => ({ position }: State) => ({ ...props, position }),
    authed: (props) => () => ({ ...props, isAuth: true })
  }
)

type ActionProps = {
  fetchPosition: () => void
}

const WithHandlers = withHandlers <RouteComponentProps | any, ActionProps>({
  fetchPosition: ({ receiveData }: any) => async () => {
    const uid = await getUid()
    const position = (await read(`/users/${uid}/position`)).val()
    receiveData({ position })
  }
})

type LifecycleProps = RouteComponentProps | ActionProps

const Lifecycle = lifecycle <LifecycleProps, {}, any> ({
  async componentDidMount () {
    const { fetchPosition, history, authed } = this.props
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
