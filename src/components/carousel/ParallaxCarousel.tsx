import { FC, memo, useRef } from 'react'
import { View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'

import { Media } from '@/src/types/media'
import { SPACE } from '@/src/common/constants/constants'
import PaginationDot from './PaginationDot'
import ItemHero from '../items/ItemHero'

type Props = {
  data: Media[]
  width: number
  aspectRatio: number
  autoPlay?: boolean
  pagingEnabled?: boolean
  snapEnabled?: boolean
}

const ParallaxCarousel: FC<Props> = ({
  data,
  width,
  aspectRatio,
  autoPlay = false,
  pagingEnabled = true,
  snapEnabled = true,
}) => {
  const ref = useRef<ICarouselInstance>(null)

  const progressValue = useSharedValue<number>(0)

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progressValue?.value,
      animated: true,
    })
  }

  return (
    <View
      style={{
        alignItems: 'center',
        gap: 5,
      }}
    >
      <Carousel
        ref={ref}
        vertical={false}
        width={width}
        height={width / aspectRatio}
        loop
        pagingEnabled={pagingEnabled}
        snapEnabled={snapEnabled}
        autoPlay={autoPlay}
        autoPlayInterval={3000}
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: SPACE * 3,
        }}
        data={data}
        renderItem={({ item }) => <ItemHero key={item._id} media={item} />}
      />
      {!!progressValue && (
        <PaginationDot
          data={data}
          dotTheme={true}
          x={progressValue}
          onPressPagination={onPressPagination}
        />
      )}
    </View>
  )
}

export default memo(ParallaxCarousel)
