const initialState = {
  uid: null,
  displayName: null,
  email: null
}

const auth = (state = initialState, action: any) => {
  switch (action.type) {
    case 'LOGIN_SUCCEED':
      return Object.assign({}, state, {
        uid: action.payload.uid,
        displayName: action.payload.displayName,
        email: action.payload.email
      })
    case 'LOOUT':
      return Object.assign({}, state, {
        uid: null,
        displayName: null,
        email: null
      })
    default: {
      return state
    }
  }
}

export default auth
