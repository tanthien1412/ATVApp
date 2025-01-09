import { FC, memo } from 'react'
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import LottieView from 'lottie-react-native'
import { useTranslation } from 'react-i18next'
import { OnboardI } from '@/src/types/navigation'
import { SPACE } from '@/src/common/constants/constants'

type Props = {
  index: number
  x: SharedValue<number>
  item: OnboardI
}

const ItemOnboard: FC<Props> = ({ index, x, item }) => {
  const { width } = useWindowDimensions()
  const { t } = useTranslation()

  const lottieAnimationStyle = useAnimatedStyle(() => {
    const translateYAnimation = interpolate(
      x.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [200, 0, -200],
      Extrapolation.CLAMP
    )

    return {
      transform: [{ translateY: translateYAnimation }],
    }
  }, [x, index])

  const circleAnimation = useAnimatedStyle(() => {
    const scale = interpolate(
      x.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [1, 4, 4],
      Extrapolation.CLAMP
    )

    return {
      transform: [{ scale: scale }],
    }
  }, [x, index])

  return (
    <View style={[styles.container, { width }]}>
      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            {
              width: width,
              height: width,
              borderRadius: width / 2,
              backgroundColor: item.backgroundColor,
            },
            circleAnimation,
          ]}
        />
      </View>
      <Animated.View style={lottieAnimationStyle}>
        <LottieView
          source={item.animation}
          style={{
            width: width,
            height: width,
          }}
          autoPlay
          loop
        />
      </Animated.View>
      <Text style={[styles.textStyle, { color: item.textColor }]}>
        {t(item.text)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: '20%',
  },
  textStyle: {
    textAlign: 'center',
    fontSize: SPACE * 3,
    fontWeight: '700',
    paddingHorizontal: SPACE,
    letterSpacing: 0.5,
    textTransform: 'capitalize',
  },
  circleContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
})

export default memo(
  ItemOnboard,
  (prevProps, nextProps) => prevProps?.item?.id === nextProps?.item?.id
)
