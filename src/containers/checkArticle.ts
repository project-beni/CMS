import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
const { editorStateFromRaw, editorStateToJSON } = require('megadraft')

import { listenStart, push, read, set, remove } from '../firebase/database'

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
  countAll: number
}

export type StateUpdates = {
  updateBody: ({ body } : State) => State
  receiveData: ({ body }: State) => State
  setCounts: ({ counts }: State) => State
  setCountAll: ({ countAll }: State) => State
}

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    body: editorStateFromRaw(null),
    counts: [],
    countAll: 0
  },
  {
    updateBody: (props) => ({ body }) => ({ ...props, body }),
    receiveData: (props) => ({ body }) => ({ ...props, body }),
    setCounts: (props) => ({ counts }) => ({ ...props, counts }),
    setCountAll: (props) => ({ countAll }) => ({ ...props, countAll })
  }
)

type ActionProps = {
  fetchData: () => void
  onChange: ({ body }: State) => void
}

const WithHandlers = withHandlers <RouteComponentProps | any, ActionProps>({
  fetchData: ({ setCounts, setCountAll, receiveData, match }) => async () => {
    read(`/articles/${match.params.id}`)
      .then((snapshot) => {
        
        const { contents: { body }} = snapshot.val()
        console.log(body)
        console.log(editorStateFromRaw(JSON.parse(body)))
        
        
        receiveData({ body: editorStateFromRaw(JSON.parse(body)) })
        
        const changed = JSON.parse(body).blocks
        
        const counts = changed.map((content: any) => {
          return {
            count: content.text.length,
            type: content.type
          }
        })

        let countAll = 0
        counts.forEach(({count, type}: any) => {
          if (type === 'paragraph') {
            countAll += count
          }
        })
        setCountAll({ countAll })
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
  save: ({ body, match, countAll }) => () => {
    const article = editorStateToJSON(body)
    
    set({
      path: `/articles/${match.params.id}/contents`,
      data: { body: article, countAll }
    })
      .then(() => {
        message.success('保存しました')
      })
      .catch((err) => {
        message.error(err.message)
      })
  },
  reject: ({ body, match, history, countAll }) => async () => {
    // save
    const article = editorStateToJSON(body)
    
    set({
      path: `/articles/${match.params.id}/contents`,
      data: { body: article, countAll }
    })
      .then(() => {
        message.success('保存しました')
      })
      .catch((err) => {
        message.error(err.message)
      })

    const writerId = (await read(`/articles/${match.params.id}/writer`)).val()
    const rootPath = `/articles/${match.params.id}`

    // remove pendings status instead of rejects
    await push({ path: `/users/${writerId}/articles/rejects`, data: match.params.id })
    let removePath = ''
    const articles: any = (await read(`/users/${writerId}/articles/pendings`)).val()
    console.log(articles)
    
    Object.keys(articles).forEach((key: any) => {
      if (articles[key] === match.params.id) {
        removePath = `/users/${writerId}/articles/pendings/${key}`
      }
    })
    await remove({ path: removePath })

    await set({
      path: `${rootPath}/contents`,
      data: { body: article, countAll }
    })
    set({ path: `${rootPath}`, data: { status: 'rejected' } })
      .then(() => {
        message.warn('記事を差し戻しました')
        history.push('/checkList')
      })
      .catch((err) => {
        message.error(err.message)
      })
  },
  recieve: ({ body, match, history, countAll }) => async () => {
    // save
    const article = editorStateToJSON(body)
    
    set({
      path: `/articles/${match.params.id}/contents`,
      data: { body: article, countAll }
    })
      .then(() => {
        message.success('保存しました')
      })
      .catch((err) => {
        message.error(err.message)
      })
    const rootPath = `/articles/${match.params.id}`
    const writerId = (await read(`/articles/${match.params.id}/writer`)).val()

    // remove pendings status instead of rejects
    await push({ path: `/users/${writerId}/articles/wrotes`, data: match.params.id })
    let removePath = ''
    const articles: any = (await read(`/users/${writerId}/articles/pendings`)).val()
    Object.keys(articles).forEach((key: any) => {
      if (articles[key] === match.params.id) {
        removePath = `/users/${writerId}/articles/pendings/${key}`
      }
    })
    await remove({ path: removePath })

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
