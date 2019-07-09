import { connect } from 'react-redux'
import { compose, lifecycle, withHandlers } from 'recompose'
import { message } from 'antd'

import Login from '../components/login'

import { signIn, getUid } from '../firebase/auth'

import { RouteComponentProps } from 'react-router';
import { read } from '../firebase/database';

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
      .then(async () => {
        const uid = await getUid()
        const position = (await read(`/users/${uid}/position`)).val()
        switch (position) {
          case 'writer':
            history.push('/articles/recruiting')
            break
          case 'director':
            history.push('/order')
        }
      })
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

