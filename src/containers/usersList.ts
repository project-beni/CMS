import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps } from 'react-router-dom'
const {
  editorStateFromRaw,
  editorStateToJSON
} = require('megadraft')

import { read, set } from '../firebase/database'

import UsersList from '../components/usersList'
import { getUid, isEmailConfirmed } from '../firebase/auth'

type Users = {
  [key: string]: {
    profiles: {
      nickname: string
    }
    pendings: {
      title: string
      keywords: string[]
      categories: string[]
      tags: string[]
      count: number
      id: string
    }[]
  }
}[]

type State = {
  users: Users
}

export type StateUpdates = {
  setUsersInfo: (users: any, articles: any) => State
}

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    users: [],
  },
  {
    setUsersInfo: (props) => (users, allArticles) => {
      
      let data: any = []

      Object.keys(users).forEach((key: string, i: number) => {
        let pendingData: any = []
        let writingData: any = []
        let rejectData: any = []
        let wroteData: any = []

        if (users[key].articles && users[key].position === 'writer') {
          let {
            pendings, writings, rejects, wrotes
          } = users[key].articles

          if (pendings) {
            Object.keys(pendings).map((key: string) => {
              const articleId = pendings[key]
              pendingData.push(
                {
                  ...allArticles[articleId],
                  articleId
                }
              )
            })
          } else {
            pendingData = []
          }

          if (writings) {
            Object.keys(writings).map((key: string) => {
              const articleId = writings[key]
              writingData.push(
                {
                  ...allArticles[articleId],
                  articleId
                }
              )
            })
          } else {
            writingData = []
          }

          if (rejects) {
            Object.keys(rejects).map((key: string) => {
              const articleId = rejects[key]
              rejectData.push(
                {
                  ...allArticles[articleId],
                  articleId
                }
              )
            })
          } else {
            rejectData = []
          }
          if (wrotes) {
            Object.keys(wrotes).map((key: string) => {
              const articleId = wrotes[key]
              wroteData.push(
                {
                  ...allArticles[articleId],
                  articleId
                }
              )
            })
          } else {
            wroteData = []
          }
          console.log('writings', writingData)
          
          data.push({
            nickname: users[key].profiles.nickname,
            mail: users[key].profiles.mail,
            writerId: key,
            writings: writingData,
            pendings: pendingData,
            rejects: rejectData,
            accepted: wroteData,
            key: i
          }) 
        }
      })
      
      return {
        ...props,
        users: data,
      }
    }
  }
)

type WithHandlersProps = RouteComponentProps<{id: string}> & StateUpdates

type ActionProps = {
  fetchData: () => void
  checkArticle: ({ articleId }: { articleId: string}) => void
}

const WithHandlers = withHandlers <WithHandlersProps, ActionProps>({
  fetchData: ({ setUsersInfo, match }) => async () => {
    const users = (await read('/users')).val()
    const allArticles = (await read('/articles')).val()
    setUsersInfo(users, allArticles)

  },
  checkArticle: ({ history }) => ({ articleId }) => {
    history.push(`/checkList/${articleId}`)
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
)(UsersList)
