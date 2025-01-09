import { FC, Fragment } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  RefreshControl,
} from 'react-native'
import { Image } from 'expo-image'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { difference } from 'lodash-es'

import useThemeApp from '../common/hooks/useThemeApp'
import useRefreshByUser from '../common/hooks/useRefreshByUser'
import useRefreshOnFocus from '../common/hooks/useRefreshOnFocus'
import { Media } from '../types/media'
import { useApp } from '../common/context/AppContext'
import { blurhash, SPACE, ThreadMobile } from '../common/constants/constants'
import { findThreadCurrent, opacityToHex } from '../common/utils/utils'

import Drawer from '../components/navigation/Drawer'
import HeaderBar from '../components/header/HeaderBar'
import ButtonUI from '../components/ui/ButtonUI'
import Overlay from '../components/ui/Overlay'
import Heading from '../components/header/Heading'
import ParallaxCarousel from '../components/carousel/ParallaxCarousel'
import ItemMain from '../components/items/ItemMain'
import ItemSub from '../components/items/ItemSub'
import CircularLoading from '../components/ui/CircularLoading'
import ModalVideo from '../components/ui/ModalVideo'

const HomeScreen: FC = () => {
  const { width } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const theme = useThemeApp()
  const { t } = useTranslation()
  const TAB_BAR_HEIGHT = 60

  const [storeApp] = useApp()
  const { data, isPending, refetch } = storeApp

  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch)
  useRefreshOnFocus(refetch)

  const active = useSharedValue(false)
  const progress = useDerivedValue(() => {
    return withTiming(active.value ? 1 : 0)
  })

  const animatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      progress.value,
      [0, 1],
      [0, -15],
      Extrapolation.CLAMP
    )
    return {
      transform: [
        { perspective: 1000 },
        { scale: active.value ? withTiming(0.8) : withTiming(1) },
        { translateX: active.value ? withSpring(width * 0.6) : withTiming(0) },
        {
          rotateY: `${rotateY}deg`,
        },
      ],
      borderRadius: active.value ? withTiming(28) : withTiming(0),
    }
  })

  const expertData = [
    ...new Set(
      [...(data! ?? [])]?.filter((item: Media) =>
        item.genres?.includes('Expert')
      )
    ),
  ]

  const filterData = difference(data!, expertData)

  const articleData = [
    ...new Set(
      [...filterData]?.filter((item: Media) => item.thread === 'article')
    ),
  ]

  const localData = [
    ...new Set(
      [...filterData]?.filter((item: Media) => item.thread === 'local')
    ),
  ]

  const aspectRatio = 4 / 3
  const itemHeight = ((width - 2 * SPACE) * (50 / 100)) / aspectRatio

  return isPending ? (
    <CircularLoading />
  ) : (
    <Fragment>
      <Drawer active={active} />
      <Animated.View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom + TAB_BAR_HEIGHT + SPACE,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
          animatedStyle,
        ]}
      >
        {/* Header Section */}
        <HeaderBar
          active={active}
          actionStart="menu"
          actionEnd="search"
          children={
            <Image
              source={require('@/assets/images/logo/thnn_logo.png')}
              placeholder={{ blurhash }}
              style={{ minWidth: 100, width: '45%', height: SPACE * 3 }}
              contentFit="contain"
            />
          }
        />
        {/* Content Section */}
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
              // progressViewOffset={height / 2}
              refreshing={isRefetchingByUser}
              onRefresh={refetchByUser}
            />
          }
        >
          <View
            style={[
              styles.subContainer,
              { gap: SPACE * 2, marginBottom: SPACE },
            ]}
          >
            <ParallaxCarousel
              data={expertData}
              width={width}
              aspectRatio={3 / 2}
            />

            <View style={{ gap: SPACE * 1.5, minHeight: itemHeight }}>
              <Heading
                title={t(findThreadCurrent('article', ThreadMobile)?.label)}
              />
              <ItemMain media={articleData[0]} />
              {/* <FlatList
                data={articleData.slice(1, 5)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: SPACE }}
                keyExtractor={(item: Media) => item.id}
                renderItem={({ item }) => (
                  <ItemSub key={item.id} media={item} />
                )}
                scrollEnabled={false}
                initialNumToRender={5}
              /> */}
              <FlashList
                data={articleData.slice(1, 5)}
                renderItem={({ item }) => (
                  <ItemSub key={item.id} media={item} />
                )}
                estimatedItemSize={itemHeight}
                getItemType={(item) => typeof item.id}
                keyExtractor={(item: Media) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                // contentContainerStyle={{ gap: SPACE }}
              />
              <ButtonUI
                title={`${t('more_btn')} ${t(
                  findThreadCurrent('article', ThreadMobile)?.label
                )}`}
                icon="keyboard-double-arrow-right"
                mode="elevated"
                buttonColor={`${theme.colors.primary + opacityToHex(0.2)}`}
                chilColor={theme.colors.secondary}
                size="small"
                onPress={() => router.replace('/article')}
              />
            </View>

            <View style={{ gap: SPACE * 1.5, minHeight: itemHeight }}>
              <Heading
                title={t(findThreadCurrent('local', ThreadMobile)?.label)}
              />
              {/* <FlatList
                data={localData.slice(0, 5)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: SPACE }}
                keyExtractor={(item: Media) => item.id}
                renderItem={({ item }) => (
                  <ItemOnly key={item.id} media={i />
                )}
                scrollEnabled={false}
                initialNumToRender={5}
              /> */}
              <FlashList
                data={localData.slice(1, 5)}
                renderItem={({ item }) => (
                  <ItemSub key={item.id} media={item} />
                )}
                estimatedItemSize={itemHeight}
                getItemType={(item) => typeof item.id}
                keyExtractor={(item: Media) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
              <ButtonUI
                title={`${t('more_btn')} ${t(
                  findThreadCurrent('Local', ThreadMobile)?.label
                )}`}
                icon="keyboard-double-arrow-right"
                mode="elevated"
                buttonColor={`${theme.colors.primary + opacityToHex(0.2)}`}
                chilColor={theme.colors.secondary}
                size="small"
                onPress={() => router.replace('/local')}
              />
            </View>
          </View>
        </ScrollView>
        <Overlay active={active} />
        <ModalVideo />
      </Animated.View>
    </Fragment>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'honeydew',
    // marginTop: Constants.statusBarHeight,
  },
  subContainer: { paddingHorizontal: SPACE },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalView: {
    width: '100%',
    height: '100%',
  },

  modalText: {
    fontSize: SPACE + 3,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
})
