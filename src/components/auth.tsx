import * as React from 'react'
import { Redirect } from 'react-router'

const Auth: React.SFC<any> = ({ children, isAuth }) =>
  isAuth ? children : <Redirect to="/login" />

export default Auth
