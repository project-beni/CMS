export const LOGIN_OK = 'LOGIN_SUCCEED'
export const LOGOUT = 'LOGOUT'

type User = {
  displayName: string,
  email: string,
  uid: string
}

export const loginSucceed = (user: User) => ({
  type: LOGIN_OK,
  payload: {
    displayName: user.displayName,
    email: user.email,
    uid: user.uid
  }
})

export const logOut = () => ({
  type: LOGOUT
})
