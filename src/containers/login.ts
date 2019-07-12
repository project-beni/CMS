import { connect } from 'react-redux'
import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
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

const WithStateHandlers = withStateHandlers <any, any> (
    {
      isLoading: false
    },
    {
      toggleLoading: (props) => () => ({ isLoading: !props.isLoading })
    }
  )

const WithHandlers = withHandlers <RouteComponentProps | any, Actions> ({
  onLogin: ({ history, toggleLoading }) => ({ mail, pass })=> {
    toggleLoading()
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
        toggleLoading()
        message.error(err.message, 10)
      })
  }
})

const Lifecycle = lifecycle <any, {}> ({
  componentDidMount() {}
})

export default compose(
  WithStateHandlers,
  WithHandlers,
  Lifecycle
)(Login)

