import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { message } from 'antd'
import * as moment from 'moment'
const { editorStateToJSON, editorStateFromRaw } = require('megadraft')

import Order from '../components/order'

import { push, listenStart } from '../firebase/database'
import { getUid, getPosition } from '../firebase/auth'

type State = {
  isLoading: boolean
  tags?: string[]
  categories?: string[]
}

type Handlers = {
  toggleLoading: ({ isLoading }: State) => State
  receiveCategories: (categories: string[]) => State
  receiveTags: (tags: string[]) => State
}

const stateHandlers = withStateHandlers <State, Handlers> (
  {
    isLoading: false,
    tags: [],
    categories: []
  },
  {
    toggleLoading: ({ isLoading }) => () => ({ isLoading: !isLoading }),
    receiveCategories: (props) => (categories) => {
      return { ...props, categories }
    },
    receiveTags: (props) => (tags) => {
      return { ...props, tags }
    },
  }
)

export type Article = {
  contents: {
    body: string,
    keyword: string,
    tags: string[],
  },
  dates: {
    ordered: string,
    writingStart?: string,
    accepted?: string,
    submit?: string,
    pendings?: string[],
    rejecteds?: string[],
    publics?: string[],
    privates?: string[]
  },
  histories: [{ 
    [date: string]: {
      type: 'ordered' | 'writing' | 'pending' | 'rejected' | 'accepted' | 'public' | 'private',
      userId: string,
      contents: {
        before: string,
        after: string,
        comment: string
      }
    } 
  }],
  status: 'ordered' | 'writing' | 'pending' | 'rejected' | 'accepted' | 'public' | 'private',
}

type FormValues = {
  headings: string
  keyword: string
  title: string
  tagNames: string[]
}

const WithHandlers = withHandlers <RouteComponentProps | any, {}>({ // TODO state types
  onSubmit: ({ toggleLoading, history }) => async({ headings,  keyword, tagNames, title }: FormValues) => {
    toggleLoading()
    // if (!headings || !keyword || !tagNames || !title) {
    //   toggleLoading()
    //   message.error('全て入力してください')
    //   return
    // }
    const now = moment().format('YYYY-MM-DD-hh-mm-ss')
    const userId = await getUid()
    
    let defaultBody: any = {
      entityMap: {},
      blocks: []
    }
    let loop = 0
    headings.split('\n').forEach((line, i) => {
      const content = line.slice(2, line.length)
      if (true) {
        let tag = ''
        let main = ''
        switch (line[0]) {
          case 'D':
            tag = 'paragraph'
            main = content || 'ディスクリプション'
            break
          case '1':
            tag = 'header-one'
            main = content
            break
          case '2':
            tag = 'header-two'
            main = content
            break
          case '3':
            tag = 'header-three'
            main = content
            break
          case '4':
            tag = 'unstyled'
            main = content || '画像挿入'
            break
          case '5':
            tag = 'paragraph'
            main = content || 'テキスト'
            break
          case '6':
            tag = 'unstyled'
            main = content || '表'
            break
          case '7':
            tag = 'unstyled'
            main = content || '内部リンク'
            break
          case '8':
            tag = 'unstyled'
            main = content || '外部リンク'
            break
          case '9':
            tag = 'unstyled'
            main = content || 'Twitterリンク'
            break
        }

        defaultBody.blocks[loop] = {
          "key": `content${loop}`,
          "text": main,
          "type": tag,
          "depth": 0,
          "inlineStyleRanges": [],
          "entityRanges": [],
          "data": {}
        }
        loop++
      }
    })
    const article = {
      contents: {
        body: editorStateToJSON(editorStateFromRaw(defaultBody)),
        title,
        keyword: keyword.split('\n').map((key) => key),
        tags: tagNames
      },
      status: 'ordered',
      dates: {
        ordered: now,
      },
      histories: { 
        [now]: {
          type: 'order',
          userId,
          contents: {
            before: '',
            after: '',
            comment: 'order new article'
          }
        } 
      }
    }
    push({ path: '/articles', data: article })
      .then(() => {
        message.success('記事を発注しました．')
        history.push('/')
      })
      .catch((err: Error) => {
        message.error(err)
      })
  },
  fetchData: ({ receiveCategories, receiveTags, tags, match }) => () => {
    
    listenStart(
      '/categories',
      (categories: any) => {  
        const result = Object.keys(categories).map((key: string) => categories[key] )
      receiveCategories(result)
    })
    listenStart(
      '/tags',
      (tags: any) => {  
        const result = Object.keys(tags).map((key: string) => tags[key] )
        receiveTags(result)
    })
  },
})

const Lifecyle = lifecycle <RouteComponentProps | any, {}, {}> ({
  async componentDidMount() {
    const { fetchData } = this.props
    fetchData()
    const position = await getPosition()
    
  }
})

export default compose(
  withRouter,
  stateHandlers,
  WithHandlers,
  Lifecyle
)(Order)
