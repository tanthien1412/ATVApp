import { FC, memo } from 'react'
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Image } from 'expo-image'
import { BlurView } from 'expo-blur'
import { router } from 'expo-router'
import { SharedValue } from 'react-native-reanimated'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useTranslation } from 'react-i18next'

import { useApp } from '@/src/common/context/AppContext'
import useThemeApp from '@/src/common/hooks/useThemeApp'
import { Navigation } from '@/src/types/navigation'
import { blurhash, DrawerMobile, SPACE } from '@/src/common/constants/constants'
import { i18nConfig } from '@/src/i18n/i18n'

import TabIcon from './TabIcon'
import LocaleSwitcher from './LocaleSwitcher'

type Props = {
  active: SharedValue<boolean>
}

const Drawer: FC<Props> = ({ active }) => {
  const theme = useThemeApp()
  const { t } = useTranslation()

  const [storeApp, setStoreApp] = useApp()

  const { user } = storeApp

  const isAdmin = user && !user.isAnonymous

  const handleSignout = async () =>
    Alert.alert(t('signout_btn'), t('alert_sub_logout'), [
      {
        text: t('alert_action_later'),
        style: 'cancel',
      },
      {
        text: t('alert_action_agree'),
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('user')
            setStoreApp({
              user: null,
              toast: {
                type: 'success',
                text: t('signout_success'),
                duration: 3000,
              },
            })
          } finally {
          }
        },
      },
    ])

  const onPress = async (item: Navigation) => {
    switch (item.label) {
      case 'aboutUs': {
        router.navigate('/about')
        active.value = false
        break
      }
      case 'app_admin': {
        router.navigate('/auth')
        active.value = false
        break
      }
      case 'signout_btn': {
        handleSignout()
        break
      }
      default: {
        return
      }
    }
  }

  const DrawerMobileAcc = [
    ...new Set(
      [...DrawerMobile]?.filter((item: Navigation) =>
        Boolean(isAdmin)
          ? !item?.label?.includes('admin')
          : !item?.label?.includes('signout')
      )
    ),
  ]

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.tertiary }]}
    >
      <View style={{ ...StyleSheet.absoluteFillObject, overflow: 'hidden' }}>
        <BlurView
          style={{ flex: 1, backgroundColor: 'transparent' }}
          tint={Platform.OS === 'ios' ? 'regular' : 'light'}
          intensity={20}
        />
      </View>
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.containerProfile,
            { borderBottomWidth: Boolean(isAdmin) ? 1 : 0 },
          ]}
        >
          <Image
            source={
              Boolean(isAdmin) && Boolean(user?.photoURL)
                ? user?.photoURL
                : require('@/assets/images/logo/thnn_logo.png')
            }
            placeholder={{ blurhash }}
            style={Boolean(isAdmin) ? styles.imageProfile : styles.imageLogo}
            contentFit="fill"
          />
          {Boolean(isAdmin) && (
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>
              {user?.displayName ?? user?.email}
            </Text>
          )}
        </View>
        <View style={styles.containerItem}>
          {DrawerMobileAcc.map((item, index) => {
            return (
              <Pressable
                key={index}
                accessibilityRole="button"
                style={{ gap: SPACE }}
                onPress={async () => await onPress(item)}
              >
                <View style={styles.drawer}>
                  <TabIcon route={item.label} isFocused={false} />
                  <Text style={styles.text}>{t(item.label)}</Text>
                </View>
                {item.label.includes('locale_label') && (
                  <View style={styles.locale}>
                    {i18nConfig.locales.map((locale) => (
                      <LocaleSwitcher
                        key={locale}
                        value={locale}
                        active={active}
                      />
                    ))}
                  </View>
                )}
              </Pressable>
            )
          })}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -9999,
  },
  contentContainer: {
    paddingTop: 120,
    marginHorizontal: 30,
    maxWidth: 180,
  },
  containerProfile: {
    gap: SPACE / 2,
    paddingBottom: SPACE / 2,
    alignItems: 'center',
    borderBottomColor: 'white',
  },
  imageLogo: { minWidth: 100, width: '100%', aspectRatio: 21 / 9 },
  imageProfile: {
    width: 50,
    height: 50,
    aspectRatio: 1 / 1,
    borderRadius: 100,
  },
  containerItem: {
    marginTop: SPACE * 2,
    gap: SPACE * 1.5,
  },
  drawer: {
    flexDirection: 'row',
    gap: SPACE / 3,
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
    color: 'white',
    fontSize: SPACE,
  },
  locale: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
})

export default memo(Drawer)
