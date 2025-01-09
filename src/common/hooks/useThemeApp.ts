import { createContext, useContext } from 'react'
import { CombinedLightTheme, ThemeApp } from '../theme/theme'

// export const useThemeApp = (): ThemeApp => {
//   const themePaper = useThemePaper()
//   const themeNavigation = useThemeNavigation()
//   return {
//     ...themePaper,
//     ...themeNavigation,
//     colors: {
//       ...themePaper.colors,
//       ...themeNavigation.colors,
//     },
//   }
// }

const useThemeApp = (): ThemeApp => {
  const ThemeContext = createContext<ThemeApp>(CombinedLightTheme)
  ThemeContext.displayName = 'ThemeContext'
  const theme = useContext(ThemeContext)
  return theme
}

export default useThemeApp
