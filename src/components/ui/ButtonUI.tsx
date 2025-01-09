import { FC, memo } from 'react'
import { Text, View, Pressable, StyleProp, ViewStyle } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { SvgProps } from 'react-native-svg'

import GoogleICon from '@/assets/iconSvg/google.svg'
import MenuIcon from '@/assets/iconSvg/menu.svg'

import useThemeApp from '@/src/common/hooks/useThemeApp'
import { SPACE } from '@/src/common/constants/constants'
import CircularLoading from './CircularLoading'

type IconSVG = 'google' | 'menu'

type Props = {
  icon?: keyof typeof MaterialIcons.glyphMap
  iconSVG?: IconSVG
  startIcon?: boolean
  title?: string
  mode?: 'text' | 'outlined' | 'contained' | 'elevated'
  size?: 'small' | 'medium' | 'large' | 'extra-large'
  chilColor?: string
  buttonColor?: string
  disabled?: boolean
  isLoading?: boolean
  onPress?: () => void
}

const ButtonUI: FC<Props> = ({
  icon,
  iconSVG,
  startIcon = false,
  title,
  mode = 'text',
  size = 'medium',
  chilColor,
  buttonColor,
  disabled,
  isLoading,
  onPress,
}) => {
  const theme = useThemeApp()

  const fontSize = (size: string) => {
    switch (size) {
      case 'small':
        return 14
      case 'medium':
        return 20
      case 'large':
        return 28
      case 'extra-large':
        return 36
      default:
        return 12
    }
  }

  const SVGIcon = ({ svg, style }: { svg: IconSVG; style: SvgProps }) => {
    switch (svg) {
      case 'google':
        return <GoogleICon {...style} />
      case 'menu':
        return <MenuIcon {...style} />
    }
  }

  const styleView = (mode: string): StyleProp<ViewStyle> => {
    switch (mode) {
      case 'text':
        return {
          backgroundColor: 'transparent',
        }
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderColor: chilColor ?? theme.colors.text,
          borderWidth: 1,
          borderStyle: 'solid',
          padding: Boolean(title) ? 10 : 5,
        }
      case 'contained':
        return {
          padding: Boolean(title) ? 10 : 5,
          backgroundColor: buttonColor ?? theme.colors.background,
        }
      case 'elevated':
        return {
          padding: Boolean(title) ? 10 : 5,
          backgroundColor: buttonColor ?? theme.colors.background,
          elevation: 5,
          shadowColor: theme.colors.border,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 1,
          shadowRadius: 10,
        }
      default:
        return {}
    }
  }

  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <View
        style={[
          {
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: !startIcon ? 'row' : 'row-reverse',
            gap: Boolean(iconSVG)
              ? SPACE * 1.5
              : isLoading
              ? SPACE / 2
              : SPACE / 3,
          },
          styleView(mode),
        ]}
      >
        {Boolean(title) && (
          <Text
            style={{
              color: chilColor ?? theme.colors.text,
              fontSize: fontSize(size) - 2,
              lineHeight: 20,
              letterSpacing: 0.5,
              opacity: disabled ? 0.5 : 1,
            }}
          >
            {title as string}
          </Text>
        )}
        {Boolean(icon) && (
          <MaterialIcons
            name={icon}
            style={{
              color: chilColor ?? theme.colors.text,
              fontSize: fontSize(size),
            }}
          />
        )}
        {iconSVG !== undefined && (
          <SVGIcon
            svg={iconSVG}
            style={{
              width: fontSize(size) + 5,
              height: fontSize(size) + 5,
              fill: chilColor ?? theme.colors.text,
            }}
          />
        )}
        {Boolean(isLoading) && <CircularLoading />}
      </View>
    </Pressable>
  )
}

export default memo(ButtonUI)
