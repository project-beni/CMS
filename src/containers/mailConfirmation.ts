import { compose, withHandlers, lifecycle } from 'recompose'

import MailConfirmation from '../components/mailConfirmation'

import { verify, getUid, isEmailConfirmed } from '../firebase/auth'
import { read, set } from '../firebase/database'
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

const Lifecycle = lifecycle <any, {}> ({
  async componentDidMount () {
    const { history } = this.props
    const userId = await getUid()
    const confirmationPath = `/users/${userId}`
    const isConfirmedOnDB = (await read(`${confirmationPath}/mailConfirmation`)).val()
    const isMailConfirmed = isEmailConfirmed()
    
    if (isMailConfirmed && isConfirmedOnDB) {
      history.push('/articles/recruiting')
    } else if (isMailConfirmed && !isConfirmedOnDB) {
      await set({
        path: confirmationPath,
        data: { mailConfirmation: true }
      })
      history.push('/articles/recruiting')
    }
  }
})

export default compose(
  WithHandlers,
  Lifecycle
)(MailConfirmation)
