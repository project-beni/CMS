import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
const { editorStateFromRaw, editorStateToJSON } = require('megadraft')
import * as moment from 'moment'

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
    height: number
  }[]
  countAll: number
  title: string
  writer: string
  relatedQueries: string[]
  keyword: string[]
}

export type StateUpdates = {
  updateBody: ({ body } : State) => State
  receiveData: ({ body }: State) => State
  setCounts: ({ counts }: State) => State
  setCountAll: ({ countAll }: State) => State
  setHead: ({ writer, title}: State) => State
  setRelatedQueries: ({ relatedQueries }: State) => State
  setKeyword: ({ keyword }: State) => State
}

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    body: editorStateFromRaw(null),
    counts: [],
    countAll: 0,
    title: '',
    writer: '',
    relatedQueries: [],
    keyword: []
  },
  {
    updateBody: (props) => ({ body }) => ({ ...props, body }),
    receiveData: (props) => ({ body }) => ({ ...props, body }),
    setCounts: (props) => ({ counts }) => ({ ...props, counts }),
    setCountAll: (props) => ({ countAll }) => ({ ...props, countAll }),
    setHead: (props => ({ writer, title }) => ({ ...props, writer, title })),
    setRelatedQueries: (props) => ({ relatedQueries }) => ({ ...props, relatedQueries}),
    setKeyword: (props) => ({ keyword }) => ({ ...props, keyword })
  }
)

type ActionProps = {
  fetchData: () => void
  onChange: (updated: any) => void
}

const WithHandlers = withHandlers <RouteComponentProps | any, ActionProps>({
  fetchData: ({ setCounts, setCountAll, setKeyword, setRelatedQueries, setHead, receiveData, match }) => async () => {
    read(`/articles/${match.params.id}`)
      .then(async (snapshot) => {
        
        const { contents: { body, keyword, title }, writer } = snapshot.val()

        receiveData({ body: editorStateFromRaw(JSON.parse(body)) })
        setKeyword({ keyword: keyword })
        
        const { get } = require('axios')
        let searchWord: string = ''
        keyword.forEach((w: string) => {
          searchWord += `${w}`
        })
        
        get(`https://bizual-keywords-generat.herokuapp.com/api/v1/${searchWord}`)
          .then(({ data: { keywords } }: any) => {
            if (!keywords.length) {
              keywords.push(searchWord)
            }
            setRelatedQueries({ relatedQueries: keywords })
          })
          .catch((err: Error) => {
            message.error(`関連キーワードの取得に失敗しました：${err}`)
            setRelatedQueries({ relatedQueries: [searchWord] })
          })
        
        receiveData({ body: editorStateFromRaw(JSON.parse(body)) })
        const writerName = (await read(`/users/${writer}/profiles/nickname`)).val()
        setHead({ title, writer: writerName })
        
        const changed = JSON.parse(body).blocks
        
        const counts = changed.map((content: any) => {
          return {
            count: content.text.length,
            type: content.type,
            top: content.offsetTop
          }
        })

        let countAll = 0
        
        counts.forEach(({count, type}: any) => {
          if (type === 'paragraph' || type === 'unordered-list-item') {
            countAll += count
          }
        })
        setCountAll({ countAll })

        setTimeout(() => {
          const asdf = document.getElementsByClassName('public-DraftEditor-content')
          const contents = asdf[0].childNodes[0].childNodes

          let styles: any = []
          let countIndex = 0

          Array.prototype.forEach.call(contents, (content: any) => {
            if (content.className === 'public-DraftStyleDefault-ul') {
              Array.prototype.forEach.call(content.childNodes, (li: any) => {
                styles[countIndex] = {
                  count: counts[countIndex].count,
                  type: counts[countIndex].type,
                  top: li.offsetTop
                }
                countIndex++  
              })
            } else {
              styles[countIndex] = {
                count: counts[countIndex].count,
                type: counts[countIndex].type,
                top: content.offsetTop
              }
              countIndex++
            }
          })
          
          setCounts({ counts: styles })
        }, 1000)
      })
  },
  onChange: ({ updateBody, body, setCountAll, setCounts }) => (updated: any) => {
    const current = updated.getCurrentContent().getBlocksAsArray()
    const base = body.getCurrentContent().getBlocksAsArray()

    updateBody({ body: updated })
    

    // set counts
    const counts = current.map((content: any) => {
      return {
        count: content.text.length || 0,
        type: content.type,
        top: content.offsetTop
      }
    })    
    const asdf = document.getElementsByClassName('public-DraftEditor-content')
    const contents = asdf[0].childNodes[0].childNodes
    let styles: any = []
    let countIndex = 0
    Array.prototype.forEach.call(contents, (content: any) => {
      if (content.className === 'public-DraftStyleDefault-ul') {
        Array.prototype.forEach.call(content.childNodes, (li: any) => {
          styles[countIndex] = {
            count: counts[countIndex].count,
            type: counts[countIndex].type,
            top: li.offsetTop
          }
          countIndex++  
        })
      } else {
        styles[countIndex] = {
          count: counts[countIndex].count,
          type: counts[countIndex].type,
          top: content.offsetTop
        }
        countIndex++
      }
    })
    setCounts({ counts: styles })

    let countAll = 0
    counts.forEach(({count, type}: any) => {
      if (type === 'paragraph' || type === 'unordered-list-item') {
        countAll += count
      }
    })
    setCountAll({ countAll })
  },
  myBlockStyle: () => (contentBlock: any) => contentBlock.getType(),
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
    
    Object.keys(articles).forEach((key: any) => {
      if (articles[key] === match.params.id) {
        removePath = `/users/${writerId}/articles/pendings/${key}`
      }
    })
    if (removePath) {
      await remove({ path: removePath })
    }

    const date = {
      rejected: moment().format('YYYY-MM-DD-hh-mm-ss')
    }
    await set({ path: `/articles/${match.params.id}/dates`, data: date })
    

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
    if (removePath) {
      await remove({ path: removePath })
    }

    const date = {
      accepted: moment().format('YYYY-MM-DD-hh-mm-ss')
    }

    await set({ path: `/articles/${match.params.id}/dates`, data: date })

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
