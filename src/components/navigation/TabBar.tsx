import { useLayoutEffect } from 'react'
import { Keyboard, useWindowDimensions, View, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  ZoomInDown,
} from 'react-native-reanimated'

import { useLinkBuilder } from '@react-navigation/native'
import { Text, PlatformPressable } from '@react-navigation/elements'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'

import useThemeApp from '@/src/common/hooks/useThemeApp'
import { SPACE } from '@/src/common/constants/constants'
import TabIcon from './TabIcon'

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const theme = useThemeApp()
  const { buildHref } = useLinkBuilder()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const TAB_BAR_WIDTH = width - SPACE
  const TAB_BAR_HEIGHT = 60
  const TAB_WIDTH = TAB_BAR_WIDTH / state.routes.length

  const isVisible = useSharedValue(TAB_BAR_HEIGHT)

  const translateAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withSpring(TAB_WIDTH * state.index) }],
    }
  })

  const keyboardStyles = useAnimatedStyle(() => ({
    height: isVisible.value,
  }))

  useLayoutEffect(() => {
    const hideBar = () => {
      isVisible.value = withTiming(0, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      })
    }

    const showBar = () => {
      isVisible.value = withTiming(TAB_BAR_HEIGHT, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      })
    }
    const showSubscription = Keyboard.addListener('keyboardDidShow', hideBar)
    const hideSubscription = Keyboard.addListener('keyboardDidHide', showBar)

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [isVisible])

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.primary,
          width: TAB_BAR_WIDTH,

          height: TAB_BAR_HEIGHT,
          bottom: insets.bottom + SPACE / 2,
        },
        keyboardStyles,
      ]}
    >
      <Animated.View
        style={[
          styles.slidingContainer,
          { width: TAB_WIDTH },
          translateAnimation,
        ]}
      >
        <View
          style={[
            styles.slidingTab,
            {
              width: Math.min(TAB_BAR_HEIGHT, TAB_WIDTH) * 0.86,
              height: '86%',
            },
          ]}
        />
      </Animated.View>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined &&
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }

        const isLive = route.name.includes('live')
        const is360 = route.name.includes('360')

        return (
          <PlatformPressable
            key={route.name}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            <View style={styles.content}>
              <TabIcon route={route.name} isFocused={isFocused} />
              {isFocused && !isLive && (
                <Animated.View entering={ZoomInDown.duration(1000)}>
                  <Text
                    style={{
                      color: theme.colors.primary,
                      fontSize: 10,
                    }}
                  >
                    {label as string}
                    {is360 && `˚`}
                  </Text>
                </Animated.View>
              )}
            </View>
          </PlatformPressable>
        )
      })}
    </Animated.View>
  )
}

export default TabBar

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  slidingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slidingTab: {
    borderRadius: 100,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
  },
})
