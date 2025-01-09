import AsyncStorage from '@react-native-async-storage/async-storage'
import { QueryClient } from '@tanstack/react-query'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
      },
    },
  })
}

export const getQueryClient = () => {
  return makeQueryClient()
}

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
})
