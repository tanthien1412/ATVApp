import { FC, memo } from 'react'
import { Pressable } from 'react-native'
import { router } from 'expo-router'

import { Media } from '@/src/types/media'
import { SPACE } from '@/src/common/constants/constants'

import ImagePlay from '../media/ImagePlay'

type Props = {
  media: Media
}

const ItemHero: FC<Props> = ({ media }) => {
  const srcImg = media?.thumbnail
    ? media?.thumbnail
    : require('@/assets/images/no_image.png')

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() =>
        router.navigate({
          pathname: '/[mediaId]',
          params: { mediaId: media._id },
        })
      }
    >
      <ImagePlay
        srcImg={srcImg}
        sizeIcon={SPACE * 4}
        titleBottom={media?.title}
        overviewBottom={media?.overview}
      />
    </Pressable>
  )
}

export default memo(
  ItemHero,
  (prevProps, nextProps) => prevProps?.media?._id === nextProps?.media?._id
)
