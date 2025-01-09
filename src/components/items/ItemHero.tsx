import { FC, memo } from 'react'
import { Pressable } from 'react-native'
import { router } from 'expo-router'

import { Media } from '@/src/types/media'
import { baseImgUrl } from '@/src/common/config/config'
import { SPACE } from '@/src/common/constants/constants'

import ImagePlay from '../media/ImagePlay'

type Props = {
  media: Media
}

const ItemHero: FC<Props> = ({ media }) => {
  const isVr = media?.vr?.length > 0
  const srcImg = !isVr ? `${baseImgUrl}${media?.id}` : `${media?.vr[0]}`

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() =>
        router.navigate({
          pathname: '/[mediaId]',
          params: { mediaId: media.id },
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
  (prevProps, nextProps) => prevProps?.media?.id === nextProps?.media?.id
)
