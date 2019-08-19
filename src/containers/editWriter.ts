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

const stateHandlers = withStateHandlers <State, StateUpdates> (
  {
    nickname: ''
  },
  {
    setNickname: () => ({ nickname }) => ({ nickname }),
    changeNickname: () => (e) => ({ nickname: e.target.value })
  }
)

type ActionProps = {
  fetchData: () => void
  submit: () => void
}

const WithHandlers = withHandlers <RouteComponentProps | any, ActionProps>({
  fetchData: ({ match, setNickname }) => async () => {
    const UID = match.params.id
    const user = (await read(`/users/${UID}`)).val()
    const nickname = user.profiles ? user.profiles.nickname : ''
    setNickname({ nickname })
  },
  submit: ({ history, match, nickname }) => () => {
    const UID = match.params.id
    console.log(UID, nickname)
    
    try {
      set({ path: `/users/${UID}/profiles`, data: { nickname }})
        .then(() => {
          message.success(`ペンネームを${nickname}に変更しました`)
          history.push('/usersList')
        })
    } catch (err) {
      message.error(`サーバーとの通信中にエラーが発生しました：${err}`)
    }
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
)(EditWriter)
