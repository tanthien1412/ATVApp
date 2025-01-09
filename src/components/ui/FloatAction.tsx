import { FC } from 'react'
import { Pressable, StyleSheet, View, PressableProps } from 'react-native'
import { Image } from 'expo-image'
import Reanimated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import useThemeApp from '@/src/common/hooks/useThemeApp'
import { SPACE } from '@/src/common/constants/constants'

type Props = {
  first: () => void
  second: () => void
  //   third: () => void
}

const AnimatedButton =
  Reanimated.createAnimatedComponent<PressableProps>(Pressable)

const FloatAction: FC<Props> = ({ first, second }) => {
  const theme = useThemeApp()
  const insets = useSafeAreaInsets()

  const firstValue = useSharedValue(30)
  const secondValue = useSharedValue(30)
  const thirdValue = useSharedValue(30)
  const firstWidth = useSharedValue(60)
  const secondWidth = useSharedValue(60)
  const thirdWidth = useSharedValue(60)
  const isOpen = useSharedValue(false)
  const opacity = useSharedValue(0)
  const progress = useDerivedValue(() =>
    isOpen.value ? withTiming(1) : withTiming(0)
  )

  const handlePress = () => {
    const config = {
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      duration: 500,
    }
    if (isOpen.value) {
      firstWidth.value = withTiming(60, { duration: 100 }, (finish) => {
        if (finish) {
          firstValue.value = withTiming(30, config)
        }
      })
      secondWidth.value = withTiming(60, { duration: 100 }, (finish) => {
        if (finish) {
          secondValue.value = withDelay(50, withTiming(30, config))
        }
      })
      thirdWidth.value = withTiming(60, { duration: 100 }, (finish) => {
        if (finish) {
          thirdValue.value = withDelay(100, withTiming(30, config))
        }
      })
      opacity.value = withTiming(0, { duration: 100 })
    } else {
      firstValue.value = withDelay(100, withSpring(80))
      secondValue.value = withDelay(200, withSpring(150))
      thirdValue.value = withSpring(300)
      firstWidth.value = withDelay(1000, withSpring(180))
      secondWidth.value = withDelay(1100, withSpring(180))
      thirdWidth.value = withDelay(1200, withSpring(180))
      opacity.value = withDelay(1200, withSpring(1))
    }
    isOpen.value = !isOpen.value
  }

  const opacityText = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  const firstWidthStyle = useAnimatedStyle(() => {
    return {
      width: firstWidth.value,
    }
  })
  const secondWidthStyle = useAnimatedStyle(() => {
    return {
      width: secondWidth.value,
    }
  })
  const thirdWidthStyle = useAnimatedStyle(() => {
    return {
      width: thirdWidth.value,
    }
  })

  const firstIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      firstValue.value,
      [30, 80],
      [0, 1],
      Extrapolation.CLAMP
    )

    return {
      bottom: firstValue.value,
      transform: [{ scale: scale }],
    }
  })

  const secondIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      secondValue.value,
      [30, 150],
      [0, 1],
      Extrapolation.CLAMP
    )

    return {
      bottom: secondValue.value,
      transform: [{ scale: scale }],
    }
  })

  const thirdIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      thirdValue.value,
      [30, 220],
      [0, 1],
      Extrapolation.CLAMP
    )

    return {
      bottom: thirdValue.value,
      transform: [{ scale: scale }],
    }
  })

  const plusIcon = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 45}deg` }],
    }
  })

  return (
    <View style={styles.container}>
      <AnimatedButton
        onPress={() => {
          first()
          handlePress()
        }}
        style={[
          styles.contentContainer,
          {
            backgroundColor: theme.colors.tertiary,
            bottom: insets.bottom + SPACE,
            right: insets.right + SPACE,
          },
          firstIcon,
          firstWidthStyle,
        ]}
      >
        <View style={styles.iconContainer}>
          <Image
            source={require('@/assets/images/icons/youtube.png')}
            style={styles.icon}
            contentFit="fill"
          />
        </View>
        <Reanimated.Text style={[styles.text, opacityText]}>
          Youtube live
        </Reanimated.Text>
      </AnimatedButton>
      <AnimatedButton
        onPress={() => {
          second()
          handlePress()
        }}
        style={[
          styles.contentContainer,
          {
            backgroundColor: theme.colors.tertiary,
            bottom: insets.bottom + SPACE,
            right: insets.right + SPACE,
          },
          secondIcon,
          secondWidthStyle,
        ]}
      >
        <View style={styles.iconContainer}>
          <Image
            source={require('@/assets/images/icons/facebook.png')}
            style={styles.icon}
            contentFit="fill"
          />
        </View>
        <Reanimated.Text style={[styles.text, opacityText]}>
          Facebook live
        </Reanimated.Text>
      </AnimatedButton>
      {/* <AnimatedButton
        onPress={() => {
          third()
          handlePress()
        }}
        style={[
          styles.contentContainer,
          {
            backgroundColor: theme.colors.tertiary,
            bottom: insets.bottom + SPACE,
            right: insets.right + SPACE,
          },
          thirdIcon,
          thirdWidthStyle,
        ]}
      >
        <View style={styles.iconContainer}>
          <Image
            source={require('@/assets/images/icons/mobile.png')}
            style={styles.icon}
            contentFit='fill'
          />
        </View>
        <Reanimated.Text style={[styles.text, opacityText]}>
          Mobile live
        </Reanimated.Text>
      </AnimatedButton> */}
      <AnimatedButton
        style={[
          styles.contentContainer,
          {
            backgroundColor: theme.colors.tertiary,
            bottom: insets.bottom + SPACE,
            right: insets.right + SPACE,
          },
        ]}
        onPress={handlePress}
      >
        <Reanimated.View style={[styles.iconContainer, plusIcon]}>
          <Image
            source={require('@/assets/images/icons/plus.png')}
            style={styles.icon}
          />
        </Reanimated.View>
      </AnimatedButton>
    </View>
  )
}

export default FloatAction

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    position: 'absolute',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: SPACE * 3.5,
    height: SPACE * 3.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: SPACE * 1.5,
    height: SPACE * 1.5,
  },
  text: {
    color: 'white',
    fontSize: SPACE,
  },
})
