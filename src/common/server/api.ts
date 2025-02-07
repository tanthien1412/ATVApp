import axios, { type AxiosError } from 'axios'
import { Media, Thread } from '@/src/types/media'

const axiosInstance = axios.create()

const baseUrl = `${process.env.EXPO_PUBLIC_SERVER_URL}medias`

export const getFullMedias = async () => {
  return await axiosInstance
    .get<Media[]>(baseUrl)
    .then(function (response) {
      if (response.status === 200) return response.data
      else return []
    })
    .catch(function (error: AxiosError) {
      return []
    })
}

export const getSearchMedias = async (search: string) => {
  return (await axiosInstance.get<Media[]>(`${baseUrl}?search=${search}`)).data
}

export const getMedia = async (id: string) => {
  return (await axiosInstance.get<Media>(`${baseUrl}?id=/${id}`)).data
}

export const getThreadMedias = async (thread: Thread) => {
  return (await axiosInstance.get<Media[]>(`${baseUrl}?thread=${thread}`)).data
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
    ? `${baseUrl}?page=${page}&limit=${limit}${
        genre ? '&genre='.concat(genre) : ''
      }${search ? '&search='.concat(search) : ''}${
        thread ? '&thread='.concat(thread) : ''
      }`
    : isAllThread
    ? `${baseUrl}?thread=${thread}`
    : isAllGenre
    ? `${baseUrl}?genre=${genre}`
    : isAllSearch
    ? `${baseUrl}?search=${search}`
    : `${baseUrl}${search ? '?search='.concat(search) : ''}${
        search ? '&genre='.concat(genre) : ''
      }${thread ? '&thread='.concat(thread) : ''}`

  return (await axiosInstance.get<Media[]>(uri)).data
}

export const getBlogger = async (post: string) => {
  return await axiosInstance
    .get<any>(
      `https://www.googleapis.com/blogger/v3/blogs/${process.env.EXPO_PUBLIC_ID_BLOG}/posts/${post}?key=${process.env.EXPO_PUBLIC_API_GOOGLE_KEY}`
    )
    .then(function (response) {
      if (response.status === 200) return response.data
      else return null
    })
    .catch(function (error: AxiosError) {
      return null
    })
}
