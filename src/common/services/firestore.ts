import { initializeApp } from 'firebase/app'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import { getFirestore, collection } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAikYCcXqSsdulgfFCscYilDFY_uX1DC0c',
  authDomain: 'truyen-hinh-nong-nghiep-422905.firebaseapp.com',
  projectId: 'truyen-hinh-nong-nghiep-422905',
  storageBucket: 'truyen-hinh-nong-nghiep-422905.appspot.com',
  messagingSenderId: '567250101942',
  appId: '1:567250101942:web:1d521d060c69de7c4ca817',
  measurementId: 'G-GHKZXKZRML',
}
// initialize firebase
const app = initializeApp(firebaseConfig)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})
const db = getFirestore(app)

const channelDocRef = collection(db, 'channels')
const usersDocRef = collection(db, 'users')

export { app, auth, db, channelDocRef, usersDocRef }
