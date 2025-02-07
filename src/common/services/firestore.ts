import { initializeApp } from 'firebase/app'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import { getFirestore, collection } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { firebaseConfig } from '../config/config'

// initialize firebase
const firebaseApp = initializeApp(firebaseConfig)
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
})
const db = getFirestore(firebaseApp)

const channelDocRef = collection(db, 'channels')
const usersDocRef = collection(db, 'users')

export { firebaseApp, auth, db, channelDocRef, usersDocRef }
