import { FC, Fragment, useRef, useState } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  RefreshControl,
} from 'react-native'
import { FlashList } from '@shopify/flash-list'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { difference } from 'lodash-es'

import useThemeApp from '../common/hooks/useThemeApp'
import { useApp } from '../common/context/AppContext'
import useRefreshByUser from '../common/hooks/useRefreshByUser'
import useRefreshOnFocus from '../common/hooks/useRefreshOnFocus'
import { Media, Thread } from '../types/media'
import { SPACE, ThreadMobile } from '../common/constants/constants'
import { findThreadCurrent, splitStringDate } from '../common/utils/utils'

import Drawer from '../components/navigation/Drawer'
import HeaderBar from '../components/header/HeaderBar'
import ItemMain from '../components/items/ItemMain'
import ItemSub from '../components/items/ItemSub'
import Heading from '../components/header/Heading'
import Overlay from '../components/ui/Overlay'
import Pagination from '../components/pagination'
import CircularLoading from '../components/ui/CircularLoading'

type Props = {
  thread: Thread
}

const ThreadScreen: FC<Props> = ({ thread }) => {
  const scrollRef = useRef<ScrollView>(null)
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

  const sortData = [
    ...new Set(
      [...(data! ?? [])]?.sort(
        (a: Media, b: Media) =>
          splitStringDate(b?.release_date).getTime() -
          splitStringDate(a?.release_date).getTime()
      )
    ),
  ]

  const threadData = [
    ...new Set([...sortData]?.filter((item: Media) => item.thread === thread)),
  ]

  const lastestData = [...new Set([...threadData]?.slice(0, 4))]

  const generalData = difference(threadData, lastestData)

  const [page, setPage] = useState(1)
  const itemsPerPage = 5
  // const pagiData = [...new Set([...generalData]?.slice(0, page * itemsPerPage))]
  const pagiData = [
    ...new Set(
      [...generalData]?.slice(
        (page - 1) * Number(itemsPerPage),
        page * Number(itemsPerPage)
      )
    ),
  ]

  const aspectRatio = 4 / 3
  const itemHeight = ((width - 2 * SPACE) * (50 / 100)) / aspectRatio

  // const viewabilityConfigCallbackPairs = useRef([
  //   {
  //     viewabilityConfig: {
  //       minimumViewTime: 500,
  //       itemVisiblePercentThreshold: 50,
  //     },
  //     onViewableItemsChanged: ({
  //       viewableItems,
  //       changed,
  //     }: {
  //       viewableItems: Array<ViewToken>
  //       changed: Array<ViewToken>
  //     }) => {
  //       changed.forEach((changedItem) => {
  //         if (changedItem?.isViewable) {
  //           // console.log('++ Impression for: ', changedItem?.item?.id)
  //         }
  //       })
  //     },
  //   },
  // ])

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
        <HeaderBar
          title={t(findThreadCurrent(thread, ThreadMobile)?.label)}
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
              refreshing={isRefetchingByUser}
              onRefresh={refetchByUser}
            />
          }
        >
          <View style={[styles.subContainer, { gap: SPACE * 2 }]}>
            <View style={{ gap: SPACE * 1.5, minHeight: itemHeight }}>
              {/* <Heading title={t('title_lastest')} /> */}
              <ItemMain media={lastestData[0]} />
              <FlashList
                data={lastestData.slice(1, 4)}
                renderItem={({ item }) => (
                  <ItemSub key={item._id} media={item} />
                )}
                estimatedItemSize={itemHeight}
                getItemType={(item) => typeof item._id}
                keyExtractor={(item: Media) => item._id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>

            {generalData.length > 0 && (
              <View style={{ gap: SPACE * 1.5, minHeight: itemHeight }}>
                <Heading title={t('title_general')} />
                {/* <FlatList
                  data={pagiData}
                  renderItem={({ item }) => (
                    <ItemSub key={item._id} media={item} />
                  )}
                  keyExtractor={(item: Media) => item._id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ gap: SPACE }}
                  scrollEnabled={false}
                  initialNumToRender={itemsPerPage}
                  onEndReached={() => setPage((prev) => prev + 1)}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={() =>
                    isRefetchingByUser && <CircularLoading />
                  }
                  refreshing={isRefetchingByUser}
                  onRefresh={refetchByUser}
                  getItemLayout={(data, index) => ({
                    length: itemHeight,
                    offset: (itemHeight + SPACE) * index,
                    index,
                  })}
                  viewabilityConfigCallbackPairs={
                    viewabilityConfigCallbackPairs.current
                  }
                /> */}

                <FlashList
                  data={pagiData}
                  renderItem={({ item }) => (
                    <ItemSub key={item._id} media={item} />
                  )}
                  estimatedItemSize={itemHeight}
                  getItemType={(item) => typeof item._id}
                  keyExtractor={(item: Media) => item._id}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
                {generalData.length > itemsPerPage && (
                  <Pagination
                    totalItems={generalData.length}
                    pageSize={itemsPerPage}
                    currentPage={page}
                    onPageChange={(page) => {
                      setPage(page)
                      scrollRef.current?.scrollTo({
                        y: width * 2,
                        animated: true,
                      })
                    }}
                    showLastPagesButtons={true}
                    btnStyle={{
                      backgroundColor: theme.colors.primary,
                      borderColor: 'transparent',
                      borderRadius: '50%',
                    }}
                    activeBtnStyle={{ backgroundColor: theme.colors.tertiary }}
                  />
                )}
              </View>
            )}
          </View>
        </ScrollView>

        <Overlay active={active} />
      </Animated.View>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'honeydew',
  },

  subContainer: { paddingHorizontal: SPACE, paddingTop: SPACE / 2 },
})

export default ThreadScreen
