import * as React from 'react'
import { Button } from 'antd'

const MailConfirmation: React.SFC<any> = ({ resendConfirmationMail }) => (
  <div>
    <h1>メールの確認をしてください．</h1>
    <Button type="primary" onClick={resendConfirmationMail}>
      メールを再送する
    </Button>
  </div>
)

export default MailConfirmation
