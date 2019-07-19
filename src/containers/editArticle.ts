import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps } from 'react-router-dom'
const {
  editorStateFromRaw,
  editorStateToJSON
} = require('megadraft')

import { push, read, set, remove } from '../firebase/database'

import RecruitingArticles from '../components/editArticle'
import { getUid, isEmailConfirmed } from '../firebase/auth'
import { message } from 'antd'
import * as moment from 'moment'

type Body = {
  body: any
  comment?: string
  isDrawerVisible: boolean
  counts: {
    type: 'header-one' | 'header-two' | 'header-three' | 'paragraph' | 'unstyled'
    count: number
    height: number
  }[]
  countAll: number
}

export type State = Body

export type StateUpdates = {
  updateBody: ({ body }: State) => State
  receiveData: ({ body }: State) => State
  toggleDrawer: ({ isDrawerVisible }: State) => State
  setCounts: ({ counts }: State) => State
  setCountAll: ({ countAll }: State) => State
}

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    body: editorStateFromRaw(null),
    isDrawerVisible: false,
    counts: [],
    countAll: 0
  },
  {
    updateBody: (props) => ({ body }) => ({ ...props, body }),
    receiveData: (props) => ({ body }) => ({ ...props, body}),
    toggleDrawer: (props) => () => ({ ...props, isDrawerVisible: !props.isDrawerVisible }),
    setCounts: (props) => ({ counts }) => ({ ...props, counts }),
    setCountAll: (props) => ({ countAll }) => ({ ...props, countAll })
  }
)

type ActionProps = {
  fetchData: () => void
  onChange: ({ body }: State) => void
}

const WithHandlers = withHandlers <RouteComponentProps | any, ActionProps>({
  fetchData: ({ receiveData, setCountAll, setCounts, match }) => () => {
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

        let countAll = 0
        counts.forEach(({count, type}: any) => {
          if (type === 'paragraph') {
            countAll += count
          }
        })
        setCountAll({ countAll })

        const asdf = document.getElementsByClassName('public-DraftEditor-content')
        const contents = asdf[0].childNodes[0].childNodes
        let styles: any = []
        Array.prototype.forEach.call(contents, (content: any, i: number) => {
          const style: any = content.currentStyle || window.getComputedStyle(content)
          styles[i] = {
            height: content.offsetHeight,
            marginTop: style.marginTop,
            marginBottom: style.marginBottom,
            count: counts[i].count,
            type: counts[i].type
          }
        })
        console.log(styles);
        
        
        
        setCounts({ counts: styles })
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
    updateBody({ body: updated })

    const asdf = document.getElementsByClassName('public-DraftEditor-content')
    const contents = asdf[0].childNodes[0].childNodes
    let styles: any = []
    Array.prototype.forEach.call(contents, (content: any, i: number) => {
      const style: any = content.currentStyle || window.getComputedStyle(content)
      styles[i] = {
        height: content.offsetHeight,
        marginTop: style.marginTop,
        marginBottom: style.marginBottom,
        count: counts[i].count,
        type: counts[i].type
      }
    })
    setCounts({ counts: styles })
    
    
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
  submit: ({ body, match, history, countAll }) => async () => {
    const rootPath = `/articles/${match.params.id}`
    const uid = await getUid()
    const article = editorStateToJSON(body)
    await push({ path: `/users/${uid}/articles/pendings`, data: match.params.id })

    // remove old status
    let removePath = ''
    const writingArticles: any = (await read(`/users/${uid}/articles/writings`)).val()
    const rejectedArticles: any = (await read(`/users/${uid}/articles/rejects`)).val()
    if (writingArticles) {
      Object.keys(writingArticles).forEach((key: any) => {
        if (writingArticles[key] === match.params.id) {
          removePath = `/users/${uid}/articles/writings/${key}`
        }
      })
    }
    if (rejectedArticles) {
      Object.keys(rejectedArticles).forEach((key: any) => {
        if (rejectedArticles[key] === match.params.id) {
          removePath = `/users/${uid}/articles/rejects/${key}`
        }
      })
    }
    await remove({ path: removePath })

    await set({
      path: `${rootPath}/contents`,
      data: { body: article, countAll }
    })
    const date = {
      pending: moment().format('YYYY-MM-DD-hh-mm-ss')
    }
    await set({ path: `/articles/${match.params.id}/dates`, data: date })
    set({ path: `${rootPath}`, data: { status: 'pending' } })
      .then(() => {
        message.success('記事を保存し，提出しました')
        history.push('/articles/ordered')
      })
  }
})

type LifecycleProps = RouteComponentProps | ActionProps

const Lifecycle = lifecycle <LifecycleProps, {}, any> ({
  async componentDidMount () {
    const { fetchData, history } = this.props
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
)(RecruitingArticles)
