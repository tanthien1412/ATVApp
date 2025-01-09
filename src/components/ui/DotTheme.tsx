import { FC, memo } from 'react'
import { Pressable } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  SharedValue,
  interpolateColor,
} from 'react-native-reanimated'
import { SPACE } from '@/src/common/constants/constants'
import useThemeApp from '@/src/common/hooks/useThemeApp'

type Props = {
  index: number
  length: number
  x: SharedValue<number>
  onPressPagination?: (index: number) => void
}

const DotTheme: FC<Props> = ({
  x,
  index,
  length,

  onPressPagination,
}) => {
  const theme = useThemeApp()
  const width = SPACE / 2
  const animatedStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1]
    let outputRange = [-width, 0, width]

    if (index === 0 && x?.value > length - 1) {
      inputRange = [length - 1, length, length + 1]
      outputRange = [-width, 0, width]
    }

    const translateAnimation = interpolate(
      x?.value,
      inputRange,
      outputRange,
      Extrapolation.CLAMP
    )

    const widthAnimation = interpolate(
      x?.value,
      inputRange,
      [width, width * (length + 1), width],
      Extrapolation.CLAMP
    )

    const opacityAnimation = interpolate(
      x?.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    )

    const backgroundAnimation = interpolateColor(x?.value, inputRange, [
      theme.colors.tertiary,
      theme.colors.primary,
      theme.colors.tertiary,
    ])

    return {
      translateX: translateAnimation,
      width: widthAnimation,
      opacity: opacityAnimation,
      backgroundColor: backgroundAnimation,
    }
  }, [x, index, length])

  return (
    <Pressable
      onPress={() => (onPressPagination ? onPressPagination(index) : null)}
    >
      <Animated.View
        key={index}
        style={[
          {
            borderRadius: 50,
            backgroundColor: theme.colors.primary,
            height: width,
            marginHorizontal: width * (length - 2),
          },
          animatedStyle,
        ]}
      />
    </Pressable>
  )
}

export default memo(DotTheme)
