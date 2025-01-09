import { FC, useRef, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  RefreshControl,
} from 'react-native'
import { FlashList } from '@shopify/flash-list'
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated'
import RenderHtml from 'react-native-render-html'
import { WebView } from 'react-native-webview'
import YoutubePlayer from 'react-native-youtube-iframe'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { difference } from 'lodash-es'
import getVideoId from 'get-video-id'

import useThemeApp from '../common/hooks/useThemeApp'
import useFullMedias from '../common/hooks/useFullMedias'
import useRefreshByUser from '../common/hooks/useRefreshByUser'
import { SPACE } from '../common/constants/constants'
import { numberFormat } from '../common/utils/utils'
import { Media } from '../types/media'

import Heading from '../components/header/Heading'
import ItemOnly from '../components/items/ItemOnly'
import HeaderBar from '../components/header/HeaderBar'
import ButtonUI from '../components/ui/ButtonUI'
import MediaPlayer from '../components/media/MediaPlayer'
import CircularLoading from '../components/ui/CircularLoading'

type WatchingMedia = {
  isMedia: true
  mediaId: string
}

type WatchingYoutube = {
  isMedia: false
  youtubeId: string
}

type Props = {
  item: WatchingMedia | WatchingYoutube
}

const WatchingScreen: FC<Props> = ({ item }) => {
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const theme = useThemeApp()
  const scrollRef = useRef<ScrollView>(null)
  const { t } = useTranslation()

  if (item.isMedia) {
    const { mediaId } = item
    const { data, isPending, refetch } = useFullMedias()
    const media = [...new Set([...(data! ?? [])])].find((item) =>
      mediaId.includes(item.id)
    ) as Media

    const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch)

    const isVr = media?.vr?.length > 0

    const iframeVr = `
    <iframe
      src="${media?.vr[1]}"
      width="100%"
      height="100%"
      allowfullscreen="true"
      loading="lazy"
      allow="autoplay"
    ></iframe>
    `

    const filterData = difference(data!, [media])

    const threadData = [
      ...new Set(
        [...filterData]?.filter((item: Media) => item?.thread === media?.thread)
      ),
    ]

    const relatedData = [
      ...new Set(
        [...threadData]?.filter(
          (item: Media) =>
            item?.province === media?.province ||
            item?.tagline.includes(media?.tagline ?? '')
        )
      ),
    ]

    const aspectRatio = 4 / 3
    const itemHeight = ((width - 2 * SPACE) * (50 / 100)) / aspectRatio
    // const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

    useEffect(() => {
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true })
    }, [mediaId])

    return isPending ? (
      <CircularLoading />
    ) : (
      <View
        style={[
          styles.container,
          {
            width: '100%',
            height: '100%',
            paddingTop: insets.top,
            paddingBottom: insets.bottom + SPACE,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <HeaderBar title={media?.title} actionStart="back" actionEnd="search" />

        <Animated.View
          style={styles.videoContainer}
          entering={FadeIn.duration(500)}
        >
          {isVr ? (
            <WebView
              source={{ html: iframeVr }}
              originWhitelist={['*']}
              style={{ backgroundColor: 'transparent' }}
              startInLoadingState={true}
            />
          ) : (
            <MediaPlayer
              uri={media.video}
              // title={media.title}
              // loop={loop}
              // autoplay={autoPlay}
              // isFullscreen={isFullscreen}
              // setIsFullscreen={setIsFullscreen}
            />
          )}
        </Animated.View>

        <ScrollView
          ref={scrollRef}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={true}
          scrollEventThrottle={16}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          refreshControl={
            <RefreshControl
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
              // progressViewOffset={height / 2}
              refreshing={isRefetchingByUser}
              onRefresh={refetchByUser}
            />
          }
        >
          <Animated.View
            style={[styles.subContainer, { gap: SPACE }]}
            entering={FadeInDown.duration(500)}
          >
            <View>
              <Text
                style={{
                  color: theme.colors.text,
                  fontSize: 18,
                  fontWeight: '700',
                  lineHeight: 20,
                }}
              >
                {media?.title}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    color: theme.colors.text,
                    fontSize: 12,
                    fontWeight: '400',
                    lineHeight: 18,
                    fontStyle: 'italic',
                    flex: 1,
                  }}
                >
                  {media?.province}, {format(media?.release_date, 'dd-MM-yyyy')}
                </Text>
                <ButtonUI
                  startIcon={true}
                  title={numberFormat.format(media?.view_count)}
                  icon="visibility"
                  chilColor={theme.colors.text}
                  size="small"
                  onPress={() => {}}
                />
              </View>
            </View>

            <RenderHtml
              source={{ html: media?.post }}
              contentWidth={width}
              enableExperimentalMarginCollapsing={true}
              renderersProps={{
                img: {
                  enableExperimentalPercentWidth: true,
                },
              }}
            />
            <View style={{ gap: SPACE * 1.5, height: 'auto' }}>
              <Heading title={t('title_related')} />
              <FlashList
                data={relatedData.slice(0, Math.min(3, relatedData.length))}
                renderItem={({ item }) => (
                  <ItemOnly key={item.id} media={item} />
                )}
                estimatedItemSize={itemHeight}
                getItemType={(item) => typeof item.id}
                keyExtractor={(item: Media) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    )
  } else {
    const { youtubeId } = item
    const { id } = getVideoId(youtubeId)

    return (
      <View
        style={[
          styles.container,
          {
            width: '100%',
            height: '100%',
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <HeaderBar title={'Youtube'} actionStart="back" actionEnd="search" />
        <View style={styles.videoContainer}>
          <YoutubePlayer
            height={width * (14 / 9)}
            videoId={id}
            // muted
          />
        </View>
      </View>
    )
  }
}

export default WatchingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'honeydew',
  },

  videoContainer: { width: '100%', aspectRatio: 14 / 9, marginBottom: SPACE },
  // videoFullscreen: { width: '100%', height: '100%' },
  subContainer: { paddingHorizontal: SPACE },
})
