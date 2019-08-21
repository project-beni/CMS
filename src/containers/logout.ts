import { compose, withHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import Logout from '../components/logout'
import { signOut } from '../firebase/auth'

const WithHandlers = withHandlers<RouteComponentProps | any, {}>({
  // TODO state types
  logout: ({ history }) => () => {
    signOut().then(() => {
      history.push('/login')
    })
  },
})

export default compose(
  withRouter,
  WithHandlers
)(Logout)
