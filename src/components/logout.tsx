import * as React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'

const sidebar: React.SFC<any> = ({ logout }) => (
  <Button
    onClick={logout}
  >
    ログアウト
  </Button>
)

export default sidebar
