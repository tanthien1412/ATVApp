import {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  memo,
  Fragment,
  FC,
} from 'react'
import { StyleSheet, Text } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withDelay,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useTranslation } from 'react-i18next'

import { IToast } from '@/src/types/admin'
import SuccessIcon from '@/assets/iconSvg/success.svg'
import WarningIcon from '@/assets/iconSvg/warning.svg'
import ErrorIcon from '@/assets/iconSvg/error.svg'

type PropsIcon = {
  width: number
  height: number
  type: 'success' | 'warning' | 'error'
}

const ToastIcon: FC<PropsIcon> = ({ width, height, type }) => {
  switch (type) {
    case 'success':
      return <SuccessIcon width={width} height={height} />
    case 'warning':
      return <WarningIcon width={width} height={height} />
    case 'error':
      return <ErrorIcon width={width} height={height} />
  }
}

const Toast = forwardRef(({}, ref) => {
  const { t } = useTranslation()
  const toastTopAnimation = useSharedValue(-100)
  const context = useSharedValue(0)
  const [showing, setShowing] = useState(false)
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>(
    'success'
  )
  const [toastText, setToastText] = useState('')
  const [toastDuration, setToastDuration] = useState(0)

  const TOP_VALUE = 60
  // const TOP_VALUE = Platform.OS === 'ios' ? 60 : 20

  const show = useCallback(
    ({ type, text, duration }: IToast) => {
      setShowing(true)
      setToastType(type)
      setToastText(text)
      setToastDuration(duration)
      toastTopAnimation.value = withSequence(
        withTiming(TOP_VALUE),
        withDelay(
          duration,
          withTiming(-100, {}, (finish) => {
            if (finish) {
              runOnJS(setShowing)(false)
            }
          })
        )
      )
    },
    [TOP_VALUE, toastTopAnimation]
  )

  useImperativeHandle(
    ref,
    () => ({
      show,
    }),
    [show]
  )

  const animatedTopStyles = useAnimatedStyle(() => {
    return {
      top: toastTopAnimation.value,
    }
  })

  const pan = Gesture.Pan()
    .onBegin(() => {
      context.value = toastTopAnimation.value
    })
    .onUpdate((event) => {
      if (event.translationY < 100) {
        toastTopAnimation.value = withSpring(
          context.value + event.translationY,
          {
            damping: 600,
            stiffness: 100,
          }
        )
      }
    })
    .onEnd((event) => {
      if (event.translationY < 0) {
        toastTopAnimation.value = withTiming(-100, {}, (finish) => {
          if (finish) {
            runOnJS(setShowing)(false)
          }
        })
      } else if (event.translationY > 0) {
        toastTopAnimation.value = withSequence(
          withTiming(TOP_VALUE),
          withDelay(
            toastDuration,
            withTiming(-100, {}, (finish) => {
              if (finish) {
                runOnJS(setShowing)(false)
              }
            })
          )
        )
      }
    })

  return (
    <Fragment>
      {showing && (
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.toastContainer,
              toastType === 'success'
                ? styles.successToastContainer
                : toastType === 'warning'
                ? styles.warningToastContainer
                : styles.errorToastContainer,
              animatedTopStyles,
            ]}
          >
            {/* <Image
                source={
                  toastType === 'success'
                    ? require('')
                    : toastType === 'warning'
                    ? require('assets/WarningIcon.png')
                    : require('assets/ErrorIcon.png')
                }
                style={styles.toastIcon}
              /> */}
            <ToastIcon width={30} height={30} type={toastType} />
            <Text
              style={[
                styles.toastText,
                toastType === 'success'
                  ? styles.successToastText
                  : toastType === 'warning'
                  ? styles.warningToastText
                  : styles.errorToastText,
              ]}
            >
              {t(toastText)}
            </Text>
          </Animated.View>
        </GestureDetector>
      )}
    </Fragment>
  )
})

export default memo(Toast)

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    width: '90%',
    padding: 10,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 100000,
  },
  toastText: {
    marginLeft: 14,
    fontSize: 16,
  },
  toastIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  successToastContainer: {
    backgroundColor: '#def1d7',
    borderColor: '#1f8722',
  },
  warningToastContainer: {
    backgroundColor: '#fef7ec',
    borderColor: '#f08135',
  },
  errorToastContainer: {
    backgroundColor: '#fae1db',
    borderColor: '#d9100a',
  },
  successToastText: {
    color: '#1f8722',
  },
  warningToastText: {
    color: '#f08135',
  },
  errorToastText: {
    color: '#d9100a',
  },
})
