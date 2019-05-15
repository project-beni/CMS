import * as f from 'firebase/app'
import 'firebase/auth'
import firebase from './'

export function uid(): any {
  return firebase.auth().currentUser!.uid
}

export async function signIn(email: string, password: string) {
  await firebase.auth().setPersistence(f.auth.Auth.Persistence.LOCAL)
  return firebase.auth().signInWithEmailAndPassword(email, password)
}
