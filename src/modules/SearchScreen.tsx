import { FC, useRef, useState, useTransition } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Keyboard,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
} from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { router, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

import useThemeApp from '../common/hooks/useThemeApp'
import useRefreshByUser from '../common/hooks/useRefreshByUser'
import useRefreshOnFocus from '../common/hooks/useRefreshOnFocus'
import { useApp } from '../common/context/AppContext'
import { Media } from '../types/media'
import { SPACE } from '../common/constants/constants'
import { opacityToHex } from '../common/utils/utils'

import HeaderBar from '../components/header/HeaderBar'
import InputStyled from '../components/ui/InputStyled'
import CircularLoading from '../components/ui/CircularLoading'
import GradientBottom from '../components/ui/GradientBottom'
import ItemSub from '../components/items/ItemSub'
import Pagination from '../components/pagination'

const SearchScreen: FC = () => {
  const { query } = useLocalSearchParams<{ query: string }>()
  const { width } = useWindowDimensions()
  const scrollRef = useRef<ScrollView>(null)
  const insets = useSafeAreaInsets()
  const theme = useThemeApp()
  const { t } = useTranslation()
  const [isPending, startTransition] = useTransition()

  const [storeApp] = useApp()
  const { data, refetch } = storeApp

  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch)
  useRefreshOnFocus(refetch)

  const [textSearch, setTextSearch] = useState<string>('')
  const [isTurn, setIsTurn] = useState<boolean>(true)

  const searchData = [
    ...new Set(
      [...(data! ?? [])]?.filter(
        (item) =>
          item.title?.toLowerCase().includes(query?.toLowerCase()) ||
          item.overview?.toLowerCase().includes(query?.toLowerCase()) ||
          item.province?.toLowerCase().includes(query?.toLowerCase())
      )
    ),
  ]

  const [page, setPage] = useState(1)
  const itemsPerPage = 5
  // const pagiData = [...new Set([...generalData]?.slice(0, page * itemsPerPage))]
  const pagiData = [
    ...new Set(
      [...searchData]?.slice(
        (page - 1) * Number(itemsPerPage),
        page * Number(itemsPerPage)
      )
    ),
  ]

  const handleSearch = (e: string) => {
    startTransition(() => {
      router.setParams({ query: e })
      setIsTurn(false)
      setPage(1)
    })
  }

  const aspectRatio = 4 / 3
  const itemHeight = ((width - 2 * SPACE) * (50 / 100)) / aspectRatio

  return (
    <Pressable
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
      onPress={Keyboard.dismiss}
    >
      <HeaderBar
        children={
          <InputStyled
            placeholder={t('search_placeholder')}
            value={textSearch}
            setValue={setTextSearch}
            isTurn={isTurn}
            setIsTurn={setIsTurn}
            enterKeyHint="search"
            actionEnd="close"
            onSubmit={handleSearch}
          />
        }
        actionStart="back"
        // actionEnd="mic"
      />
      {/* Content Section */}
      {isPending ? (
        <CircularLoading />
      ) : isTurn ? (
        <View style={{ flex: 1 }}>
          <GradientBottom
            start={`${theme.colors.primary + opacityToHex(0)}`}
            end={`${theme.colors.primary + opacityToHex(0.9)}`}
          />
        </View>
      ) : searchData?.length > 0 ? (
        <View style={[styles.container]}>
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
            <View style={[styles.subContainer, { gap: SPACE }]}>
              <Text style={styles.title}>
                {t('search_results')}: {query}
              </Text>
              <View style={{ gap: SPACE * 1.5, height: 'auto' }}>
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
                {searchData.length > itemsPerPage && (
                  <Pagination
                    totalItems={searchData.length}
                    pageSize={itemsPerPage}
                    currentPage={page}
                    onPageChange={setPage}
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
            </View>
          </ScrollView>
        </View>
      ) : (
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 500,
            letterSpacing: 0.7,
            color: 'black',
          }}
        >
          {t('search_not_found')}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'honeydew',
  },

  subContainer: { paddingHorizontal: SPACE },
  title: { color: 'black', fontSize: 16, fontWeight: '500' },
})

export default SearchScreen
