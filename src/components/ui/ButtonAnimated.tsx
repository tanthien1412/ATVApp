import { FC, memo } from 'react'
import {
  FlatList,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native'
import Animated, {
  AnimatedRef,
  SharedValue,
  interpolateColor,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useTranslation } from 'react-i18next'
import { OnboardI } from '@/src/types/navigation'

type Props = {
  length: number
  flatListIndex: SharedValue<number>
  flatListRef: AnimatedRef<FlatList<OnboardI>>
  x: SharedValue<number>
  onStart: () => void
}

const ButtonAnimated: FC<Props> = ({
  flatListRef,
  flatListIndex,
  length,
  x,
  onStart,
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions()
  const { t } = useTranslation()
  const buttonAnimationStyle = useAnimatedStyle(() => {
    return {
      width:
        flatListIndex.value === length - 1 ? withSpring(140) : withSpring(60),
      height: 60,
    }
  }, [x, length])

  const arrowAnimationStyle = useAnimatedStyle(() => {
    return {
      width: 30,
      height: 30,
      opacity:
        flatListIndex.value === length - 1 ? withTiming(0) : withTiming(1),
      transform: [
        {
          translateX:
            flatListIndex.value === length - 1
              ? withTiming(100)
              : withTiming(0),
        },
      ],
    }
  }, [x, length])

  const textAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity:
        flatListIndex.value === length - 1 ? withTiming(1) : withTiming(0),
      transform: [
        {
          translateX:
            flatListIndex.value === length - 1
              ? withTiming(0)
              : withTiming(-100),
        },
      ],
    }
  }, [x, length])

  const animatedColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      x.value,
      [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
      ['#749d3f', '#165a33', '#eec33c']
    )

    return {
      backgroundColor: backgroundColor,
    }
  }, [x, length])

  return (
    <Pressable
      onPress={() => {
        if (flatListIndex.value < length - 1) {
          flatListRef.current?.scrollToIndex({ index: flatListIndex.value + 1 })
        } else {
          onStart()
        }
      }}
    >
      <Animated.View
        style={[styles.container, buttonAnimationStyle, animatedColor]}
      >
        <Animated.Text style={[styles.textButton, textAnimationStyle]}>
          {t('app_start')}
        </Animated.Text>
        <Animated.Image
          source={require('@/assets/images/icons/arrowIcon.png')}
          style={[styles.arrow, arrowAnimationStyle]}
        />
      </Animated.View>
    </Pressable>
  )
}

export default memo(ButtonAnimated)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e2169',
    padding: 10,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  arrow: {
    position: 'absolute',
  },
  textButton: { color: 'white', fontSize: 16, position: 'absolute' },
})
