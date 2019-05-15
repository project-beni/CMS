import * as React from 'react'
import { Button } from 'antd'

const Login: React.SFC<any> = ({ doLogin }) => (
  <Button onClick={() => {doLogin({ mail: 'ta@asdf.asdf', pass: 'asdfasdf' })}}></Button>
)

export default Login
