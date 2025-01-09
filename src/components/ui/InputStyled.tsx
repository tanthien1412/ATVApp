import { FC, Fragment, memo, useRef, useState } from 'react'
import { EnterKeyHintTypeOptions, Text, TextInput, View } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

import useThemeApp from '@/src/common/hooks/useThemeApp'
import { opacityToHex } from '@/src/common/utils/utils'
import { SPACE } from '@/src/common/constants/constants'

import ButtonUI from './ButtonUI'

type Action = 'none' | 'close' | 'eye'

type Props = {
  placeholder: string
  value: string
  setValue: (value: string) => void
  isTurn?: boolean
  setIsTurn?: (val: boolean) => void
  enterKeyHint?: EnterKeyHintTypeOptions
  secureTextEntry?: boolean
  actionStart?: Action
  actionEnd?: Action
  helperText?: string
  onSubmit: (val: string) => void
  color?: string
  bgColor?: string
}

const InputStyled: FC<Props> = ({
  placeholder,
  value,
  setValue,
  isTurn,
  setIsTurn,
  enterKeyHint = 'enter',
  secureTextEntry = false,
  actionStart = 'none',
  actionEnd = 'none',
  helperText,
  onSubmit,
  color,
  bgColor,
}) => {
  const ref = useRef<TextInput>(null)
  const theme = useThemeApp()
  const [secure, setSecure] = useState<boolean>(secureTextEntry)

  const actionObj = (type: Action) => {
    switch (type) {
      case 'close':
        return {
          icon: 'close',
          onPress: () => {
            setValue('')
            ref?.current?.clear()
            ref?.current?.focus()
          },
        }
      case 'eye':
        return {
          icon: !secure ? 'visibility' : 'visibility-off',
          onPress: () => {
            if (setSecure) setSecure(!secure)
          },
        }

      default:
        return { icon: '', onPress: () => {} }
    }
  }

  return (
    <Fragment>
      <View
        style={{
          backgroundColor:
            bgColor ?? `${theme.colors.primary + opacityToHex(0.1)}`,
          shadowColor: theme.colors.border,
          borderRadius: 100,
          width: '100%',
          height: 40,
          elevation: 5,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 1,
          shadowRadius: 10,
        }}
      >
        {actionStart && actionStart !== 'none' && (
          <View style={{ position: 'absolute', top: 10, left: 10 }}>
            <ButtonUI
              icon={
                actionObj(actionStart)
                  ?.icon as keyof typeof MaterialIcons.glyphMap
              }
              chilColor={color ?? theme.colors.tertiary}
              onPress={actionObj(actionStart)?.onPress}
              size="small"
            />
          </View>
        )}

        <TextInput
          ref={ref}
          autoFocus={enterKeyHint === 'search'}
          onFocus={() => {
            if (setIsTurn) setIsTurn(true)
          }}
          enterKeyHint={enterKeyHint}
          placeholder={placeholder}
          // onKeyPress={(e: any) => console.log(e.nativeEvent.key)}
          onChangeText={(text) => setValue(text)}
          value={value}
          secureTextEntry={secure}
          style={{
            padding: (SPACE * 2) / 3,
            marginLeft: actionStart && actionStart !== 'none' ? 20 : 0,
            marginRight: actionEnd && actionEnd !== 'none' ? 20 : 0,
            color: color ?? theme.colors.text,
          }}
          placeholderTextColor={color ?? theme.colors.secondary}
          onSubmitEditing={(e: any) => {
            if (value) {
              onSubmit(value)
              // setValue('')
              // ref?.current?.clear()
              // ref?.current?.focus()
            } else if (enterKeyHint === 'search')
              setTimeout(() => ref?.current?.focus(), 100)
            // if (e.nativeEvent.text) handleSearch(e.nativeEvent.text)
          }}
        />
        {Boolean(value) && actionEnd && actionEnd !== 'none' && (
          <View style={{ position: 'absolute', top: 10, right: 10 }}>
            <ButtonUI
              icon={
                actionObj(actionEnd)
                  ?.icon as keyof typeof MaterialIcons.glyphMap
              }
              chilColor={color ?? theme.colors.tertiary}
              onPress={actionObj(actionEnd)?.onPress}
              size="medium"
            />
          </View>
        )}
      </View>
      {Boolean(helperText) && (
        <View>
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.notification,
              fontStyle: 'italic',
            }}
          >
            {helperText}
          </Text>
        </View>
      )}
    </Fragment>
  )
}

export default memo(InputStyled)
