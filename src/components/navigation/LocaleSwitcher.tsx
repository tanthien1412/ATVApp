import { FC, memo, useEffect, useTransition } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { SharedValue } from 'react-native-reanimated'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { SPACE } from '@/src/common/constants/constants'
import TabIcon from './TabIcon'

type Props = {
  value: string
  active: SharedValue<boolean>
}

const LocaleSwitcher: FC<Props> = ({ value, active }) => {
  const [isPending, startTransition] = useTransition()
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language

  const changeLanguages = async () => {
    await AsyncStorage.setItem('language', value)
    startTransition(() => {
      i18n.changeLanguage(value)
      active.value = false
    })
  }

  const isLanguage = currentLanguage == value

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('language')
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage)
      }
    }
    loadLanguage()
  }, [i18n])

  return (
    <Pressable
      style={styles.container}
      onPress={changeLanguages}
      disabled={isLanguage || isPending}
    >
      <TabIcon route={value} isFocused={false} />
      <Text style={[styles.text, { color: isLanguage ? 'black' : 'white' }]}>
        {t(`locale_${value}`)}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACE / 3,
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',

    fontSize: 16,
  },
})

export default memo(LocaleSwitcher)
