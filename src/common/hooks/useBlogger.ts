import { keepPreviousData, useQuery, skipToken } from '@tanstack/react-query'
import { getBlogger } from '../server/api'

const useBlogger = (post: string | null | undefined) => {
  return useQuery({
    queryKey: ['blogger', { post }],
    queryFn: post ? () => getBlogger(post) : skipToken,
    placeholderData: keepPreviousData,
    throwOnError: true,
  })
}

export default useBlogger
