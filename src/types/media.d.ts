export type Media = {
  thumbnail: string
  _id: string
  title: string
  tagline: string
  overview: string
  genres: string[]
  view_count: number
  release_date: string
  thread: Thread
  region: string
  subRegion: string
  province: string
  vr: string
  video: string
  post: string
}

export type Thread =
  | 'vr360'
  | 'local'
  | 'livestream'
  | 'youtube'
  | 'article'
  | 'expert'
  | 'aboutUs'

export type MediaState = {
  mediaData: Media[]
  mediaSearch: Media[]
}
