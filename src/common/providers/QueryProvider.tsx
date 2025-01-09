import { ReactNode } from 'react'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import {
  getQueryClient,
  persister,
} from '@/src/common/services/get-query-client'

type Props = {
  readonly children: ReactNode
}

const QueryProvider = ({ children }: Props) => {
  const queryClient = getQueryClient()
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <QueryErrorResetBoundary>{children}</QueryErrorResetBoundary>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </PersistQueryClientProvider>
  )
}

export default QueryProvider
