import { FC, memo, PropsWithChildren } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { SharedValue } from 'react-native-reanimated'
import useThemeApp from '@/src/common/hooks/useThemeApp'
import { SPACE } from '@/src/common/constants/constants'
import ButtonUI from '../ui/ButtonUI'

type Action = 'none' | 'search' | 'back' | 'menu' | 'mic' | 'stream'
type TypeIcon = 'vector' | 'svg'

type Props = PropsWithChildren & {
  title?: string
  actionStart?: Action
  actionEnd?: Action
  typeStart?: TypeIcon
  typeEnd?: TypeIcon
  active?: SharedValue<boolean>
  onPressParent?: () => void
}

const HeaderBar: FC<Props> = ({
  title,
  actionStart = 'none',
  actionEnd = 'none',
  typeStart = 'vector',
  typeEnd = 'vector',
  children,
  active,
  onPressParent,
}) => {
  const theme = useThemeApp()

  const actionObj = (type: Action, typeIcon: TypeIcon) => {
    switch (type) {
      case 'search':
        return {
          icon: 'search',
          typeIcon,
          onPress: () =>
            router.navigate({ pathname: '/search', params: { query: '' } }),
        }
      case 'back':
        return {
          icon: 'arrow-back',
          typeIcon,
          onPress: () => router.back(),
        }
      case 'menu':
        return {
          icon: typeIcon === 'svg' ? 'menu' : 'format-align-left',
          typeIcon,
          onPress: () => {
            if (active) {
              active.value = !active.value
            }
          },
        }

      case 'mic':
        return {
          icon: 'mic-none',
          typeIcon,
          onPress: () => {},
        }
      case 'stream':
        return {
          icon: 'sensors',
          typeIcon,
          onPress: () => {
            if (onPressParent) onPressParent()
          },
        }
      default:
        return { icon: '', typeIcon, onPress: () => {} }
    }
  }

  const StartObj = actionObj(actionStart, typeStart)
  const EndObj = actionObj(actionEnd, typeEnd)

  return (
    <View style={styles.container}>
      {actionStart && actionStart !== 'none' && (
        <ButtonUI
          icon={
            StartObj?.typeIcon === 'vector'
              ? (StartObj?.icon as any)
              : undefined
          }
          iconSVG={
            StartObj?.typeIcon === 'svg' ? (StartObj?.icon as any) : undefined
          }
          chilColor={theme.colors.tertiary}
          onPress={StartObj?.onPress}
          size="large"
        />
      )}

      {title && (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.titleStyle, { color: theme.colors.secondary }]}
          >
            {title}
          </Text>
        </View>
      )}

      {!title && (
        <View style={{ flex: 1, alignItems: 'center' }}>{children}</View>
      )}

      {actionEnd && actionEnd !== 'none' && (
        <ButtonUI
          icon={
            EndObj?.typeIcon === 'vector' ? (EndObj?.icon as any) : undefined
          }
          iconSVG={
            EndObj?.typeIcon === 'svg' ? (EndObj?.icon as any) : undefined
          }
          chilColor={theme.colors.tertiary}
          onPress={EndObj?.onPress}
          size="large"
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: SPACE / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: SPACE * 3,
    gap: SPACE / 3,
  },
  titleStyle: {
    fontSize: SPACE,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 25,
    textTransform: 'uppercase',
  },
})

export default memo(HeaderBar)
