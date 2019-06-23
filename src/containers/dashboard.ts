import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import dashboard from '../components/dashboard'

export default compose()(dashboard)
