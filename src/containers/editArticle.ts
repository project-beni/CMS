import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import * as moment from 'moment'
import * as sanitizeHTML from 'sanitize-html'

import { listenStart, push, read, set } from '../firebase/database'

import RecruitingArticles from '../components/editArticle'
import { signOut, getUid, isEmailConfirmed } from '../firebase/auth';
import { message, Button } from 'antd';

type Body = { body: string, title?: string, comment?: string }
type PropertyWindow = {
  propertyWindow: {
    x: number
    y: number
    isDisplay: boolean
  }
}
export type State = Body | PropertyWindow

export type StateUpdates = {
  receiveData: (dataSource: any) => State
  receiveTitle: (dataSource: any) => any
  receiveComment: (dataSource: any) => any
  updateBody: ({ body }: Body) => State
  updateWindow: ({
    x, y, isDisplay
  }: PropertyWindow['propertyWindow']) => State
}

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    body: '',
    title:'',
    comment: '',
    propertyWindow: {
      x: 0,
      y: 0,
      isDisplay: false
    }
  },
  {
    receiveData: (props) => (dataSource: any) => {
      // return { ...props, body: dataSource }
      return { body: dataSource }
    },
    receiveTitle: (props) => (dataSource: any) => {
      // return { ...props, body: dataSource }
      return { ...props, title: dataSource }
    },
    receiveComment: (props) => (dataSource: any) => {
      console.log(dataSource);
      
      // return { ...props, body: dataSource }
      return { ...props, comment: dataSource }
    },
    updateBody: (props) => ({ body }) => {
      // return { ...props, body }
      return { ...props, body }
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
  fetchData: ({ receiveData, receiveTitle, receiveComment, match }) => () => {
    
    listenStart(
      `/articles/${match.params.id}`,
      ({ contents: { body, title, comment }}: any
    ) => {
      receiveTitle(title)
      receiveData(body)
      receiveComment(comment)
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
  save: ({ body, match }) => () => {
    set({ path: `/articles/${match.params.id}/contents`, data: {body} })
      .then(() => {
        message.success('保存しました')
      })
      .catch((err) => {
        message.error(err.message)
      })
  },
  submit: ({ body, match, history }) => async () => {
    const rootPath = `/articles/${match.params.id}`
    await set({ path: `${rootPath}/contents`, data: { body } })
    await set({ path: `/articles/${match.params.id}/contents`, data: {body} })
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
    const editArea = document.getElementsByTagName('article')[0]
    let [x, y] = [0, 0]
    
    editArea.addEventListener('mousedown', ({ pageX, pageY }) => {
      editArea.addEventListener('mouseup', (e) => {
        [x, y] = [(pageX+e.pageX) / 2, (pageY+e.pageY) / 2 ]
        this.props.updateWindow({x, y, isDisplay: !window.getSelection()!.isCollapsed})
      })
    })
    editArea.addEventListener('keydown', ({ keyCode }) => {
      console.log(keyCode)
      if (37 < keyCode || keyCode < 40) return
      // editArea.addEventListener('keyup', (e) => {
      //   this.props.updateWindow({x, y, isDisplay: !window.getSelection()!.isCollapsed})
      // })
    })
    const { fetchData, history } = this.props
    const userId = await getUid()
    
    if (!userId) history.push('/login')

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
