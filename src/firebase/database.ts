import firebase from './'
import 'firebase/database'

export const set = (path: string, data: object) => {
  return firebase
    .database()
    .ref(path)
    .update(data)
}

export const push = (path: string, data: any) => {
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

export const remove = (path: string) => {
  return firebase
    .database()
    .ref(path)
    .remove()
}
