import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { message } from 'antd'

import Order from '../components/order'
import { push, listenStart } from '../firebase/database'
import { getUid } from '../firebase/auth'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { editorStateToJSON, editorStateFromRaw } = require('megadraft')

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

const stateHandlers = withStateHandlers<State, Handlers>(
  {
    isLoading: false,
    tags: [],
    categories: [],
  },
  {
    toggleLoading: ({ isLoading }) => () => ({ isLoading: !isLoading }),
    receiveCategories: props => categories => {
      return { ...props, categories }
    },
    receiveTags: props => tags => {
      return { ...props, tags }
    },
  }
)

export type Article = {
  contents: {
    body: string
    keyword1: string
    keyword2: string
    keyword3: string
    tags: string[]
  }
  dates: {
    ordered: string
    writingStart?: string
    accepted?: string
    submit?: string
    pendings?: string[]
    rejecteds?: string[]
    publics?: string[]
    privates?: string[]
  }
  histories: [
    {
      [date: string]: {
        type:
          | 'ordered'
          | 'writing'
          | 'pending'
          | 'rejected'
          | 'accepted'
          | 'public'
          | 'private'
        userId: string
        contents: {
          before: string
          after: string
          comment: string
        }
      }
    }
  ]
  status:
    | 'ordered'
    | 'writing'
    | 'pending'
    | 'rejected'
    | 'accepted'
    | 'public'
    | 'private'
}

type FormValues = {
  headings: string
  keyword1: string
  keyword2: string
  keyword3: string
  title: string
  tagNames: string[]
  categories: []
}

const WithHandlers = withHandlers<RouteComponentProps | any, {}>({
  // TODO state types
  onSubmit: ({ toggleLoading, history }) => async ({
    headings,
    keyword1,
    keyword2,
    keyword3,
    tagNames,
    title,
    categories,
  }: FormValues) => {
    toggleLoading()
    if (!headings || !keyword1 || !tagNames || !title || !categories) {
      toggleLoading()
      message.error('全て入力してください')
      return
    }
    const now = moment().format('YYYY-MM-DD-hh-mm-ss')
    const userId = await getUid()

    const defaultBody: any = {
      entityMap: {},
      blocks: [],
    }
    let loop = 0
    headings.split('\n').forEach(line => {
      const [ type, content ] = line.split('	')
      if (true) {
        let tag = ''
        let main = ''
        switch (type) {
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
            tag = 'image'
            main = content || '横長の画像を挿入（①縦長の画像　②外部サイトの画像　は使用しないでください）'
            break
          case '5':
            tag = 'paragraph'
            main = content || 'テキスト'
            break
          case '6':
            tag = 'table'
            main = content || '表'
            break
          case '7':
            tag = 'inside-link'
            main = content || ''
            break
          case '8':
            tag = 'outside-link'
            main = content || '外部リンク'
            break
          case '9':
            tag = 'twitter-link'
            main = content || 'Twitterリンク'
            break
          case '10':
            tag = 'author'
            main = content || '0'
            break
          case '11':
            tag = 'map'
            main = content
            break
          case '12':
            tag = 'form'
            main = content
            break
          case '13':
            tag = 'youtube'
            main = content
            break
          case '14':
            tag = 'instagram'
            main = content
            break
        }

        defaultBody.blocks[loop] = {
          key: `content${loop}`,
          text: main,
          type: tag,
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        }
        loop++
      }
    })
    const body = editorStateToJSON(editorStateFromRaw(defaultBody))
    const keywords = [];
    keyword1 && keywords.push(keyword1)
    keyword2 && keywords.push(keyword2)
    keyword3 && keywords.push(keyword3)

    console.log(keywords);
    
    
    const article = {
      contents: {
        body,
        baseBody: body,
        title,
        keyword: keywords,
        tags: tagNames,
        categories,
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
            comment: 'order new article',
          },
        },
      },
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
  fetchData: ({ receiveCategories, receiveTags }) => () => {
    listenStart('/categories', (categories: any) => {
      const result = Object.keys(categories).map(
        (key: string) => categories[key]
      )
      receiveCategories(result)
    })
    listenStart('/tags', (tags: any) => {
      const result = Object.keys(tags).map((key: string) => tags[key])
      receiveTags(result)
    })
  },
})

const Lifecyle = lifecycle<RouteComponentProps | any, {}, {}>({
  async componentDidMount() {
    const { fetchData } = this.props
    fetchData()
  },
})

export default compose(
  withRouter,
  stateHandlers,
  WithHandlers,
  Lifecyle
)(Order)
