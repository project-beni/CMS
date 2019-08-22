import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps } from 'react-router-dom'
import { message } from 'antd'

import { read, set } from '../firebase/database'
import EditWriter from '../components/articleInfo'

type State = {
  tags: string[]
  tagChoices: string[]
  category: string
  categoryChoices: string[]
}

type StateUpdates = {
  setTags: ({ tags }: State) => State
  changeTags: (tags: string[]) => State
  setTagChoices: ({ tagChoices }: State) => State
  setCategory: ({ category }: State) => State
  changeCategory: (category: string) => State
  setCategoryChoices: ({ categoryChoices }: State) => State
}

const stateHandlers = withStateHandlers<State, StateUpdates>(
  {
    tags: ['loading'],
    tagChoices: [''],
    category: 'loading',
    categoryChoices: ['']
  },
  {
    setTags: (props) => ({ tags }) => ({ ...props, tags }),
    changeTags: (props) => (tags) => ({ ...props, tags }),
    setTagChoices: (props) => ({ tagChoices }) => ({ ...props, tagChoices }),
    setCategory: (props) => ({ category }) => ({ ...props, category }),
    changeCategory: (props) => (category) => ({ ...props, category }),
    setCategoryChoices: (props) => ({ categoryChoices }) => ({ ...props, categoryChoices })
  }
)

type ActionProps = {
  fetchData: () => void
  submit: () => void
}

const WithHandlers = withHandlers<any, ActionProps>({
  fetchData: ({ match, setTags, setCategory, setTagChoices, setCategoryChoices }) => async () => {
    const articleId = match.params.id
    const { contents: { tags, categories }} = (await read(`/articles/${articleId}`)).val()
    setTags({ tags })
    setCategory({ category: categories })

    const tagChoices = (await read('/tags')).val()
    const tagBeauty = Object.keys(tagChoices).map((key: string) => tagChoices[key])
    setTagChoices({ tagChoices: tagBeauty })

    const categoryChoices = (await read('/categories')).val()
    const categoryBeauty = Object.keys(categoryChoices).map((key: string) => categoryChoices[key])
    setCategoryChoices({ categoryChoices: categoryBeauty })
  },
  submit: ({ match, category, tags }) => () => {
    const articleId = match.params.id
    
    try {
      set({
        path: `/articles/${articleId}/contents`,
        data: {
          categories: [category],
          tags
        }
      }).then(() => {
        message.success(`変更しました`)
      })
    } catch (err) {
      message.error(`サーバーとの通信中にエラーが発生しました：${err}`)
    }
  },
})

type LifecycleProps = RouteComponentProps | ActionProps

const Lifecycle = lifecycle<LifecycleProps, {}, any>({
  async componentDidMount() {
    const { fetchData } = this.props
    fetchData()
  },
})
export default compose(
  stateHandlers,
  WithHandlers,
  Lifecycle
)(EditWriter)
