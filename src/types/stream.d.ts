export type StreamServer = 'youtube' | 'facebook'
export type StreamInfo = {
  id: string
  callId: string
  user: string
  createdAt: number
  server: StreamServer
}
