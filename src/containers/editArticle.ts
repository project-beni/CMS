import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import * as sanitizeHTML from 'sanitize-html'
const {
  editorStateFromRaw,
  editorStateToJSON
} = require('megadraft')

import { listenStart, push, read, set } from '../firebase/database'

import RecruitingArticles from '../components/editArticle'
import { signOut, getUid, isEmailConfirmed } from '../firebase/auth';
import { message, Button } from 'antd';

type Body = {
  body: any
  title?: string
  comment?: string
}

export type State = Body

export type StateUpdates = {
  updateBody: ({ body }: State) => State
}

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    body: editorStateFromRaw(null)
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
  fetchData: ({ receiveData, receiveTitle, receiveComment, match }) => () => {
    
    listenStart(
      `/articles/${match.params.id}`,
      ({ contents: { bodies, title, comment }}: any
    ) => {
      receiveTitle(title)
      receiveData(bodies)
      receiveComment(comment)
    })
  },
  onChange: ({ updateBody }) => (body) => {
    updateBody({ body })
  },
  save: ({ body, match }) => () => {
    const article = editorStateToJSON(body)
    console.log(article);
    
    // set({ path: `/articles/${match.params.id}/contents`, data: { body: article } })
    //   .then(() => {
    //     message.success('保存しました')
    //   })
    //   .catch((err) => {
    //     message.error(err.message)
    //   })
  },
  submit: ({ bodies, match, history }) => async () => {
    const rootPath = `/articles/${match.params.id}`
    await set({ path: `${rootPath}/contents`, data: { bodies } })
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
)(RecruitingArticles)
