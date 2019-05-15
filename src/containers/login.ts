import { connect } from 'react-redux'
import { compose, lifecycle } from 'recompose'
import { Dispatch } from 'redux'
import * as firebase from 'firebase'

import Login from '../components/login'

import { signIn } from '../firebase/auth'

import { loginSucceed } from '../stores/actions/auth'

const mapStateToProps = (state: any) => ({
  isAuth: state.isAuth
})

type Login = {
  mail: string
  pass: string
}

const mapDispatchToProps = (dispatch: any) => ({
  doLogin: async ({ mail, pass }: Login) => {
    await signIn(mail, pass)
      .then(() => {
        console.log('succeed')
      })
      .catch((err: Error) => {
        console.log(err)
      })
  },
  refLogin: () => {
    firebase.auth().onAuthStateChanged((user: any) => {
      if (!user) {
        return
      }
      dispatch(loginSucceed(user))
    })
  }
})

const Lifecycle = lifecycle <any, {}> ({
  componentDidMount() {
    this.props.refLogin()
  }
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  Lifecycle
)(Login)

