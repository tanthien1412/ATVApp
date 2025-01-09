import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getFullMedias } from '../server/api'

const useFullMedias = () => {
  return useQuery({
    queryKey: ['medias'],
    queryFn: getFullMedias,
    placeholderData: keepPreviousData,
    throwOnError: true,
  })
}

export default useFullMedias
