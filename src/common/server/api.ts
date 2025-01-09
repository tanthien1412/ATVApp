import axios from 'axios'
import { Media, Thread } from '@/src/types/media'
import { ggScript } from '../config/config'
const axiosInstance = axios.create()

export const getFullMedias = async () => {
  return (await axiosInstance.get<Media[]>(`${ggScript}`)).data
}

export const getSearchMedias = async (search: string) => {
  return (await axiosInstance.get<Media[]>(`${ggScript}?search=${search}`)).data
}

export const getMedia = async (id: string) => {
  return (await axiosInstance.get<Media>(`${ggScript}?id=/${id}`)).data
}

export const getThreadMedias = async (thread: Thread) => {
  return (await axiosInstance.get<Media[]>(`${ggScript}?thread=${thread}`)).data
}

export const getPagiMedias = async (
  page: number,
  limit: number,
  thread: Thread,
  search: string,
  genre: string
) => {
  const isPagi = Boolean(page) && Boolean(limit)
  const isAllThread = Boolean(thread) && !Boolean(search) && !Boolean(genre)
  const isAllGenre = Boolean(genre) && !Boolean(search) && !Boolean(thread)
  const isAllSearch = Boolean(search) && !Boolean(thread) && !Boolean(genre)

  const uri = isPagi
    ? `${ggScript}?page=${page}&limit=${limit}${
        genre ? '&genre='.concat(genre) : ''
      }${search ? '&search='.concat(search) : ''}${
        thread ? '&thread='.concat(thread) : ''
      }`
    : isAllThread
    ? `${ggScript}?thread=${thread}`
    : isAllGenre
    ? `${ggScript}?genre=${genre}`
    : isAllSearch
    ? `${ggScript}?search=${search}`
    : `${ggScript}${search ? '?search='.concat(search) : ''}${
        search ? '&genre='.concat(genre) : ''
      }${thread ? '&thread='.concat(thread) : ''}`

  return (await axiosInstance.get<Media[]>(uri)).data
}

// export const createTodo = async (data: Todo) => {
//   await axiosInstance.post('todos', data)
// }

// export const updateTodo = async (data: Todo) => {
//   await axiosInstance.put(`todos/${data.id}`, data)
// }

// export const deleteTodo = async (id: number) => {
//   await axiosInstance.delete(`todos/${id}`)
// }

// export const getProducts = async ({ pageParam }: { pageParam: number }) => {
//   return (
//     await axiosInstance.get<Product[]>(
//       `products?_page=${pageParam + 1}&_limit=3`
//     )
//   ).data
// }

// export function useProducts() {
//   return useInfiniteQuery({
//     queryKey: ['products'],
//     queryFn: getProducts,
//     initialPageParam: 0,
//     getNextPageParam: (lastPage, _, lastPageParam) => {
//       if (lastPage.length === 0) {
//         return undefined
//       }
//       return lastPageParam + 1
//     },
//     getPreviousPageParam: (_, __, firstPageParam) => {
//       if (firstPageParam <= 1) {
//         return undefined
//       }
//       return firstPageParam - 1
//     },
//   })
// }

// export function useCreateTodo() {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (data: Todo) => createTodo(data),
//     onMutate: () => {
//       console.log('mutate')
//     },

//     onError: () => {
//       console.log('error')
//     },

//     onSuccess: () => {
//       console.log('success')
//     },

//     onSettled: async (_, error) => {
//       console.log('settled')
//       if (error) {
//         console.log(error)
//       } else {
//         await queryClient.invalidateQueries({ queryKey: ['todos'] })
//       }
//     },
//   })
// }

// export function useUpdateTodo() {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (data: Todo) => updateTodo(data),

//     onSettled: async (_, error, variables) => {
//       if (error) {
//         console.log(error)
//       } else {
//         await queryClient.invalidateQueries({ queryKey: ['todos'] })
//         await queryClient.invalidateQueries({
//           queryKey: ['todo', { id: variables.id }],
//         })
//       }
//     },
//   })
// }

// export function useDeleteTodo() {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (id: number) => deleteTodo(id),

//     onSuccess: () => {
//       console.log('deleted successfully')
//     },

//     onSettled: async (_, error) => {
//       if (error) {
//         console.log(error)
//       } else {
//         await queryClient.invalidateQueries({ queryKey: ['todos'] })
//       }
//     },
//   })
// }

// const createTodoMutation = useCreateTodo()
// const updateTodoMutation = useUpdateTodo()
// const deleteTodoMutation = useDeleteTodo()

// const { register, handleSubmit } = useForm<Todo>()

// const handleCreateTodoSubmit: SubmitHandler<Todo> = (data) => {
//   createTodoMutation.mutate(data)
// }

// const handleMarkAsDoneSubmit = (data: Todo | undefined) => {
//   if (data) {
//     updateTodoMutation.mutate({ ...data, checked: true })
//   }
// }

// const handleDeleteTodo = async (id: number) => {
//   await deleteTodoMutation.mutateAsync(id)
// }
