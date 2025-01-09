import { useEffect, useState } from 'react'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useApp } from '../common/context/AppContext'

import OnboardingScreen from './OnboardingScreen'

const RootApp = () => {
  const [storeApp] = useApp()
  const { isPending } = storeApp

  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  })

  const [first, setFirst] = useState<string>('')

  const onStart = async () => {
    await AsyncStorage.setItem('app', 'home')
    setFirst('home')
  }

  const getFirst = async () => {
    const res = await AsyncStorage.getItem('app')
    setFirst(res ?? '')
  }

  useEffect(() => {
    getFirst()
    if (loaded && !isPending) {
      SplashScreen.hideAsync()
    }
  }, [loaded, isPending])

  if (!loaded || isPending) {
    return null
  }

  return Boolean(first) ? (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="search" options={{ headerShown: false }} />
      <Stack.Screen name="[mediaId]" options={{ headerShown: false }} />
      <Stack.Screen name="about" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  ) : (
    <OnboardingScreen onStart={onStart} />
  )
}

export default RootApp
