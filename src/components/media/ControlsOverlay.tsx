import { FC, memo } from 'react'
import {
  View,
  Platform,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import Slider from '@react-native-community/slider'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Aminated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'

import { SPACE } from '@/src/common/constants/constants'
import useThemeApp from '@/src/common/hooks/useThemeApp'
import { formatTime, opacityToHex } from '@/src/common/utils/utils'
import { ToggleControls } from '@/src/common/constants/enums'

import CircularLoading from '../ui/CircularLoading'

type Props = {
  displayControls: SharedValue<number>
  status: string
  title: string
  isPlaying: boolean
  currentTime: number
  duration: number
  playbackRate: number
  muted: boolean
  toggleControls: <T extends number | string>(
    type: ToggleControls,
    value?: T
  ) => void
  isFullscreen: boolean
  isEnd: boolean
}

const ControlsOverlay: FC<Props> = ({
  displayControls,
  status,
  title,
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  muted,
  toggleControls,
  isFullscreen,
  isEnd,
}) => {
  const theme = useThemeApp()

  const display = useAnimatedStyle(() => {
    return {
      display: displayControls.value === 1 ? 'flex' : 'none',
    }
  })

  return status !== 'readyToPlay' ? (
    <Aminated.View style={[styles.container, display]}>
      <CircularLoading />
    </Aminated.View>
  ) : (
    <Aminated.View style={[styles.container, display]}>
      <View style={styles.topWrapper}>
        <View
          style={{
            backgroundColor: `${theme.colors.primary + opacityToHex(0.7)}`,
            padding: SPACE / 2,
          }}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: SPACE - 3,
              fontWeight: '700',
              color: theme.colors.tertiary,
            }}
          >
            {title}
          </Text>
        </View>
      </View>

      <View style={styles.midWrapper}>
        <TouchableOpacity
          disabled={isEnd}
          style={styles.btnIcon}
          onPress={() =>
            toggleControls<number>(ToggleControls.Seek, currentTime - 10)
          }
        >
          <MaterialIcons
            name="skip-previous"
            style={{ fontSize: SPACE * 1.75, color: theme.colors.tertiary }}
          />
        </TouchableOpacity>
        {isEnd ? (
          <TouchableOpacity
            style={[
              styles.btnIcon,
              { width: SPACE * 3.5, height: SPACE * 3.5 },
            ]}
            onPress={() => toggleControls(ToggleControls.Replay)}
          >
            <MaterialIcons
              name={'replay'}
              style={{
                fontSize: SPACE * 2.5,
                color: theme.colors.tertiary,
              }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.btnIcon,
              { width: SPACE * 3.5, height: SPACE * 3.5 },
            ]}
            onPress={() =>
              isPlaying
                ? toggleControls(ToggleControls.Pause)
                : toggleControls(ToggleControls.Play)
            }
          >
            <MaterialIcons
              name={isPlaying ? 'pause' : 'play-arrow'}
              style={{
                fontSize: SPACE * 2.5,
                color: theme.colors.tertiary,
              }}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          disabled={isEnd}
          style={styles.btnIcon}
          onPress={() =>
            toggleControls<number>(ToggleControls.Seek, currentTime + 10)
          }
        >
          <MaterialIcons
            name="skip-next"
            style={{
              fontSize: SPACE * 1.75,
              color: theme.colors.tertiary,
            }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.botWrapper}>
        <Text
          style={{
            fontSize: SPACE - 3,
            color: theme.colors.tertiary,
          }}
        >
          {`${formatTime(currentTime)} / ${formatTime(duration)}`}
        </Text>
        <Slider
          style={{ flex: 1 }}
          value={Math.round(currentTime)}
          minimumValue={0}
          maximumValue={Math.round(duration)}
          maximumTrackTintColor={Platform.select({
            android: '#ffffff',
            ios: '#ffffff',
          })}
          minimumTrackTintColor={theme.colors.tertiary}
          thumbTintColor={theme.colors.secondary}
          onValueChange={(value) =>
            toggleControls<number>(ToggleControls.Seek, Math.round(value))
          }
          // onSlidingStart={(_value) => {
          //   if (isPlaying) toggleControls(ToggleControls.Pause)
          // }}
          // onSlidingComplete={(value) => {
          //   toggleControls<number>(ToggleControls.Seek, Math.round(value))
          // }}
        />
        <TouchableOpacity onPress={() => toggleControls(ToggleControls.Mute)}>
          <MaterialIcons
            name={muted ? 'volume-off' : 'volume-up'}
            style={{
              fontSize: isFullscreen ? SPACE * 3 : SPACE * 2,
              color: theme.colors.tertiary,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleControls(ToggleControls.Rate)}>
          <Text
            style={{
              fontSize: SPACE,
              fontWeight: '700',
              color: theme.colors.tertiary,
              paddingHorizontal: SPACE,
            }}
          >{`${playbackRate}x`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleControls(ToggleControls.Fullscreen)}
        >
          <MaterialIcons
            name={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
            style={{
              fontSize: isFullscreen ? SPACE * 3 : SPACE * 2,
              color: theme.colors.tertiary,
            }}
          />
        </TouchableOpacity>
      </View>
    </Aminated.View>
  )
}

export default memo(ControlsOverlay)

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  topWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    maxWidth: '80%',
    width: 'auto',
  },
  midWrapper: {
    flexDirection: 'row',
    gap: SPACE * 3.5,
    alignItems: 'center',
  },
  botWrapper: {
    backgroundColor: 'rgba(116, 157, 63, 0.7)',
    position: 'absolute',
    bottom: 0,
    paddingVertical: SPACE / 3,
    width: '100%',
    paddingHorizontal: SPACE / 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  btnIcon: {
    backgroundColor: 'rgba(116, 157, 63, 0.7)',
    borderRadius: 1000,
    width: SPACE * 2.5,
    height: SPACE * 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
