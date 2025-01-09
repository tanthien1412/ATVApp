import { FC, memo } from 'react'
import { View, Pressable } from 'react-native'
import { router } from 'expo-router'
import { format } from 'date-fns'

import { Media } from '@/src/types/media'
import { baseImgUrl } from '@/src/common/config/config'
import { SPACE } from '@/src/common/constants/constants'
import ImagePlay from '../media/ImagePlay'
import ContentText from '../media/ContentText'

type Props = {
  media: Media
}

const ItemOnly: FC<Props> = ({ media }) => {
  const isVr = media?.vr?.length > 0
  const srcImg = !isVr ? `${baseImgUrl}${media?.id}` : `${media?.vr[0]}`

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
            params: { mediaId: media.id },
          })
        }
      >
        <View style={{ width: '50%', aspectRatio: 4 / 3 }}>
          <ImagePlay srcImg={srcImg} sizeIcon={SPACE * 3} />
        </View>
        <View style={{ width: '45%' }}>
          <ContentText
            title={media?.title}
            date={format(media?.release_date, 'dd-MM-yyyy')}
            view={media?.view_count}
          />
        </View>
      </Pressable>
    </View>
  )
}

export default memo(
  ItemOnly,
  (prevProps, nextProps) => prevProps?.media?.id === nextProps?.media?.id
)