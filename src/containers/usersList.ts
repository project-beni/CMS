import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps } from 'react-router-dom'
const {
  editorStateFromRaw,
  editorStateToJSON
} = require('megadraft')

import { read, set } from '../firebase/database'

import UsersList from '../components/usersList'
import { getUid, isEmailConfirmed } from '../firebase/auth'

type Users = {
  [key: string]: {
    profiles: {
      nickname: string
    }
    ordered: number
    rejected: number
    accepted: number
  }
}

type State = {
  dataSource: {
    users: Users
    userArticles: {
      [key: string]: {
        title: string
        keywords: string[]
        categories: string[]
        tags: string[]
        count: number
        id: string
      }[]
    }
  }
}

export type StateUpdates = {
  setUsersInfo: (users: Users) => State
}

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    dataSource: {
      users: {},
      userArticles: {
        ordered: [],
        rejected: [],
        accepted: []
      }
    }
  },
  {
    setUsersInfo: (props) => (users) => {
      let data: any = []
      for (let key in users) {
        const { profiles: { nickname }} = users[key]
        data.push({
          nickname
        })
      }
      return data
    }
  }
)

type WithHandlersProps = RouteComponentProps<{id: string}> & StateUpdates

type ActionProps = {
  fetchData: () => void
}

const WithHandlers = withHandlers <WithHandlersProps, ActionProps>({
  fetchData: ({ match }) => async () => {
    const users = (await read('/users')).val()
  },
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
)(UsersList)
