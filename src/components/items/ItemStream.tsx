import { FC, memo, PropsWithChildren, useEffect } from 'react'
import { StyleSheet, Text, View, Pressable, Linking } from 'react-native'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  withSequence,
} from 'react-native-reanimated'

import { useTranslation } from 'react-i18next'

import { blurhash, SPACE } from '@/src/common/constants/constants'
import { StreamInfo, StreamServer } from '@/src/types/stream'

type Props = PropsWithChildren & {
  streamInfo: StreamInfo
  //   widthItem: number | string
}

const ItemStream: FC<Props> = ({ streamInfo, children }) => {
  const { t } = useTranslation()
  const imageProfile = (server: StreamServer) => {
    switch (server) {
      case 'youtube':
        return require('@/assets/images/icons/youtube.png')
      case 'facebook':
        return require('@/assets/images/icons/facebook.png')
    }
  }

  const heightF = useSharedValue<number>(10)
  const heightS = useSharedValue<number>(10)
  const heightT = useSharedValue<number>(10)

  const fStyles = useAnimatedStyle(() => ({
    height: heightF.value,
  }))
  const sStyles = useAnimatedStyle(() => ({
    height: heightS.value,
  }))
  const tStyles = useAnimatedStyle(() => ({
    height: heightT.value,
  }))

  useEffect(() => {
    heightF.value = withRepeat(
      withSequence(
        withTiming(7, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        withTiming(2, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        withTiming(10, { duration: 500, easing: Easing.inOut(Easing.ease) })
      ),
      0,
      true
    )
    heightS.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(7, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(2, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(10, { duration: 500, easing: Easing.inOut(Easing.ease) })
        ),
        0,
        true
      )
    )
    heightT.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(7, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(2, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(10, { duration: 500, easing: Easing.inOut(Easing.ease) })
        ),
        0,
        true
      )
    )
  }, [])

  return (
    <Pressable
      onPress={() => {
        if (streamInfo.server === 'facebook') {
          Linking.openURL(streamInfo.callId)
        } else {
          router.navigate({
            pathname: '/[mediaId]',
            params: { mediaId: streamInfo.callId },
          })
        }
      }}
    >
      <View style={styles.container}>
        <View style={styles.containerProfile}>
          <Image
            placeholder={{ blurhash }}
            contentFit="contain"
            source={imageProfile(streamInfo.server)}
            style={styles.imageProfile}
          />
          <Text style={styles.textName}>{t('c_short_name')}</Text>
        </View>
        <View style={styles.liveBox}>
          <Animated.View style={[styles.liveCol, fStyles]} />
          <Animated.View style={[styles.liveCol, sStyles]} />
          <Animated.View style={[styles.liveCol, tStyles]} />
        </View>
        {children}
      </View>
    </Pressable>
  )
}

export default memo(ItemStream)

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 5 / 3,
    gap: SPACE,
    marginBottom: SPACE,
    borderRadius: (SPACE * 2) / 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  containerProfile: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACE / 3,
  },
  imageProfile: {
    width: 50,
    aspectRatio: 1 / 1,
    borderRadius: 100,
  },
  textName: {
    fontWeight: '700',
    color: '#fff',
    fontSize: SPACE - 3,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  liveBox: {
    position: 'absolute',
    top: 5,
    left: 5,
    borderRadius: 10,
    paddingVertical: 3,
    backgroundColor: 'red',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 2,
    height: 18,
    width: 33,
  },
  liveCol: {
    width: 4,
    backgroundColor: '#ffffff',
  },
})
