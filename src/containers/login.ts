import { connect } from 'react-redux'
import { compose, lifecycle, withHandlers } from 'recompose'
import { message } from 'antd'

import Login from '../components/login'

import { signIn } from '../firebase/auth'

import { RouteComponentProps } from 'react-router';

type Login = {
  mail: string
  pass: string
}

type Actions = {
  onLogin: ({mail, pass}: Login) => void
}

const WithHandlers = withHandlers <RouteComponentProps, Actions> ({
  onLogin: ({ history }) => ({ mail, pass })=> {
    signIn(mail, pass)
      .then(() => history.push('/order'))
      .catch((err: Error) => {
        message.error(err.message, 10)
      })
  }
})

const Lifecycle = lifecycle <any, {}> ({
  componentDidMount() {}
})

export default compose(
  WithHandlers,
  Lifecycle
)(Login)

