import { FC, memo } from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated'

type Props = {
  index: number
  x: SharedValue<number>
}

const Dot: FC<Props> = ({ index, x }) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions()

  const animatedDotStyle = useAnimatedStyle(() => {
    const widthAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [10, 20, 10],
      Extrapolation.CLAMP
    )

    const opacityAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    )

    const backgroundAnimation = interpolateColor(
      x.value,
      [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
      ['#749d3f', '#165a33', '#eec33c']
    )

    return {
      width: widthAnimation,
      opacity: opacityAnimation,
      backgroundColor: backgroundAnimation,
    }
  }, [x, index])

  return <Animated.View style={[styles.dots, animatedDotStyle]} />
}

const styles = StyleSheet.create({
  dots: {
    height: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
})

export default memo(Dot)
