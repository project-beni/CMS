import * as firebase from 'firebase/app'

const config = {
  apiKey: "AIzaSyA9og2ghnzT_7w359Gt5falElHkDJLO2DI",
  authDomain: "job-scope.firebaseapp.com",
  databaseURL: "https://job-scope.firebaseio.com",
  projectId: "job-scope",
  storageBucket: "job-scope.appspot.com",
  messagingSenderId: "61949091062",
  appId: "1:61949091062:web:4f592edfc2fb8a42"
}

export default firebase.initializeApp(config)
