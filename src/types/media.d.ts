import { PlaybackStates } from '@/src/common/constants/enums'

export type Media = {
  id: string
  title: string
  tagline: string
  overview: string
  genres: string[]
  view_count: number
  release_date: number
  thread: Thread
  region: string
  subRegion: string
  province: string
  vr: string[]
  video: string
  post: string
}

export type Thread =
  | 'vr360'
  | 'local'
  | 'livestream'
  | 'youtube'
  | 'article'
  | 'aboutUs'

export type MediaState = {
  mediaData: Media[]
  mediaSearch: Media[]
}
