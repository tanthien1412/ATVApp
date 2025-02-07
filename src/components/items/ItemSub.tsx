import { FC, memo } from 'react'
import { View, Pressable } from 'react-native'
import { router } from 'expo-router'

import { Media } from '@/src/types/media'
import { SPACE } from '@/src/common/constants/constants'
import ImagePlay from '../media/ImagePlay'
import ContentText from '../media/ContentText'

type Props = {
  media: Media
}

const ItemSub: FC<Props> = ({ media }) => {
  const srcImg = media?.thumbnail
    ? media?.thumbnail
    : require('@/assets/images/no_image.png')

  return (
    <View>
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: SPACE,
        }}
        onPress={() =>
          router.navigate({
            pathname: '/[mediaId]',
            params: { mediaId: media._id },
          })
        }
      >
        <View style={{ width: '50%', aspectRatio: 4 / 3 }}>
          <ImagePlay srcImg={srcImg} sizeIcon={SPACE * 3} />
        </View>
        <View style={{ width: '45%' }}>
          <ContentText title={media?.title} overview={media?.overview} />
        </View>
      </Pressable>
    </View>
  )
}

export default memo(
  ItemSub,
  (prevProps, nextProps) => prevProps?.media?._id === nextProps?.media?._id
)
