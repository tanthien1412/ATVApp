import { useLocalSearchParams } from 'expo-router'
import WatchingScreen from '@/src/modules/WatchingScreen'

const WatchingMedia = () => {
  const { mediaId } = useLocalSearchParams<{ mediaId: string }>()
  const isMedia = !mediaId.includes('youtube')

  if (isMedia) return <WatchingScreen item={{ isMedia, mediaId }} />
  else return <WatchingScreen item={{ isMedia, youtubeId: mediaId }} />
}

export default WatchingMedia
