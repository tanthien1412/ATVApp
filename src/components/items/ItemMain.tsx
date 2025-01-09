import { FC, memo } from 'react'
import { View, Pressable } from 'react-native'
import { router } from 'expo-router'

import { Media } from '@/src/types/media'
import { baseImgUrl } from '@/src/common/config/config'
import { SPACE } from '@/src/common/constants/constants'
import ImagePlay from '../media/ImagePlay'
import ContentText from '../media/ContentText'

type Props = {
  media: Media
}

const ItemMain: FC<Props> = ({ media }) => {
  const isVr = media?.vr?.length > 0
  const srcImg = !isVr ? `${baseImgUrl}${media?.id}` : `${media?.vr[0]}`
  return (
    <View>
      <Pressable
        style={{ gap: SPACE }}
        onPress={() =>
          router.navigate({
            pathname: '/[mediaId]',
            params: { mediaId: media.id },
          })
        }
      >
        <View style={{ width: '100%', aspectRatio: 3 / 2 }}>
          <ImagePlay srcImg={srcImg} sizeIcon={SPACE * 4} />
        </View>
        <View style={{ width: '100%' }}>
          <ContentText title={media?.title} overview={media?.overview} />
        </View>
      </Pressable>
    </View>
  )
}

export default memo(
  ItemMain,
  (prevProps, nextProps) => prevProps?.media?.id === nextProps?.media?.id
)
