import React, { useState } from 'react'

import { StyleSheet, View, Pressable, Text } from 'react-native'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../common/services/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'

import useThemeApp from '../common/hooks/useThemeApp'
import { SigninParam } from '../types/admin'
import { AccountField } from '../common/constants/enums'
import { validateEmail } from '../common/utils/utils'
import { blurhash, SPACE } from '../common/constants/constants'
import { useApp } from '../common/context/AppContext'

import ButtonUI from '../components/ui/ButtonUI'
import InputStyled from '../components/ui/InputStyled'

type SigninError = {
  eEmail: string
  ePassword: string
  eResponse: string
}

const SigninScreen = () => {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()
  const theme = useThemeApp()

  const initError: SigninError = {
    eEmail: '',
    ePassword: '',
    eResponse: '',
  }

  const initSignin: SigninParam = {
    email: '',
    password: '',
  }

  const [accountState, setAccountState] = useState<SigninParam>(initSignin)
  const [signinError, setSigninError] = useState<SigninError>(initError)
  const [storeApp, setStoreApp] = useApp()

  const handleSetAccount = <T extends string>(type: AccountField, value: T) => {
    switch (type) {
      case AccountField.Email:
        setAccountState({
          ...accountState,
          email: value as string,
        })
        setSigninError({
          ...signinError,
          eResponse: '',
          eEmail: Boolean(value)
            ? validateEmail(value)
              ? ''
              : t('warning_email_incorrect')
            : t('warning_email_empty'),
        })
        break
      case AccountField.Password:
        setAccountState({
          ...accountState,
          password: value,
        })
        setSigninError({
          ...signinError,
          eResponse: '',
          ePassword: Boolean(value) ? '' : t('warning_pass_empty'),
        })
        break
    }
  }

  const arrayFieldInput = [
    {
      title: t('signin_email'),
      key: AccountField.Email,
      value: accountState?.email,
      placeholder: t('phd_email'),
      error: signinError.eEmail,
      animated: FadeInDown.duration(1000).springify(),
    },
    {
      title: t('signin_pass'),
      key: AccountField.Password,
      value: accountState?.password,
      placeholder: t('phd_pass'),
      error: signinError.ePassword,
      animated: FadeInDown.delay(200).duration(1000).springify(),
    },
  ]

  const handleValidate = () => {
    if (accountState.email && accountState.password) return true
    else return false
  }

  const handleSignin = async () => {
    await signInWithEmailAndPassword(
      auth,
      accountState.email,
      accountState.password
    )
      .then(async (userCredential) => {
        try {
          setStoreApp({
            ...storeApp,
            user: userCredential.user,
            toast: {
              type: 'success',
              text: t('signin_success'),
              duration: 3000,
            },
          })
          await AsyncStorage.setItem(
            'user',
            JSON.stringify(userCredential.user)
          )
        } finally {
          router.back()
        }
      })
      .catch((error) => {
        setSigninError({ ...signinError, eResponse: error.message })
      })
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <Image
        source={require('@/assets/images/background-login.png')}
        contentFit="fill"
        style={styles.image}
        placeholder={{ blurhash }}
      />
      <View style={styles.contentContainer}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}
        >
          <Animated.Text
            entering={FadeInUp.duration(1000).springify()}
            style={{
              color: '#ffffff',
              fontSize: 40,
              fontWeight: '900',
            }}
          >
            {t('app_admin')}
          </Animated.Text>
          {signinError.eResponse && (
            <Text
              style={{
                fontSize: 12,
                color: theme.colors.notification,
                fontStyle: 'italic',
              }}
            >
              {signinError.eResponse}
            </Text>
          )}
        </View>

        {arrayFieldInput.map((item) => (
          <Animated.View
            key={item.key}
            style={{ width: '100%', gap: SPACE / 3 }}
            entering={item.animated}
          >
            <Text style={{ color: '#ffffff', fontSize: 16 }}>
              {item.title}:
            </Text>
            <InputStyled
              placeholder={item.placeholder}
              enterKeyHint="done"
              actionEnd={item.key === AccountField.Password ? 'eye' : 'close'}
              value={item.value}
              setValue={(val) => handleSetAccount<string>(item.key, val)}
              onSubmit={(val) => handleSetAccount<string>(item.key, val)}
              secureTextEntry={item.key === AccountField.Password}
              helperText={item.error}
              bgColor="#ffffff"
              color="#000000"
            />
          </Animated.View>
        ))}
        <ButtonUI
          title={t('app_signin')}
          mode="contained"
          buttonColor={'#4630eb'}
          chilColor={'#ffffff'}
          size="medium"
          onPress={handleSignin}
          disabled={!handleValidate()}
        />
        <Animated.View
          entering={FadeInDown.delay(600).duration(1000).springify()}
          style={styles.register}
        >
          <Text style={styles.forgot}>{t('not_admin')}?</Text>
          <Pressable onPress={() => router.back()}>
            <Text
              style={{
                ...styles.forgot,
                textDecorationLine: 'underline',
                color: '#ffffff',
                marginLeft: 5,
              }}
            >
              {t('signin_client')}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  )
}

export default SigninScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'space-evenly',
    paddingHorizontal: SPACE,
    gap: SPACE * 2,
  },
  forgot: {
    color: '#ffffff',
    textAlign: 'right',
  },
  button: {
    marginVertical: 20,
    opacity: 1,
  },
  register: {
    alignSelf: 'center',
    alignItems: 'center',
    gap: SPACE / 5,
  },
})
