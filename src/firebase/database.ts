import firebase from './'
import 'firebase/database'

type DB = {
  path: string
  data: object | string | number | boolean
}

export const set = ({ path, data }: DB) => {
  return firebase
    .database()
    .ref(path)
    .update(data)
}

export const push = ({ path, data }: DB) => {
  return firebase
    .database()
    .ref(path)
    .push(data)
}

export const read = (path: string) => {
  return firebase
    .database()
    .ref(path)
    .once('value')
}

export const listenStart = (path: string, cb: Function) => {
  firebase
    .database()
    .ref(path)
    .on('value', (snapshot: any) => {
      cb(snapshot.val())
    })
}

export const remove = ({ path }: { path: string }) => {
  return firebase
    .database()
    .ref(path)
    .remove()
}
