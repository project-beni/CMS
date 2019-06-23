import { compose, withHandlers } from 'recompose'

import MailConfirmation from '../components/mailConfirmation'

import { verify } from '../firebase/auth'
import { message } from 'antd'

type Handlers = {
  resendConfirmationMail: () => void
}

const WithHandlers = withHandlers <{}, Handlers>({
  resendConfirmationMail: () => async () => {
    await verify()
    message.success('確認メールを再送しました．')
  }
})

export default compose(
  WithHandlers
)(MailConfirmation)
