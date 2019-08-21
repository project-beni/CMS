import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps } from 'react-router-dom'
import { message } from 'antd'

import { read, set } from '../firebase/database'
import EditWriter from '../components/editWriter'

type State = {
  nickname: string
}

type StateUpdates = {
  setNickname: ({ nickname }: State) => State
  changeNickname: (e: React.ChangeEvent<HTMLInputElement>) => State
}

const stateHandlers = withStateHandlers<State, StateUpdates>(
  {
    nickname: '',
  },
  {
    setNickname: () => ({ nickname }) => ({ nickname }),
    changeNickname: () => e => ({ nickname: e.target.value }),
  }
)

type ActionProps = {
  fetchData: () => void
  submit: () => void
}

const WithHandlers = withHandlers<RouteComponentProps | any, ActionProps>({
  fetchData: ({ match, setNickname }) => async () => {
    const UID = match.params.id
    const user = (await read(`/users/${UID}`)).val()
    const nickname = user.profiles ? user.profiles.nickname : ''
    setNickname({ nickname })
  },
  submit: ({ history, match, nickname }) => () => {
    const UID = match.params.id

    try {
      set({ path: `/users/${UID}/profiles`, data: { nickname } }).then(() => {
        message.success(`ペンネームを${nickname}に変更しました`)
        history.push('/usersList')
      })
    } catch (err) {
      message.error(`サーバーとの通信中にエラーが発生しました：${err}`)
    }
  },
  deleteWriter: ({ match, history }) => async () => {
    const UID = match.params.id
    const { writings, rejects, pendings } = (await read(
      `/users/${UID}/articles`
    )).val()

    const disableArticles: string[] = []
    ;[writings, rejects, pendings].forEach(a => {
      if (a) {
        Object.keys(a).forEach(articleId => {
          disableArticles.push(a[articleId])
        })
      }
    })

    disableArticles.forEach(articleId => {
      read(`/articles/${articleId}`).then(async snapshot => {
        const data = snapshot.val()
        const body = data.contents.baseBody || data.contents.body

        try {
          await set({
            path: `/articles/${articleId}/contents`,
            data: { body },
          })
          await set({
            path: `/articles/${articleId}`,
            data: {
              status: 'ordered',
              writer: '',
            },
          }).then(() => message.success('記事のリセットが完了しました'))
        } catch (err) {
          message.error(`記事のリセット中にエラーが発生しました：${err}`)
        }
      })
    })

    set({
      path: `/users/${UID}`,
      data: { status: 'disable' },
    })
    set({
      path: `/users/${UID}/articles`,
      data: { rejects: {}, writings: {}, pendings: {} },
    })
      .then(() => {
        message.success(
          'ライターを削除しました．ライターステータスページに遷移します．'
        )
        setTimeout(() => {
          history.push('/usersList')
        }, 2000)
      })
      .catch(err => {
        message.error(`ライターを削除できませんでした：${err}`)
      })
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
