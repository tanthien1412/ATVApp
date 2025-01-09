import { FC, PropsWithChildren, useRef } from 'react'
import { StyleSheet, Text } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { SPACE } from '@/src/common/constants/constants'

type Props = PropsWithChildren & {
  onDelete: () => void
}

const AnimatedIcon = Reanimated.createAnimatedComponent(MaterialIcons)

const SwipeableRow: FC<Props> = ({ onDelete, children }) => {
  const ref = useRef<SwipeableMethods>(null)

  const renderRightActions = (
    prog: SharedValue<number>,
    drag: SharedValue<number>
  ) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 60 }],
      }
    })
    return (
      <Reanimated.View style={styleAnimation}>
        <RectButton style={styles.rightAction} onPress={close}>
          <AnimatedIcon name="delete-forever" size={SPACE * 2} color="#fff" />
          <Text style={styles.actionText}>{'Remove'}</Text>
        </RectButton>
      </Reanimated.View>
    )
  }

  const close = () => {
    onDelete()
    ref?.current?.close()
  }

  return (
    <ReanimatedSwipeable
      ref={ref}
      friction={2}
      rightThreshold={40}
      containerStyle={styles.swipeable}
      renderRightActions={renderRightActions}
      enableTrackpadTwoFingerGesture
    >
      {children}
    </ReanimatedSwipeable>
  )
}

export default SwipeableRow

const styles = StyleSheet.create({
  swipeable: {
    flex: 1,
    alignItems: 'center',
  },
  rightAction: {
    flex: 1,
    backgroundColor: 'red',
    width: 60,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACE / 3,
    marginBottom: SPACE,
    borderRadius: (SPACE * 2) / 3,
  },
  actionText: {
    color: 'white',
    fontSize: SPACE - 3,
    backgroundColor: 'transparent',
    textTransform: 'capitalize',
  },
})
