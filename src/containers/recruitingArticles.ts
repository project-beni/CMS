import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps } from 'react-router-dom'
import * as moment from 'moment'
const {　editorStateToJSON　} = require('megadraft')

import { listenStart, push, read, set } from '../firebase/database'

import RecruitingArticles from '../components/recruitingArticles'
import { getUid, isEmailConfirmed, isLogedIn } from '../firebase/auth'
import { message } from 'antd'

type State = {
  amountOfArticles: number
  dataSource: any
  isLoading: boolean
  position: string
  summary: string[]
}

type StateUpdates = {
  receiveData: (dataSource: any) => State
  receivePosition: ({ position }: any) => State
  receiveAmount: ({ position }: any) => State
}

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    dataSource: [],
    isLoading: true,
    position: '',
    amountOfArticles: 0,
    summary: []
  },
  {
    receiveData: (props) => (dataSource: any) => ({
      ...props,
      dataSource,
      isLoading: false
    }),
    receivePosition: (props) => ({ position }) => ({ ...props, position }),
    receiveAmount: (props) => ({ amountOfArticles }) => ({ ...props, amountOfArticles })
  }
)

type ActionProps = {
  fetchData: () => void
  editArticle: ({ id }: { id: string }) => void
}

const WithHandlers = withHandlers <RouteComponentProps | any, ActionProps>({
  fetchPosition: ({ receivePosition }: any) => async () => {
    const uid = await getUid()
    
    const position = (await read(`/users/${uid}/position`)).val()
    receivePosition({ position })
  },
  fetchData: ({ receiveData, receiveAmount }: any) => async () => {

    // amount of writer's own articles
    listenStart(`/users/${await getUid()}`, (user: any) => {
      const hasArticles = user.articles ? Object.keys(user.articles).length : false
        if (hasArticles) {
          let myArticleAmount = 0
          Object.keys(user.articles).forEach((articleType: string) => {
            if (articleType !== 'wrotes') {
              myArticleAmount += Object.keys(user.articles[articleType]).length
            }
          })
          receiveAmount({ amountOfArticles: myArticleAmount })
        }
    })
    
    
    
    listenStart('/articles', (val: any) => {
      if (val) {
        let dataSource: any = []
        Object.keys(val).forEach((key, i) => {
          if (val[key].status === 'ordered') {
            const {
              contents: { keyword, tags, title, body },
              dates: { ordered }
            } = val[key]
            
            let summary: any = []
            JSON.parse(body).blocks.forEach(({ type, text }: any) => {
              if (type === 'header-one' || type === 'header-two' || type === 'header-three') {
                summary.push({ type, text })
              }
            })
            

            dataSource.push({
              key: i,
              id: key,
              ordered,
              keyword,
              tags,
              title,
              summary
            }) 
          }
        })
        receiveData(dataSource)
      } else {
        receiveData([])
      }
    })
  },
  editArticle: ({ history, dataSource }) => async ({ id }) => {
    const now = moment().format('YYYY-MM-DD-hh-mm-ss')
    const date = { writingStart: now }
    const histories = {
      [now]: {
        contents: { after: [''], before: [''], comment: 'writing start' },
        type: 'writingStart',
        userId: await getUid()
      }
    }

    const userId = await getUid()
    const status = { status: 'writing', writer: userId }

    await set({ path: `/articles/${id}/dates`, data: date })
    await set({ path: `/articles/${id}/histories`, data: histories })
    await set({ path: `/articles/${id}`, data: status })
    push({ path: `/users/${userId}/articles/writings`, data: id })
      .then(() => {
        message.success('記事を受注しました．「受注中」の記事から執筆できます')
      })

  }
})

type LifecycleProps = RouteComponentProps | ActionProps

const Lifecycle = lifecycle <LifecycleProps, {}, any> ({
  async componentDidMount () {
    const { fetchData, history, fetchPosition } = this.props
    
    if (!(await isLogedIn())) {
      history.push('/login')
    }
    
    const userId = await getUid()
    
    const confirmationPath = `/users/${userId}`
    const isConfirmedOnDB = (await read(`${confirmationPath}/mailConfirmation`)).val()
    const isMailConfirmed = isEmailConfirmed()
    
    if (isMailConfirmed && isConfirmedOnDB) {
      fetchPosition()
      fetchData()
    } else if (isMailConfirmed && !isConfirmedOnDB) {
      await set({
        path: confirmationPath,
        data: { mailConfirmation: true }
      })
      fetchPosition()
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
