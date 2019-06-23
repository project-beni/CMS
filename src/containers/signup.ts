import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import * as moment from 'moment'

import Signup from '../components/signup'

import { createUser, signupWithLink, getUid, verify } from '../firebase/auth'
import { set } from '../firebase/database';

type State = {
  selected: string
}

const stateHandlers = withStateHandlers <State, any> (
  {
    selected: 'asdf'
  },
  {
    submit: () => {}
  }
)

const now = moment().format('YYYY-MM-DD-hh-mm')

type FormValues = {
  mail: string
  firstName: string
  familyName: string
  nickname: string
  pass: string
}

type Handlers = {
  onSubmit: ({
    firstName,
    familyName,
    nickname,
    mail,
    pass
  }: FormValues) => void
}

const WithHandlers = withHandlers <RouteComponentProps, Handlers>({
  onSubmit: ({ history }) => ({ mail, firstName, familyName, nickname, pass }) => {
    createUser({ mail, pass })
      .then(async () => {
        const defaultUser = {
          profiles: { mail, firstName, familyName, nickname },
          mailConfirmation: false,
          position: 'writer'
        }
        set({ path: `/users/${await getUid()}`, data: defaultUser })
          .then(() => {
            verify()
            history.push('/order')
          })
      })
  }
})

const Lifecyle = lifecycle <RouteComponentProps, {}> ({
  componentDidMount() {
    
  }
})

export default compose(
  withRouter,
  stateHandlers,
  WithHandlers,
  Lifecyle
)(Signup)
