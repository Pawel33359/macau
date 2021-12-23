import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyBPz9GDAUAGasqCxcj5iYD7DJTSg3tehss",
  authDomain: "macao-4bf61.firebaseapp.com",
  databaseURL: "https://macao-4bf61-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "macao-4bf61",
  storageBucket: "macao-4bf61.appspot.com",
  messagingSenderId: "977676151965",
  appId: "1:977676151965:web:bedb2dd3984d8cc43c7874"
};


//init firebase
firebase.initializeApp(firebaseConfig)

//init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()
const projectDatabase = firebase.database()

//FieldValue
const FieldValue = firebase.firestore.FieldValue

//timestamp
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export {projectFirestore, projectAuth, projectStorage,projectDatabase, timestamp, FieldValue}