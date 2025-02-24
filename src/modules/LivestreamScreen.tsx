import { FC, Fragment, useRef, useState } from 'react'
import {
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  View,
  RefreshControl,
  Text,
  ViewToken,
} from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { FlashList } from '@shopify/flash-list'
import { doc, addDoc, deleteDoc } from 'firebase/firestore'

import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import useThemeApp from '../common/hooks/useThemeApp'
import useStreamData from '../common/hooks/useStreamData'
import { useApp } from '../common/context/AppContext'

import { StreamInfo } from '../types/stream'
import { SPACE, ThreadMobile } from '../common/constants/constants'
import { findThreadCurrent } from '../common/utils/utils'
import { channelDocRef } from '../common/services/firestore'

import CircularLoading from '../components/ui/CircularLoading'
import Drawer from '../components/navigation/Drawer'
import Overlay from '../components/ui/Overlay'
import HeaderBar from '../components/header/HeaderBar'
import ItemStream from '../components/items/ItemStream'
import SwipeableRow from '../components/ui/SwipeableRow'
import FloatAction from '../components/ui/FloatAction'
import ModalInput from '../components/ui/ModalInput'

const LivestreamScreen: FC = () => {
  const { streamData, isLoading } = useStreamData()
  const scrollRef = useRef<ScrollView>(null)
  const { width } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const theme = useThemeApp()
  const [storeApp, setStoreApp] = useApp()
  const { user } = storeApp
  const { t } = useTranslation()
  const TAB_BAR_HEIGHT = 60

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

  const [page, setPage] = useState(1)
  const itemsPerPage = 5
  const pagiData = [...new Set([...streamData]?.slice(0, page * itemsPerPage))]

  const onRefresh = () => {
    if (Boolean(isLoading)) {
      return
    }
    // setPage(1)
  }

  const aspectRatio = 4 / 3
  const itemHeight = ((width - 2 * SPACE) * (50 / 100)) / aspectRatio

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: {
        minimumViewTime: 500,
        itemVisiblePercentThreshold: 50,
      },
      onViewableItemsChanged: ({
        viewableItems,
        changed,
      }: {
        viewableItems: ViewToken[]
        changed: ViewToken[]
      }) => {
        changed.forEach((changedItem) => {
          if (changedItem?.isViewable) {
            // console.log('++ Impression for: ', changedItem?.item?.id)
          }
        })
      },
    },
  ])

  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [server, setServer] = useState<string>('')
  const [value, setValue] = useState<string>('')

  const isAnonymous = user?.isAnonymous

  const handleRemoveStream = async (stream: StreamInfo) => {
    await deleteDoc(doc(channelDocRef, stream?.id)).then(() => {
      setStoreApp({
        ...storeApp,
        toast: {
          type: 'success',
          text: t('remove_success'),
          duration: 3000,
        },
      })
    })
  }

  const handleSend = async (e: string) => {
    await addDoc(channelDocRef, {
      callId: e,
      user: user?.email,
      createdAt: new Date().getTime(),
      server: server,
    } as StreamInfo).then(() => {
      setStoreApp({
        ...storeApp,
        toast: {
          type: 'success',
          text: t('add_success'),
          duration: 3000,
        },
      })
      // closeModal()
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true })
    })
  }

  return isLoading ? (
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
        <HeaderBar
          title={t(findThreadCurrent('Livestream', ThreadMobile)?.label)}
          actionStart="menu"
          actionEnd="search"
          active={active}
        />
        {/* Content Section */}
        <ScrollView
          ref={scrollRef}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={true}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
              // progressViewOffset={height / 2}
              refreshing={isLoading}
              onRefresh={onRefresh}
            />
          }
        >
          <View style={[styles.subContainer, { gap: SPACE * 3 }]}>
            <View style={{ gap: SPACE * 1.5, minHeight: itemHeight }}>
              {streamData.length > 0 ? (
                <FlashList
                  data={pagiData}
                  renderItem={({ item }) =>
                    isAnonymous ? (
                      <ItemStream key={item.id} streamInfo={item} />
                    ) : (
                      <SwipeableRow onDelete={() => handleRemoveStream(item)}>
                        <ItemStream key={item.id} streamInfo={item} />
                      </SwipeableRow>
                    )
                  }
                  estimatedItemSize={itemHeight}
                  getItemType={(item) => typeof item.id}
                  keyExtractor={(item: StreamInfo) => item.id}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  onEndReached={() => setPage((prev) => prev + 1)}
                  onEndReachedThreshold={0.1}
                  viewabilityConfigCallbackPairs={
                    viewabilityConfigCallbackPairs.current
                  }
                />
              ) : (
                <Text
                  style={{
                    fontSize: 18,
                    color: theme.colors.text,
                    textAlign: 'center',
                  }}
                >
                  {t('no_live')}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
        <Overlay active={active} />
        <ModalInput
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          value={value}
          setValue={setValue}
          server={server}
          setServer={setServer}
          onSend={handleSend}
        />
        {user && !isAnonymous && !modalVisible && (
          <FloatAction
            first={() => {
              setModalVisible(true)
              setServer('youtube')
            }}
            second={() => {
              setModalVisible(true)
              setServer('facebook')
            }}
            // third={handleLiveStream}
          />
        )}
      </Animated.View>
    </Fragment>
  )
}

export default LivestreamScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'honeydew',
  },
  subContainer: { paddingHorizontal: SPACE, paddingTop: SPACE / 2 },
})
