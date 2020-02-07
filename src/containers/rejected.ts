import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import { RouteComponentProps } from 'react-router-dom'

import { listenStart, read, set } from '../firebase/database'
import Rejected from '../components/rejected'
import { getUid, isEmailConfirmed } from '../firebase/auth'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment')

type State = {
  dataSource: any
  isLoading: boolean
}

type StateUpdates = {
  receiveData: (dataSource: any) => State
}

const stateHandlers = withStateHandlers<State, StateUpdates>(
  {
    dataSource: [],
    isLoading: true,
  },
  {
    receiveData: () => (dataSource: any) => ({
      dataSource,
      isLoading: false,
    }),
  }
)

type ActionProps = {
  fetchData: () => void
  editArticle: ({ id }: { id: string }) => void
}

const WithHandlers = withHandlers<RouteComponentProps | any, ActionProps>({
  fetchData: ({ receiveData }: any) => async () => {
    const userId = await getUid()
    listenStart(`/users/${userId}/articles/rejects`, async (val: any) => {
      if (val) {
        const dataSource: any = []
        await Promise.all(
          Object.keys(val).map(async (key, i) => {
            const {
              contents: { keyword, tags, title },
              dates: { rejected, writingStart },
            } = (await read(`/articles/${val[key]}`)).val()

            const diff =
              3 -
              Number(
                moment().diff(
                  moment(
                    writingStart
                      .split('-')
                      .slice(0, 3)
                      .join('-')
                  ),
                  'days'
                )
              )
            const countdown = diff < 0 ? 0 : diff

            dataSource.push({
              key: i,
              id: val[key],
              rejected,
              keyword,
              tags,
              title,
              countdown,
            })
          })
        )
        receiveData(dataSource)
      } else {
        receiveData([])
      }
    })
  },
  editArticle: ({ history }) => async ({ id }) => {
    history.push(`/articles/edit/${id}`)
  },
})

type LifecycleProps = RouteComponentProps | ActionProps

const Lifecycle = lifecycle<LifecycleProps, {}, any>({
  async componentDidMount() {
    const { fetchData, history } = this.props
    const userId = await getUid()

    const confirmationPath = `/users/${userId}`
    const isConfirmedOnDB = (await read(
      `${confirmationPath}/mailConfirmation`
    )).val()
    const isMailConfirmed = isEmailConfirmed()

    if (isMailConfirmed && isConfirmedOnDB) {
      fetchData()
    } else if (isMailConfirmed && !isConfirmedOnDB) {
      await set({
        path: confirmationPath,
        data: { mailConfirmation: true },
      })
      fetchData()
    } else {
      history.push('/mailConfirmation')
    }
  },
})
export default compose(
  stateHandlers,
  WithHandlers,
  Lifecycle
)(Rejected)
