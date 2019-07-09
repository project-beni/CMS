import { compose, lifecycle, withHandlers, withStateHandlers, branch, renderNothing } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import * as moment from 'moment'

import Signup from '../components/signup'

import { createUser, isEmailConfirmed, getUid, verify } from '../firebase/auth'
import { set, read } from '../firebase/database';
import Routes from '../routes';

const Lifecyle = lifecycle <RouteComponentProps, {}> ({
  async componentWillUpdate() {
    const confirmationPath = `users/${await getUid()}/mailConfirmation`
    const isConfirmedOnDB = (await read(confirmationPath)).val()
    const isConfirmed = isEmailConfirmed()
    if (!isConfirmed != isConfirmedOnDB) {
      await set({ path: confirmationPath, data: true })
    }
  }
})

export default compose(
  withRouter,
  Lifecyle
)(Signup)
