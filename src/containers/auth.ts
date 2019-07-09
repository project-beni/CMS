import * as React from 'react'
import { compose, lifecycle, withStateHandlers } from 'recompose'
import Cancellationtoken from 'cancellationtoken'

import { isLogedIn, loglog } from '../firebase/auth'
import Auth from '../components/auth'

type State = {
  isAuth: boolean
}

type StateHandlers = {
  authenticated: () => State
}

const WithStateHandlers = withStateHandlers<State, StateHandlers> (
  {
    isAuth: true,
  },
  {
    authenticated: (props) => () => ({
      ...props,
      isAuth: true
    })
  }
)

const LifeCycle = lifecycle<any, {}> ({
  componentDidMount () {
    // const { authenticated } = this.props
    // const asdf: any = loglog()
    // console.log(asdf.uid);
    // if (asdf.uid) {
    //   authenticated()
    // }
  }
})

export default compose(
  WithStateHandlers,
  LifeCycle
)(Auth)
