import { FC } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated'
import { Image } from 'expo-image'
import RenderHtml from 'react-native-render-html'

import { useTranslation } from 'react-i18next'

import { Media } from '../types/media'
import useThemeApp from '../common/hooks/useThemeApp'
import useFullMedias from '../common/hooks/useFullMedias'
import { blurhash, SPACE } from '../common/constants/constants'

import CircularLoading from '../components/ui/CircularLoading'
import HeaderBar from '../components/header/HeaderBar'
import MediaPlayer from '../components/media/MediaPlayer'

const AboutUsScreen: FC = () => {
  const insets = useSafeAreaInsets()
  const theme = useThemeApp()
  const { width } = useWindowDimensions()
  const { t } = useTranslation()

  const { data, isPending } = useFullMedias()
  const media = [...new Set([...(data! ?? [])])].find(
    (item) => item?.thread === 'aboutUs'
  ) as Media

  return isPending ? (
    <CircularLoading />
  ) : (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom + SPACE,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <HeaderBar title={t('aboutUs')} actionStart="back" actionEnd="search" />
      <Animated.View
        style={styles.videoContainer}
        entering={FadeIn.duration(500)}
      >
        <MediaPlayer uri={media.video} autoplay={true} loop={true} />
      </Animated.View>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={16}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <Animated.View
          style={[styles.subContainer, { gap: SPACE }]}
          entering={FadeInDown.duration(1000)}
        >
          <View>
            <Image
              source={require('@/assets/images/logo/thnn_logo.png')}
              style={{ width: '100%', aspectRatio: 21 / 9 }}
              placeholder={{ blurhash }}
              contentFit="fill"
            />
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 16,
                fontWeight: '700',
                lineHeight: 24,
                letterSpacing: 0.5,
                fontStyle: 'italic',
                textAlign: 'center',
              }}
            >
              {t('slogan')}
            </Text>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 16,
                fontWeight: '700',
                lineHeight: 24,
                letterSpacing: 0.5,
                fontStyle: 'italic',
                textAlign: 'center',
              }}
            >
              {t('slogan_sub')}
            </Text>
          </View>
          <RenderHtml
            source={{ html: media?.post }}
            contentWidth={width}
            enableExperimentalMarginCollapsing={true}
            renderersProps={{
              img: {
                enableExperimentalPercentWidth: true,
              },
            }}
          />
        </Animated.View>
      </ScrollView>
    </View>
  )
}

export default AboutUsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  videoContainer: { width: '100%', aspectRatio: 14 / 9 },
  subContainer: { paddingHorizontal: SPACE },
})
