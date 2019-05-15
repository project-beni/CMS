import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import RecruitingArticles from '../components/recruitingArticles'

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
  submit: (props) => (a: any) => {
    console.log(a)
  }
})

export default compose(
  stateHandlers,
  WithHandlers
)(RecruitingArticles)
