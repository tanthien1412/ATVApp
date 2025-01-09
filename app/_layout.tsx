import { useEffect, useState } from 'react'
import { AppStateStatus, LogBox, Platform } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import * as NavigationBar from 'expo-navigation-bar'
import { addEventListener } from '@react-native-community/netinfo'
import { ThemeProvider } from '@react-navigation/native'
import { focusManager } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated'

import QueryProvider from '@/src/common/providers/QueryProvider'
import { AppProvider } from '@/src/common/context/AppContext'
import { CombinedDarkTheme, CombinedLightTheme } from '@/src/common/theme/theme'
import useOnlineManager from '@/src/common/hooks/useOnlineManager'
import useAppState from '@/src/common/hooks/useAppState'
import { useColorScheme } from '@/src/common/hooks/useColorScheme.web'
import OnboardingScreen from '@/src/modules/OnboardingScreen'

import '@/src/i18n/i18n'

LogBox.ignoreLogs(['Support for defaultProps will be removed'])
SplashScreen.preventAutoHideAsync()
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
})

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
})

const onAppStateChange = (status: AppStateStatus) => {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

const RootLayout = () => {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  const [first, setFirst] = useState<string>('')

  useOnlineManager()

  useAppState(onAppStateChange)

  const getApp = async () => {
    try {
      const res = await AsyncStorage.getItem('app')
      if (res !== null) {
        setFirst(res)
      }
    } catch (e) {
      return e
    }
  }

  useEffect(() => {
    const unsubscribe = addEventListener((state) => {
      // console.log('Connection type', state.type)
      // console.log('Is connected?', state.isConnected)
    })

    if (loaded) {
      SplashScreen.hideAsync()
    }
    NavigationBar.setBackgroundColorAsync('black')
    NavigationBar.setButtonStyleAsync('light')
    getApp()
    // Unsubscribe
    unsubscribe()
  }, [loaded])

  if (!loaded) {
    return null
  }

  const onStart = async () => {
    await AsyncStorage.setItem('app', 'home')
    setFirst('home')
  }

  return (
    <QueryProvider>
      <ThemeProvider
        value={colorScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme}
      >
        <GestureHandlerRootView>
          <AppProvider>
            <SafeAreaProvider>
              <StatusBar style="dark" backgroundColor="transparent" />
              {Boolean(first) ? (
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="search"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="[mediaId]"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="about" options={{ headerShown: false }} />
                  <Stack.Screen name="auth" options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" />
                </Stack>
              ) : (
                <OnboardingScreen onStart={onStart} />
              )}
            </SafeAreaProvider>
          </AppProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryProvider>
  )
}

export default RootLayout
