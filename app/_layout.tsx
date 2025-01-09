import { useEffect, useState } from 'react'
import { AppStateStatus, LogBox, Platform } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import * as NavigationBar from 'expo-navigation-bar'
import { addEventListener } from '@react-native-community/netinfo'
import { ThemeProvider } from '@react-navigation/native'
import { focusManager } from '@tanstack/react-query'
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

import '@/src/i18n/i18n'
import RootApp from '@/src/modules/RootApp'

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

  useOnlineManager()

  useAppState(onAppStateChange)

  useEffect(() => {
    const unsubscribe = addEventListener((state) => {
      // console.log('Connection type', state.type)
      // console.log('Is connected?', state.isConnected)
    })
    NavigationBar.setBackgroundColorAsync('black')
    NavigationBar.setButtonStyleAsync('light')

    // Unsubscribe
    unsubscribe()
  }, [])

  return (
    <QueryProvider>
      <ThemeProvider
        value={colorScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme}
      >
        <GestureHandlerRootView>
          <AppProvider>
            <SafeAreaProvider>
              <StatusBar style="dark" backgroundColor="transparent" />
              <RootApp />
            </SafeAreaProvider>
          </AppProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryProvider>
  )
}

export default RootLayout
