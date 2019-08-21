import { compose, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { message } from 'antd'

import Signup from '../components/signup'
import { createUser, getUid, verify } from '../firebase/auth'
import { set } from '../firebase/database'

type State = {
  isLoading: boolean
}

type StateHandlers = {
  toggleLoading: ({ isLoading }: State) => State
}

const stateHandlers = withStateHandlers<State, StateHandlers>(
  {
    isLoading: false,
  },
  {
    toggleLoading: props => () => ({ ...props, isLoading: !props.isLoading }),
  }
)

type FormValues = {
  mail: string
  nickname: string
  pass: string
}

type Handlers = {
  onSubmit: ({ nickname, mail, pass }: FormValues) => void
}

const WithHandlers = withHandlers<RouteComponentProps | any, Handlers>({
  onSubmit: ({ history, toggleLoading }) => ({ mail, nickname, pass }) => {
    toggleLoading()
    if (!mail || !nickname || !pass) {
      message.error('全て入力してください')
      toggleLoading()
      return
    }
    createUser({ mail, pass }).then(async () => {
      const defaultUser = {
        profiles: { mail, nickname },
        mailConfirmation: false,
        position: 'writer',
      }
      set({ path: `/users/${await getUid()}`, data: defaultUser }).then(() => {
        verify()
        message.success('設定されたメールに確認メールを送信しました。', 10)
        toggleLoading()
        history.push('/articles/recruiting')
      })
    })
  },
})

export default compose(
  withRouter,
  stateHandlers,
  WithHandlers
)(Signup)
