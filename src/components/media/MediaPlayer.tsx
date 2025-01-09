import { FC, memo } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { useNetInfo } from '@react-native-community/netinfo'
import { useTranslation } from 'react-i18next'
// import { useSharedValue, withTiming } from 'react-native-reanimated'
// import * as ScreenOrientation from 'expo-screen-orientation'
// import { setStatusBarHidden } from 'expo-status-bar'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useEvent } from 'expo'

// import { ToggleControls } from '@/src/common/constants/enums'
import { SPACE } from '@/src/common/constants/constants'
// import ControlsOverlay from './ControlsOverlay'

// const playbackSpeedOptions = [0.25, 0.5, 1, 1.5, 2]

type Props = {
  uri: string
  // title: string
  loop?: boolean
  autoplay?: boolean
  // isFullscreen: boolean
  // setIsFullscreen: Dispatch<SetStateAction<boolean>>
}

const MediaPlayer: FC<Props> = ({
  uri,
  // title,
  loop = false,
  autoplay = false,
  // isFullscreen,
  // setIsFullscreen,
}) => {
  const { isConnected } = useNetInfo()
  const { t } = useTranslation()

  // const displayControls = useSharedValue(1)
  // const [isEnd, setIsEnd] = useState<boolean>(false)

  const player = useVideoPlayer(uri, (player) => {
    player.loop = Boolean(loop)
    if (Boolean(autoplay)) player.play()
    else player.pause()
    player.showNowPlayingNotification = true
    // player.timeUpdateEventInterval = 1
  })

  const { status, error } = useEvent(player, 'statusChange', {
    status: player.status,
  })

  // const { isPlaying } = useEvent(player, 'playingChange', {
  //   isPlaying: player.playing,
  // })

  // const { muted } = useEvent(player, 'mutedChange', {
  //   muted: player.muted,
  // })

  // const { playbackRate } = useEvent(player, 'playbackRateChange', {
  //   playbackRate: player.playbackRate,
  // })

  // useEventListener(player, 'playToEnd', () => {
  //   setIsEnd(true)
  // })

  // const { currentTime } = useEvent(player, 'timeUpdate', {
  //   currentTime: Math.round(player.currentTime),
  //   currentLiveTimestamp: player.currentLiveTimestamp,
  //   currentOffsetFromLive: player.currentOffsetFromLive,
  //   bufferedPosition: player.bufferedPosition,
  // })

  // const toggleControls = <T extends number | string>(
  //   type: ToggleControls,
  //   value?: T
  // ) => {
  //   switch (type) {
  //     case ToggleControls.Controls: {
  //       displayControls.value =
  //         displayControls.value === 1
  //           ? withTiming(0, {
  //               duration: 100,
  //             })
  //           : withTiming(1, {
  //               duration: 100,
  //             })
  //       break
  //     }

  //     case ToggleControls.Play: {
  //       player.play()
  //       setTimeout(() => {
  //         displayControls.value = withTiming(0, {
  //           duration: 100,
  //         })
  //       }, 1000)
  //       break
  //     }

  //     case ToggleControls.Pause: {
  //       player.pause()
  //       break
  //     }

  //     case ToggleControls.Seek: {
  //       if (value) {
  //         player.currentTime = +value
  //         player.play()
  //       }
  //       break
  //     }

  //     case ToggleControls.Mute: {
  //       player.muted = !player.muted
  //       break
  //     }

  //     case ToggleControls.Rate: {
  //       const nextSpeedIndex =
  //         playbackSpeedOptions.indexOf(player.playbackRate ?? 1) + 1

  //       player.playbackRate =
  //         nextSpeedIndex < playbackSpeedOptions.length
  //           ? playbackSpeedOptions[nextSpeedIndex]
  //           : playbackSpeedOptions[0]
  //       break
  //     }

  //     case ToggleControls.Replay: {
  //       setIsEnd(false)
  //       player.replay()
  //       setTimeout(() => {
  //         displayControls.value = withTiming(0, {
  //           duration: 100,
  //         })
  //       }, 1000)
  //       break
  //     }

  //     case ToggleControls.Fullscreen: {
  //       setStatusBarHidden(!isFullscreen, 'fade')
  //       if (!isFullscreen) {
  //         setIsFullscreen(true)
  //         ScreenOrientation.lockAsync(
  //           ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
  //         )
  //       } else {
  //         setIsFullscreen(false)
  //         ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT)
  //       }

  //       break
  //     }
  //   }
  // }

  if (!isConnected)
    return (
      <View style={styles.containerNotNet}>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{
            fontSize: SPACE - 3,
            fontWeight: '700',
            color: 'white',
          }}
        >
          {t('e_not_net')}
        </Text>
      </View>
    )
  else if (status === 'error')
    return (
      <View style={styles.containerNotNet}>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{
            fontSize: SPACE - 3,
            fontWeight: '700',
            color: 'white',
          }}
        >
          {error?.message}
        </Text>
      </View>
    )
  else
    return (
      // <Pressable onPress={() => toggleControls(ToggleControls.Controls)}>
      <View style={styles.container}>
        <VideoView
          style={styles.container}
          player={player}
          contentFit="fill"
          allowsFullscreen
          allowsPictureInPicture
          startsPictureInPictureAutomatically
          nativeControls
        />

        {/* <View pointerEvents={undefined} style={[styles.controls]}>
            <ControlsOverlay
              displayControls={displayControls}
              status={status}
              title={title}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={player.duration}
              isFullscreen={isFullscreen}
              isEnd={isEnd}
              muted={muted}
              playbackRate={playbackRate}
              toggleControls={toggleControls}
            />
          </View> */}
      </View>
      // </Pressable>
    )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  containerNotNet: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 15,
  },
})

export default memo(MediaPlayer)
