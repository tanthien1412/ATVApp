import { FC } from 'react'
import { View } from 'react-native'

import HomeIcon from '@/assets/iconSvg/home.svg'
import TV360Icon from '@/assets/iconSvg/tv360.svg'
import LiveIcon from '@/assets/iconSvg/livestream.svg'
import ArticleIcon from '@/assets/iconSvg/article.svg'
import LocalIcon from '@/assets/iconSvg/local.svg'
import AboutIcon from '@/assets/iconSvg/about.svg'
import AppIcon from '@/assets/iconSvg/app.svg'
import LanguagesIcon from '@/assets/iconSvg/languages.svg'
import VIEIcon from '@/assets/iconSvg/vietnam.svg'
import ENGIcon from '@/assets/iconSvg/usa.svg'
import SigninICon from '@/assets/iconSvg/signin.svg'
import SignoutICon from '@/assets/iconSvg/signout.svg'
import ChangeIcon from '@/assets/iconSvg/change.svg'

import useThemeApp from '@/src/common/hooks/useThemeApp'
import { SPACE } from '@/src/common/constants/constants'

type Props = {
  route: string
  isFocused: boolean
}

const TabIcon: FC<Props> = ({ route, isFocused }) => {
  const theme = useThemeApp()

  const renderIcon = (route: string, isFocused: boolean) => {
    let height: number = 28
    let width: number = 28

    switch (route) {
      case 'index':
        return (
          <HomeIcon
            width={isFocused ? width - SPACE / 2 : width}
            height={isFocused ? height - SPACE / 2 : height}
            fill={isFocused ? theme.colors.primary : '#ffffff'}
            stroke={isFocused ? theme.colors.primary : '#ffffff'}
          />
        )
      case 'vr360':
        return (
          <TV360Icon
            width={isFocused ? width - SPACE / 2 : width}
            height={isFocused ? height - SPACE / 2 : height}
            fill={isFocused ? theme.colors.primary : '#ffffff'}
          />
        )
      case 'livestream':
        return (
          <LiveIcon
            width={isFocused ? width * 1.7 : width * 2}
            height={isFocused ? height * 1.7 : height * 2}
            fill={isFocused ? 'red' : '#ffffff'}
          />
        )
      case 'article':
        return (
          <ArticleIcon
            width={isFocused ? width - SPACE / 2 : width}
            height={isFocused ? height - SPACE / 2 : height}
            fill={isFocused ? theme.colors.primary : '#ffffff'}
          />
        )
      case 'local':
        return (
          <LocalIcon
            width={isFocused ? width - SPACE / 2 : width}
            height={isFocused ? height - SPACE / 2 : height}
            fill={isFocused ? theme.colors.primary : '#ffffff'}
          />
        )
      case 'aboutUs':
        return (
          <AboutIcon
            width={width}
            height={height}
            fill={isFocused ? theme.colors.primary : '#ffffff'}
          />
        )
      case 'aboutApp':
        return (
          <AppIcon
            width={width}
            height={height}
            fill={isFocused ? theme.colors.primary : '#ffffff'}
          />
        )
      case 'locale_label':
        return (
          <LanguagesIcon
            width={width}
            height={height}
            fill={isFocused ? theme.colors.primary : '#ffffff'}
          />
        )
      case 'vi':
        return <VIEIcon width={width} height={height} />
      case 'en':
        return <ENGIcon width={width} height={height} />
      case 'app_admin':
        return (
          <SigninICon
            width={width}
            height={height}
            fill={isFocused ? theme.colors.primary : '#ffffff'}
          />
        )
      case 'signout_btn':
        return (
          <SignoutICon
            width={width}
            height={height}
            fill={isFocused ? theme.colors.primary : '#ffffff'}
          />
        )
      case 'change_acc_btn':
        return (
          <ChangeIcon
            width={width}
            height={height}
            fill={isFocused ? theme.colors.primary : '#ffffff'}
          />
        )
      default:
        return <View></View>
    }
  }

  return renderIcon(route, isFocused)
}

export default TabIcon
