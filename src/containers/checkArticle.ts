import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
const { editorStateFromRaw } = require('megadraft')

import { listenStart, push, read, set } from '../firebase/database'

import CheckArticle from '../components/checkArticle'
import { signOut, getUid, isEmailConfirmed } from '../firebase/auth';
import { message, Button } from 'antd';

type State = {
  body?: any
  title?: string
  comment?: string
}

export type StateUpdates = {
  updateBody: ({ body } : State) => State
}

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    body: {}
  },
  {
    updateBody: (props) => ({ body }) => ({ ...props, body })
  }
)

type ActionProps = {
  fetchData: () => void
  onChange: ({ body }: State) => void
}

const WithHandlers = withHandlers <RouteComponentProps | any, ActionProps>({
  fetchData: ({ receiveData, receiveTitle, match }) => () => {
    
    listenStart(
      `/articles/${match.params.id}`,
      ({ contents: { bodies, title }}: any
    ) => {  
      receiveData(bodies)
      receiveTitle(title)
    })
  },
  onChange: ({ updateBody }) => ({ body }) => {
    updateBody({ body })
  },
  reject: ({ body, match, history, comment }) => () => {
    if (!comment) {
      message.error('差し戻す場合はコメントを入力してください')
      return
    }
    const rootPath = `/articles/${match.params.id}`
    set({ path: `${rootPath}/contents`, data:{ comment }})
    set({ path: `${rootPath}`, data: { status: 'rejected' } })
      .then(() => {
        history.push('/checkList')
      })
      .catch((err) => {
        message.error(err.message)
      })
  },
  recieve: ({ body, match, history }) => () => {
    const rootPath = `/articles/${match.params.id}`
    set({ path: `${rootPath}`, data: { status: 'accepted' } })
      .then(() => {
        history.push('/checkList')
      })
  }
})

type LifecycleProps = RouteComponentProps | ActionProps

const Lifecycle = lifecycle <LifecycleProps, {}, any> ({
  async componentDidMount () {
    const { fetchData, history, updateBody } = this.props
    
    updateBody({ body: editorStateFromRaw(null)})
    const userId = await getUid()

    const confirmationPath = `/users/${userId}`
    const isConfirmedOnDB = (await read(`${confirmationPath}/mailConfirmation`)).val()
    const isMailConfirmed = isEmailConfirmed()
    
    if (isMailConfirmed && isConfirmedOnDB) {
      // fetchData()
    } else if (isMailConfirmed && !isConfirmedOnDB) {
      // await set({
      //   path: confirmationPath,
      //   data: { mailConfirmation: true }
      // })
      // fetchData()
    } else {
      // history.push('/mailConfirmation')
    }
  }
})
export default compose(
  stateHandlers,
  WithHandlers,
  Lifecycle
)(CheckArticle)
