import * as f from 'firebase/app'

import 'firebase/auth'
import firebase from './'

import { read } from './database'

export function getUid() {
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(({ uid }: any) => resolve(uid))
  })
}

export async function getPosition() {
  return (await read(`/users/${await getUid()}/position`)).val()
}

export async function signIn(email: string, password: string) {
  await firebase.auth().setPersistence(f.auth.Auth.Persistence.LOCAL)
  return firebase.auth().signInWithEmailAndPassword(email, password)
}

export function signOut() {
  return firebase.auth().signOut()
}

export function verify() {
  const user = firebase.auth().currentUser
  if (user) {
    user.sendEmailVerification()
  }
}

export function createUser({ mail, pass }: { mail: string; pass: string }) {
  return firebase.auth().createUserWithEmailAndPassword(mail, pass)
}

export function isEmailConfirmed() {
  const current = firebase.auth().currentUser
  if (current) {
    return current.emailVerified
  }
  return false
}

export function isLogedIn(): Promise<boolean> {
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged((user: any) => resolve(!!user))
  })
}

export function loglog() {
  return firebase.auth().currentUser
}
