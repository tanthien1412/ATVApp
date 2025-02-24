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
import { StoreApp } from '@/src/types/admin'
import Toast from '@/src/components/ui/Toast'
import useFullMedias from '../hooks/useFullMedias'

const AppContext = createContext<
  [StoreApp, Dispatch<SetStateAction<StoreApp>>] | null
>(null)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { data, isPending, refetch } = useFullMedias()
  const toastRef = useRef<any>()
  const [storeApp, setStoreApp] = useState<StoreApp>({
    user: null,
    toast: null,
    data: data,
    isPending: isPending,
    refetch: refetch,
  })

  useEffect(() => {
    const getApp = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('user')
        const user: User | null =
          jsonValue != null ? JSON.parse(jsonValue) : null
        if (user !== null) setStoreApp((prev) => ({ ...prev, user }))
        else await AsyncStorage.removeItem('user')
      } finally {
      }
    }
    getApp()
  }, [])

  useEffect(() => {
    setStoreApp((prev) => ({ ...prev, data, isPending, refetch }))
  }, [isPending, data, refetch])

  useEffect(() => {
    if (storeApp.toast !== null)
      toastRef?.current?.show({
        type: storeApp.toast.type,
        text: storeApp.toast.text,
        duration: storeApp.toast.duration,
      })

    setStoreApp((prev) => ({ ...prev, toast: null }))
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
