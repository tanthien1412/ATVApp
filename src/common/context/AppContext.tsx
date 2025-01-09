import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from 'firebase/auth'
import { IToast } from '@/src/types/admin'
import Toast from '@/src/components/ui/Toast'

type StoreApp = {
  user: User | null
  toast: IToast | null
}

const AppContext = createContext<
  [StoreApp, Dispatch<SetStateAction<StoreApp>>] | null
>(null)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const toastRef = useRef<any>()
  const [storeApp, setStoreApp] = useState<StoreApp>({
    user: null,
    toast: null,
  })
  const getIsSignin = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user')
      const user: User | null = jsonValue != null ? JSON.parse(jsonValue) : null
      if (user !== null) setStoreApp({ ...storeApp, user })
      else await AsyncStorage.removeItem('user')
    } finally {
    }
  }

  useEffect(() => {
    getIsSignin()
  }, [])

  useEffect(() => {
    if (storeApp.toast !== null)
      toastRef?.current?.show({
        type: storeApp.toast.type,
        text: storeApp.toast.text,
        duration: storeApp.toast.duration,
      })

    setStoreApp({ ...storeApp, toast: null })
  }, [storeApp.toast])

  return (
    <AppContext.Provider value={[storeApp, setStoreApp]}>
      {children}
      <Toast ref={toastRef} />
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === null) {
    throw new Error('useApp must be used within a AppProvider')
  }
  return context
}
