import { AnimationObject } from 'lottie-react-native'

export type OnboardI = {
  id: string
  animation: string | AnimationObject | { uri: string }
  text: string
  textColor: string
  backgroundColor: string
}

export type Navigation = {
  label: string
}
