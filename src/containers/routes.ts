import { compose, lifecycle } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import Signup from '../components/signup'
import { isEmailConfirmed, getUid } from '../firebase/auth'
import { set, read } from '../firebase/database'

const Lifecyle = lifecycle<RouteComponentProps, {}>({
  async componentWillUpdate() {
    const confirmationPath = `users/${await getUid()}/mailConfirmation`
    const isConfirmedOnDB = (await read(confirmationPath)).val()
    const isConfirmed = isEmailConfirmed()
    if (!isConfirmed != isConfirmedOnDB) {
      await set({ path: confirmationPath, data: true })
    }
  },
})

export default compose(
  withRouter,
  Lifecyle
)(Signup)
