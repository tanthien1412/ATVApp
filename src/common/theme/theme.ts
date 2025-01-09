import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native'

// import {
//   MD3DarkTheme,
//   MD3LightTheme,
//   adaptNavigationTheme,
// } from 'react-native-paper'

// const { LightTheme, DarkTheme } = adaptNavigationTheme({
//   reactNavigationLight: NavigationDefaultTheme,
//   reactNavigationDark: NavigationDarkTheme,
// })

// export const CombinedLightTheme = {
//   ...MD3LightTheme,
//   ...LightTheme,
//   colors: {
//     ...MD3LightTheme.colors,
//     ...LightTheme.colors,
//     primary: '#749d3f',
//     secondary: '#165a33',
//     tertiary: '#eec33c',
//   },
// }

// export const CombinedDarkTheme = {
//   ...MD3DarkTheme,
//   ...DarkTheme,
//   colors: {
//     ...MD3DarkTheme.colors,
//     ...DarkTheme.colors,
//     primary: '#749d3f',
//     secondary: '#165a33',
//     tertiary: '#eec33c',
//   },
// }

export const CombinedLightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: '#749d3f',
    secondary: '#165a33',
    tertiary: '#eec33c',
  },
}

export const CombinedDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: '#749d3f',
    secondary: '#165a33',
    tertiary: '#eec33c',
  },
}

export type ThemeApp = typeof CombinedLightTheme
