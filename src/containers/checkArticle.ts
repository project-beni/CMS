import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import * as moment from 'moment'
import * as sanitizeHTML from 'sanitize-html'

import { listenStart, push, read, set } from '../firebase/database'

import CheckArticle from '../components/checkArticle'
import { signOut, getUid, isEmailConfirmed } from '../firebase/auth';
import { message, Button } from 'antd';

type Body = { body?: string, title?: string, comment?: string }
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
  receiveTitle: (dataSource: any) => State
  changeComment: (data: string) => State
  updateBody: ({ body }: Body) => State
  updateWindow: ({
    x, y, isDisplay
  }: PropertyWindow['propertyWindow']) => State
}

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    body: '',
    title: '',
    comment: '',
    propertyWindow: {
      x: 0,
      y: 0,
      isDisplay: false
    }
  },
  {
    receiveData: (props) => (dataSource: any) => {
      return { ...props, body: dataSource }
    },
    receiveTitle: (props) => (dataSource: any) => {
      return { ...props, title: dataSource }
    },
    updateBody: (props) => ({ body }) => {
      return { ...props, body }
    },
    updateWindow: (props) => ({ x, y, isDisplay }) => {
      return {
        ...props,
        propertyWindow: { x, y, isDisplay }
      }
    },
    changeComment: (props) => ({ target: {value }}: any) => {
      return { ...props, comment: value }
    }
  }
)

type ActionProps = {
  fetchData: () => void
}

const WithHandlers = withHandlers <RouteComponentProps | any, ActionProps>({
  fetchData: ({ receiveData, receiveTitle, match }) => () => {
    
    listenStart(
      `/articles/${match.params.id}`,
      ({ contents: { body, title }}: any
    ) => {  
      receiveData(body)
      receiveTitle(title)
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
)(CheckArticle)
