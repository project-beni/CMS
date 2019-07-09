import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import * as moment from 'moment'
import * as sanitizeHTML from 'sanitize-html'

import { listenStart, push, read, set } from '../firebase/database'

import CatesAndTags from '../components/categoriesAndTags'
import { signOut, getUid, isEmailConfirmed } from '../firebase/auth';
import { message, Button } from 'antd';

type Body = { body: string }
type PropertyWindow = {
  propertyWindow: {
    x: number
    y: number
    isDisplay: boolean
  }
}
type S = {
  categories: string[]
  tags: string[]
}
export type State = Body | PropertyWindow | S

export type StateUpdates = {
  receiveCategories: (categories: any) => any
  receiveTags: (categories: any) => any
  updateBody: ({ body }: Body) => State
  updateWindow: ({
    x, y, isDisplay
  }: PropertyWindow['propertyWindow']) => State
  // addCategory: (e: any) => any
}

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    body: '',
    categories: [],
    tags: [],
    propertyWindow: {
      x: 0,
      y: 0,
      isDisplay: false
    }
  },
  {
    receiveCategories: (props) => (categories) => {
      // return { ...props, body: dataSource }
      return { ...props, categories }
    },
    receiveTags: (props) => (tags) => {
      // return { ...props, body: dataSource }
      return { ...props, tags }
    },
    updateBody: (props) => ({ body }) => {
      // return { ...props, body }
      return { body }
    },
    updateWindow: (props) => ({ x, y, isDisplay }) => {
      return {
        ...props,
        propertyWindow: { x, y, isDisplay }
      }
    }
  }
)

type ActionProps = {
  fetchData: () => void
}

const WithHandlers = withHandlers <RouteComponentProps | any, ActionProps>({
  addCategory: ({ categories }: any) => ({target: { value }}: any) => {
    if (value && categories.indexOf(value) === -1) {
      categories.push(value)
      console.log(categories)
      
      set({
        path: '/categories',
        data: categories
      })
    }
  },
  addTag: ({ tags }: any) => ({target: { value }}: any) => {
    if (value && tags.indexOf(value) === -1) {
      tags.push(value)
      console.log(tags)
      
      set({
        path: '/tags',
        data: tags
      })
    }
  },
  fetchData: ({ receiveCategories, receiveTags, tags, match }) => () => {
    
    listenStart(
      '/categories',
      (categories: string[]) => {  
      receiveCategories(categories)
    })
    listenStart(
      '/tags',
      (tags: string[]) => {  
        receiveTags(tags)
    })
  },
  handleChange: ({ updateBody }) => (e: any) => {
    const body = e.target.value
    updateBody({body})
    
  },
  sanitize: ({ body, updateBody }) => () => {
    const sanitizeConf = {
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3'],
      allowedAttributes: { a: ['href'] }
    }
    updateBody(sanitizeHTML(body, sanitizeConf))
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
    // const editArea = document.getElementsByTagName('article')[0]
    // let [x, y] = [0, 0]
    
    // editArea.addEventListener('mousedown', ({ pageX, pageY }) => {
    //   editArea.addEventListener('mouseup', (e) => {
    //     [x, y] = [(pageX+e.pageX) / 2, (pageY+e.pageY) / 2 ]
    //     this.props.updateWindow({x, y, isDisplay: !window.getSelection()!.isCollapsed})
    //   })
    // })
    // editArea.addEventListener('keydown', ({ keyCode }) => {
    //   console.log(keyCode)
    //   if (37 < keyCode || keyCode < 40) return
    // })
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
