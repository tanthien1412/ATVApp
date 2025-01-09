import { FC, memo } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'

type Props = {
  active: SharedValue<boolean>
}

const Overlay: FC<Props> = ({ active }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      display: active.value ? 'flex' : 'none',
    }
  })
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        style={styles.container}
        onPress={() => {
          active.value = false
        }}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
})

export default memo(Overlay)
