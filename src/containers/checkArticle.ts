import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
const { editorStateFromRaw, editorStateToJSON } = require('megadraft')

import { listenStart, push, read, set } from '../firebase/database'

import CheckArticle from '../components/checkArticle'
import { signOut, getUid, isEmailConfirmed } from '../firebase/auth';
import { message, Button } from 'antd';

type State = {
  body?: any
  comment?: string
  counts: {
    type: 'header-one' | 'header-two' | 'header-three' | 'paragraph' | 'unstyled'
    count: number
  }[]
}

export type StateUpdates = {
  updateBody: ({ body } : State) => State
  receiveData: ({ body }: State) => State
  setCounts: ({ counts }: State) => State
}

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    body: editorStateFromRaw(null),
    counts: []
  },
  {
    updateBody: (props) => ({ body }) => ({ ...props, body }),
    receiveData: (props) => ({ body }) => ({ ...props, body }),
    setCounts: (props) => ({ counts }) => ({ ...props, counts }) 
  }
)

type ActionProps = {
  fetchData: () => void
  onChange: ({ body }: State) => void
}

const WithHandlers = withHandlers <RouteComponentProps | any, ActionProps>({
  fetchData: ({ setCounts, receiveData, match }) => () => {
    read(`/articles/${match.params.id}`)
      .then((snapshot) => {
        const { contents: { body }} = snapshot.val()
        receiveData({ body: editorStateFromRaw(JSON.parse(body)) })
        const changed = JSON.parse(body).blocks
        
        const counts = changed.map((content: any) => {
          return {
            count: content.text.length,
            type: content.type
          }
        })
        setCounts({ counts })
      })
  },
  onChange: ({ updateBody, setCounts }) => (updated: any) => {
    const changed = updated.getCurrentContent().getBlocksAsArray()
    const counts = changed.map((content: any) => {
      return {
        count: content.text.length,
        type: content.type
      }
    })
    
    setCounts({ counts })
    updateBody({ body: updated })
  },
  save: ({ body, match }) => () => {
    const article = editorStateToJSON(body)
    
    set({ path: `/articles/${match.params.id}/contents`, data: { body: article } })
      .then(() => {
        message.success('保存しました')
      })
      .catch((err) => {
        message.error(err.message)
      })
  },
  reject: ({ body, match, history, comment }) => async () => {
    // if (!comment) {
    //   message.error('差し戻す場合はコメントを入力してください')
    //   return
    // }
    const rootPath = `/articles/${match.params.id}`
    const article = editorStateToJSON(body)
    await set({ path: `${rootPath}/contents`, data: { body: article } })
    set({ path: `${rootPath}`, data: { status: 'rejected' } })
      .then(() => {
        message.warn('記事を差し戻しました')
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
        message.success('記事を受理しました')
        history.push('/checkList')
      })
  }
})

type LifecycleProps = RouteComponentProps | ActionProps

const Lifecycle = lifecycle <LifecycleProps, {}, any> ({
  async componentDidMount () {
    const { fetchData, history, updateBody } = this.props
    const userId = await getUid()

    const confirmationPath = `/users/${userId}`
    const isConfirmedOnDB = (await read(`${confirmationPath}/mailConfirmation`)).val()
    const isMailConfirmed = isEmailConfirmed()
    
    if (isMailConfirmed && isConfirmedOnDB) {
      fetchData()
    } else if (isMailConfirmed && !isConfirmedOnDB) {
      await set({
        path: confirmationPath,
        data: { mailConfirmation: true }
      })
      fetchData()
    } else {
      history.push('/mailConfirmation')
    }
  }
})
export default compose(
  stateHandlers,
  WithHandlers,
  Lifecycle
)(CheckArticle)
