import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps } from 'react-router-dom'
import { message } from 'antd'

import { push, read, set, remove } from '../firebase/database'
import RecruitingArticles from '../components/articles/edit'
import { getUid, isEmailConfirmed } from '../firebase/auth'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { editorStateFromRaw, editorStateToJSON } = require('megadraft')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { get } = require('axios')

type Body = {
  body: any
  comment?: string
  isDrawerVisible: boolean
  counts: {
    type:
      | 'header-one'
      | 'header-two'
      | 'header-three'
      | 'paragraph'
      | 'unstyled'
    count: number
    height: number
  }[]
  countAll: number
  relatedQueries: string[]
  keyword: string[]
  isChecking: boolean
  checks: number
}

export type State = Body

export type StateUpdates = {
  updateBody: ({ body }: State) => State
  receiveData: ({ body }: State) => State
  toggleDrawer: ({ isDrawerVisible }: State) => State
  setCounts: ({ counts }: State) => State
  setCountAll: ({ countAll }: State) => State
  setRelatedQueries: ({ relatedQueries }: State) => State
  setKeyword: ({ keyword }: State) => State
  toggleChecking: ({ isChecking }: State) => State
  updateCheck: (checks: string[]) => State
}

const stateHandlers = withStateHandlers<State, StateUpdates>(
  {
    body: editorStateFromRaw(null),
    isDrawerVisible: false,
    counts: [],
    countAll: 0,
    relatedQueries: [],
    keyword: [],
    isChecking: false,
    checks: 0,
  },
  {
    updateBody: props => ({ body }) => ({ ...props, body }),
    receiveData: props => ({ body }) => ({ ...props, body }),
    toggleDrawer: props => () => ({
      ...props,
      isDrawerVisible: !props.isDrawerVisible,
    }),
    setCounts: props => ({ counts }) => ({ ...props, counts }),
    setCountAll: props => ({ countAll }) => ({ ...props, countAll }),
    setRelatedQueries: props => ({ relatedQueries }) => ({
      ...props,
      relatedQueries,
    }),
    setKeyword: props => ({ keyword }) => ({ ...props, keyword }),
    toggleChecking: props => () => ({
      ...props,
      isChecking: !props.isChecking,
    }),
    updateCheck: props => checks => ({ ...props, checks: checks.length }),
  }
)

type ActionProps = {
  fetchData: () => void
  onChange: ({ body }: State) => void
}

const WithHandlers = withHandlers<RouteComponentProps | any, ActionProps>({
  fetchData: ({
    receiveData,
    setCountAll,
    setCounts,
    setRelatedQueries,
    setKeyword,
    match,
  }) => () => {
    read(`/articles/${match.params.id}`).then(snapshot => {
      const {
        contents: { body, keyword },
      } = snapshot.val()

      receiveData({ body: editorStateFromRaw(JSON.parse(body)) })
      setKeyword({ keyword: keyword })

      let searchWord = ''
      keyword.forEach((w: string) => {
        searchWord += `${w} `
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

      const changed = JSON.parse(body).blocks

      const counts = changed.map((content: any) => {
        if (content.data.type === 'table') {
          let tableCount = 0
          content.data.table.forEach((row: string[]) => {
            row.forEach(cell => (tableCount += cell.length))
          })
          return {
            count: tableCount,
            type: 'table',
          }
        } else {
          return {
            count: content.text.length,
            type: content.type,
          }
        }
      })

      let countAll = 0
      counts.forEach(({ count, type }: any) => {
        if (
          type === 'paragraph' ||
          type === 'unordered-list-item' ||
          type === 'table'
        ) {
          countAll += count
        }
      })
      setCountAll({ countAll })

      setTimeout(() => {
        const asdf: HTMLCollection = document.getElementsByClassName(
          'public-DraftEditor-content'
        )
        const contents = asdf[0].childNodes[0].childNodes

        const styles: any = []
        let countIndex = 0
        Array.prototype.forEach.call(contents, (content: any) => {
          if (content.className === 'public-DraftStyleDefault-ul') {
            Array.prototype.forEach.call(
              content.childNodes,
              (li: HTMLDataListElement) => {
                styles[countIndex] = {
                  count: counts[countIndex].count,
                  type: counts[countIndex].type,
                  top: li.offsetTop,
                }
              }
            )
          } else {
            styles[countIndex] = {
              count: counts[countIndex].count,
              type: counts[countIndex].type,
              top: content.offsetTop,
            }
          }
          countIndex++
        })

        setCounts({ counts: styles })
      }, 1000)
    })
  },
  onChange: ({ updateBody, setCounts, body, setCountAll }) => (
    updated: any
  ) => {
    const current = updated.getCurrentContent().getBlocksAsArray()
    const base = body.getCurrentContent().getBlocksAsArray()

    const changedLen = current.length
    const baseLen = base.length

    updateBody({ body: updated })

    if (baseLen < changedLen) {
      // 要素の追加
      // let hasAlreadyChanged = false
      // base.forEach((content: any, i: number) => {
      //   i < 5 ? console.log(current[i].type) : null
      //   if (
      //     content.key !== current[i].key &&
      //     ( current[i].type === 'paragraph' || current[i].type === 'atomic' ) &&
      //     !hasAlreadyChanged
      //   ) {
      //     updateBody({ body: updated })
      //     hasAlreadyChanged = true
      //   } else if (
      //     content.key !== current[i].key &&
      //     current[i].type !== 'paragraph' &&
      //     !hasAlreadyChanged
      //   ) {
      //     updateBody({ body })
      //     hasAlreadyChanged = true
      //   }
      // })
    } else if (baseLen > changedLen) {
      // 要素の削除
      // let hasAlreadyChanged = false
      // current.forEach((content: any, i: number) => {
      //   i < 5 ? console.log(content.type) : null
      //   if (
      //     content.key !== base[i].key &&
      //     (content.type === 'unstyled' || content.type === 'atomic') &&
      //     !hasAlreadyChanged
      //   ) {
      //     updateBody({ body: updated })
      //     hasAlreadyChanged = true
      //   } else {
      //     updateBody({ body })
      //     hasAlreadyChanged = true
      //   }
      // })
    } else {
      // 要素の変更
      // let hasAlreadyChanged = false
      // current.map((content: any, i: number) => {
      //   if (
      //     content.type === 'unstyled' &&
      //     !hasAlreadyChanged
      //   ) {
      //     updateBody({ body })
      //     hasAlreadyChanged = true
      //   } else if (
      //     content.text !== base[i].text &&
      //     (content.type === 'paragraph' || content.type === 'image') &&
      //     !hasAlreadyChanged
      //   ) {
      //     updateBody({ body: updated })
      //     hasAlreadyChanged = true
      //   } else if (
      //     content.text !== base[i].text &&
      //     content.type !== 'paragraph' &&
      //     !hasAlreadyChanged
      //   ) {
      //     updateBody({ body })
      //     hasAlreadyChanged = true
      //   }
      // })
    }

    // set counts
    const newData = JSON.parse(editorStateToJSON(updated)).blocks
    const counts = newData.map((content: any) => {
      if (content.data.type === 'table') {
        let tableCount = 0
        content.data.table.forEach((row: string[]) => {
          row.forEach(cell => (tableCount += cell.length))
        })
        return {
          count: tableCount,
          type: 'table',
        }
      } else {
        return {
          count: content.text.length,
          type: content.type,
        }
      }
    })
    const asdf = document.getElementsByClassName('public-DraftEditor-content')
    const contents = asdf[0].childNodes[0].childNodes
    const styles: any = []
    let countIndex = 0
    Array.prototype.forEach.call(contents, (content: any) => {
      if (content.className === 'public-DraftStyleDefault-ul') {
        Array.prototype.forEach.call(content.childNodes, (li: any) => {
          styles[countIndex] = {
            count: counts[countIndex].count,
            type: counts[countIndex].type,
            top: li.offsetTop,
          }
        })
      } else {
        styles[countIndex] = {
          count: counts[countIndex].count,
          type: counts[countIndex].type,
          top: content.offsetTop,
        }
      }
      countIndex++
    })

    setCounts({ counts: styles })

    let countAll = 0

    counts.forEach(({ count, type }: any) => {
      if (
        type === 'paragraph' ||
        type === 'unordered-list-item' ||
        type === 'table'
      ) {
        countAll += count
      }
    })
    setCountAll({ countAll })
  },
  save: ({ body, match, countAll }) => () => {
    const article = editorStateToJSON(body)

    set({
      path: `/articles/${match.params.id}/contents`,
      data: { body: article, countAll },
    })
      .then(() => {
        message.success('保存しました')
      })
      .catch(err => {
        message.error(err.message)
      })
  },
  submit: ({ body, match, history, countAll }) => async () => {
    const rootPath = `/articles/${match.params.id}`
    const uid = await getUid()
    const article = editorStateToJSON(body)
    await push({
      path: `/users/${uid}/articles/pendings`,
      data: match.params.id,
    })

    // remove old status
    let removePath = ''
    const writingArticles: any = (await read(
      `/users/${uid}/articles/writings`
    )).val()
    const rejectedArticles: any = (await read(
      `/users/${uid}/articles/rejects`
    )).val()
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
      data: { body: article, countAll },
    })
    const date = {
      pending: moment().format('YYYY-MM-DD-hh-mm-ss'),
    }
    await set({ path: `/articles/${match.params.id}/dates`, data: date })
    set({ path: `${rootPath}`, data: { status: 'pending' } }).then(() => {
      message.success('記事を保存し，提出しました')
      history.push('/articles/ordered')
    })
  },
})

type LifecycleProps = RouteComponentProps | ActionProps

const Lifecycle = lifecycle<LifecycleProps, {}, any>({
  async componentDidMount() {
    const { fetchData, history } = this.props
    const userId = await getUid()

    const confirmationPath = `/users/${userId}`
    const isConfirmedOnDB = (await read(
      `${confirmationPath}/mailConfirmation`
    )).val()
    const isMailConfirmed = isEmailConfirmed()

    if (isMailConfirmed && isConfirmedOnDB) {
      fetchData()
    } else if (isMailConfirmed && !isConfirmedOnDB) {
      await set({
        path: confirmationPath,
        data: { mailConfirmation: true },
      })
      fetchData()
    } else {
      history.push('/mailConfirmation')
    }
  },
})
export default compose(
  stateHandlers,
  WithHandlers,
  Lifecycle
)(RecruitingArticles)
