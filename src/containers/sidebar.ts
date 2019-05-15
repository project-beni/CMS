import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import Sidebar from '../components/sidebar'

type State = {
  selected: string
}

const stateHandlers = withStateHandlers <State, any> (
  {
    selected: 'asdf'
  },
  {}
)

export default compose(
  stateHandlers
)(Sidebar)
