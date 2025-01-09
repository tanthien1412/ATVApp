import { Query, QueryClient, QueryStatus } from '@tanstack/react-query'

const resetQueryClient = (queryClient: QueryClient, status: QueryStatus) => {
  const queryCache = queryClient?.getQueryCache()
  const queryKeys = queryCache
    ?.getAll()
    ?.filter((q: Query) => q.state.status === status)

  if (queryKeys) {
    queryKeys.forEach(({ queryKey }) => {
      queryClient?.resetQueries({ queryKey, exact: true })
    })
  }
}

export default resetQueryClient
