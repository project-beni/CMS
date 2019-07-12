import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import * as moment from 'moment'
import * as sanitizeHTML from 'sanitize-html'

import { listenStart, push, read, set, remove } from '../firebase/database'

import CatesAndTags from '../components/categoriesAndTags'
import { signOut, getUid, isEmailConfirmed } from '../firebase/auth'
import { message, Button } from 'antd'

type State = {
  categories: string[]
  tags: string[]
  isLoading: boolean
  body: string
}

export type StateUpdates = {
  receiveCategories: (categories: any) => any
  receiveTags: (categories: any) => any
  updateBody: ({ body }: State) => State
  toggleLoading: () => State
}

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    body: '',
    categories: [],
    tags: [],
    isLoading: true
  },
  {
    receiveCategories: (props) => (categories) => ({ ...props, categories }),
    receiveTags: (props) => (tags) => ({ ...props, tags }),
    updateBody: (props) => ({ body }) => ({ ...props, body }),
    toggleLoading: (props) => () => ({ ...props, isLoading: false })
  }
)

type ActionProps = {
  fetchData: () => void
  // deleteTag: (a: any) => Void
}

const WithHandlers = withHandlers <RouteComponentProps | any, ActionProps>({
  addCategory: ({ categories }: any) => ({target: { value }}: any) => {
    let isExist = false
    categories.forEach((categorie: any) => {
      if (value === categorie.value) {
        isExist = true
      }
    })
    if (!isExist) {
      push({ path: '/categories', data: value })
        .then(() => message.success('カテゴリーを追加しました'))
    } else {
      message.warning('すでに存在するカテゴリーです')
    }
  },
  addTag: ({ tags }: any) => ({target: { value }}: any) => {
    let isExist = false
    tags.forEach((tag: any) => {
      if (value === tag.value) {
        isExist = true
      }
    })
    if (!isExist) {
      push({ path: '/tags', data: value })
        .then(() => message.success('タグを追加しました'))
    } else {
      message.warning('すでに存在するタグです')
    }
  },
  fetchData: ({ receiveCategories, receiveTags, toggleLoading }) => () => {
    
    listenStart(
      '/categories',
      (categories: any) => {
        const result = Object.keys(categories).map((key: string) => {
          return {
            key,
            value: categories[key]
          }
        })
        
      receiveCategories(result)
      toggleLoading()
    })
    listenStart(
      '/tags',
      (tags: any) => {
        const result = Object.keys(tags).map((key: string) => {
          return {
            key,
            value: tags[key]
          }
        })
        receiveTags(result)
    })
  },
  deleteTag: () => (key: string) => {
    remove({ path: `/tags/${key}` })
      .then(() => {
        message.success('タグを削除しました')
      })
      .catch((err: Error) => {
        message.error(`エラーが発生しました：${err}`)
      })
  },
  deleteCategorie: () => (key: string) => {
    remove({ path: `/categories/${key}` })
      .then(() => {
        message.success('カテゴリーを削除しました')
      })
      .catch((err: Error) => {
        message.error(`エラーが発生しました：${err}`)
      })
  },
  handleChange: ({ updateBody }) => (e: any) => {
    const body = e.target.value
    updateBody({body})
    
  },
  reject: ({ body, match, history }) => () => {
    const rootPath = `/articles/${match.params.id}`
    set({ path: `${rootPath}`, data: { status: 'rejected' } })
      .then(() => {
        history.push('/checkList')
      })
      .catch((err) => {
        message.error(err.message)
      })
  },
  recieve: ({ body, match }) => () => {
    const rootPath = `/articles/${match.params.id}`
    // set({ path: `${rootPath}/contents`, data: { body } })
    set({ path: `${rootPath}`, data: { status: 'accepted' } })
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
)(CatesAndTags)
