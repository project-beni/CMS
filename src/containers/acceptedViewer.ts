import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps, withRouter } from 'react-router-dom'
const { editorStateFromRaw, editorStateToJSON } = require('megadraft')

import AcceptedViewer from '../components/acceptedViewer'
import { read, set } from '../firebase/database'
import { message } from 'antd'

type State = {
  body?: any
  comment?: string
  counts: {
    type: 'header-one' | 'header-two' | 'header-three' | 'paragraph' | 'unstyled'
    count: number
    height: number
  }[]
  countAll: number
}

export type StateUpdates = {
  updateBody: ({ body } : State) => State
  receiveData: ({ body }: State) => State
  setCounts: ({ counts }: State) => State
  setCountAll: ({ countAll }: State) => State
}

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    body: editorStateFromRaw(null),
    counts: [],
    countAll: 0
  },
  {
    updateBody: (props) => ({ body }) => ({ ...props, body }),
    receiveData: (props) => ({ body }) => ({ ...props, body }),
    setCounts: (props) => ({ counts }) => ({ ...props, counts }),
    setCountAll: (props) => ({ countAll }) => ({ ...props, countAll })
  }
)

type ActionProps = {
  fetchData: () => void
  onChange: (updated: any) => void
}

const WithHandlers = withHandlers <RouteComponentProps | any, ActionProps>({
  fetchData: ({ setCounts, setCountAll, receiveData, match }) => async () => {
    read(`/articles/${match.params.articleId}`)
      .then((snapshot) => {
        
        
        const { contents: { body }} = snapshot.val()
        
        
        receiveData({ body: editorStateFromRaw(JSON.parse(body)) })
        
        const changed = JSON.parse(body).blocks
        
        const counts = changed.map((content: any) => {
          return {
            count: content.text.length,
            type: content.type,
            top: content.offsetTop
          }
        })

        let countAll = 0
        
        counts.forEach(({count, type}: any) => {
          if (type === 'paragraph' || type === 'unordered-list-item') {
            countAll += count
          }
        })
        setCountAll({ countAll })

        setTimeout(() => {
          const asdf = document.getElementsByClassName('public-DraftEditor-content')
          const contents = asdf[0].childNodes[0].childNodes

          let styles: any = []
          let countIndex = 0

          Array.prototype.forEach.call(contents, (content: any) => {
            if (content.className === 'public-DraftStyleDefault-ul') {
              Array.prototype.forEach.call(content.childNodes, (li: any) => {
                styles[countIndex] = {
                  count: counts[countIndex].count,
                  type: counts[countIndex].type,
                  top: li.offsetTop
                }
                countIndex++  
              })
            } else {
              styles[countIndex] = {
                count: counts[countIndex].count,
                type: counts[countIndex].type,
                top: content.offsetTop
              }
              countIndex++
            }
          })
          
          setCounts({ counts: styles })
        }, 1000)
      })
  },
  onChange: ({ updateBody, body, setCountAll, setCounts }) => (updated: any) => {
    const current = updated.getCurrentContent().getBlocksAsArray()
    const base = body.getCurrentContent().getBlocksAsArray()

    updateBody({ body: updated })
    

    // set counts
    const counts = current.map((content: any) => {
      return {
        count: content.text.length || 0,
        type: content.type,
        top: content.offsetTop
      }
    })    
    const asdf = document.getElementsByClassName('public-DraftEditor-content')
    const contents = asdf[0].childNodes[0].childNodes
    let styles: any = []
    let countIndex = 0
    Array.prototype.forEach.call(contents, (content: any) => {
      if (content.className === 'public-DraftStyleDefault-ul') {
        Array.prototype.forEach.call(content.childNodes, (li: any) => {
          styles[countIndex] = {
            count: counts[countIndex].count,
            type: counts[countIndex].type,
            top: li.offsetTop
          }
          countIndex++  
        })
      } else {
        styles[countIndex] = {
          count: counts[countIndex].count,
          type: counts[countIndex].type,
          top: content.offsetTop
        }
        countIndex++
      }
    })
    setCounts({ counts: styles })

    let countAll = 0
    counts.forEach(({count, type}: any) => {
      if (type === 'paragraph' || type === 'unordered-list-item') {
        countAll += count
      }
    })
    setCountAll({ countAll })
  },
  myBlockStyle: () => (contentBlock: any) => contentBlock.getType(),
  save: ({ body, match, countAll }) => () => {
    const article = editorStateToJSON(body)
    
    set({
      path: `/articles/${match.params.id}/contents`,
      data: { body: article, countAll }
    })
      .then(() => {
        message.success('保存しました')
      })
      .catch((err) => {
        message.error(err.message)
      })
  }
})

type LifecycleProps = RouteComponentProps | ActionProps

const Lifecycle = lifecycle <LifecycleProps, {}, any> ({
  async componentDidMount () {
    const { fetchData } = this.props
    fetchData()
  }
})
export default compose(
  stateHandlers,
  WithHandlers,
  Lifecycle
)(AcceptedViewer)
