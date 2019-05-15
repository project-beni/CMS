import { createStore, combineReducers } from 'redux'
import { createAggregate } from 'redux-aggregate'

type State = {
  count: number
}
const initialState = () => ({ count: 1 })

const increment = (state: State) => ({ ...state, count: state.count + 1})
const decrement = (state: State) => ({ ...state, count: state.count - 1})
const mutations = { increment, decrement }

const { reducerFactory } = createAggregate(mutations, 'counter/')

const store = createStore(
  combineReducers({
    counter: reducerFactory(initialState())
  })
)
