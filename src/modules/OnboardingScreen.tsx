import { FC } from 'react'
import { StyleSheet, View, FlatList, ViewToken } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { OnboardI } from '../types/navigation'
import { OnboardData } from '../common/constants/constants'

import PaginationDot from '../components/carousel/PaginationDot'
import ButtonAnimated from '../components/ui/ButtonAnimated'
import ItemOnboard from '../components/items/ItemOnboard'

type Props = {
  onStart: () => void
}

const OnboardingScreen: FC<Props> = ({ onStart }) => {
  const insets = useSafeAreaInsets()
  const flatListRef = useAnimatedRef<FlatList<OnboardI>>()
  const x = useSharedValue(0)
  const flatListIndex = useSharedValue(0)

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[]
  }) => {
    if (viewableItems[0]?.index !== null) {
      flatListIndex.value = viewableItems[0]?.index
    }
  }

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x
    },
  })

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
      <Animated.FlatList
        ref={flatListRef}
        onScroll={onScroll}
        data={OnboardData}
        renderItem={({ item, index }) => {
          return <ItemOnboard item={item} index={index} x={x} key={item.id} />
        }}
        keyExtractor={(item) => item.id}
        scrollEventThrottle={16}
        horizontal={true}
        bounces={false}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          minimumViewTime: 300,
          viewAreaCoveragePercentThreshold: 10,
        }}
      />
      <View style={styles.bottomContainer}>
        <PaginationDot data={OnboardData} x={x} />
        <ButtonAnimated
          flatListRef={flatListRef}
          flatListIndex={flatListIndex}
          length={OnboardData.length}
          x={x}
          onStart={onStart}
        />
      </View>
    </View>
  )
}

export default OnboardingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'honeydew',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 30,
    paddingVertical: 30,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
})
