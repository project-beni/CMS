import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import Order from '../components/order'

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

const WithHandlers = withHandlers <RouteComponentProps|any, {}>({
  onSubmit: (props) => (a: any) => {
    console.log(a)
  }
})

const Lifecyle = lifecycle <RouteComponentProps, {}> ({
  componentDidMount() {}
})

export default compose(
  withRouter,
  stateHandlers,
  WithHandlers,
  Lifecyle
)(Order)
