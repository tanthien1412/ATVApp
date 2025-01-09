import { FC, memo } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Image } from 'expo-image'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

import useThemeApp from '@/src/common/hooks/useThemeApp'
import { opacityToHex } from '@/src/common/utils/utils'
import { blurhash, SPACE } from '@/src/common/constants/constants'
import GradientBottom from '../ui/GradientBottom'

type Props = {
  srcImg: any
  sizeIcon: number
  titleBottom?: string
  overviewBottom?: string
}

const ImagePlay: FC<Props> = ({
  srcImg,
  sizeIcon,
  titleBottom,
  overviewBottom,
}) => {
  const theme = useThemeApp()
  return (
    <View>
      <Image
        source={srcImg}
        placeholder={{ blurhash }}
        contentFit="fill"
        style={styles.container}
      />
      <View
        style={[
          styles.btnIcon,
          {
            width: (sizeIcon * 4) / 3,
            height: (sizeIcon * 4) / 3,
            backgroundColor: `${theme.colors.primary + opacityToHex(0.7)}`,
          },
        ]}
      >
        <MaterialIcons
          name="play-arrow"
          style={{
            fontSize: sizeIcon,
            color: theme.colors.tertiary,
          }}
        />
      </View>
      {Boolean(titleBottom) && Boolean(overviewBottom) && (
        <View style={styles.bottom}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            {titleBottom}
          </Text>
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.overview}>
            {overviewBottom}
          </Text>
          <GradientBottom
            start={`${theme.colors.primary + opacityToHex(0.1)}`}
            end={`${theme.colors.primary + opacityToHex(0.3)}`}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: (SPACE * 2) / 3,
    overflow: 'hidden',
  },
  btnIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    position: 'absolute',
    bottom: SPACE / 3,
    left: SPACE / 3,
    right: SPACE / 3,
    gap: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 25,
    textAlign: 'left',
  },
  overview: {
    fontSize: 14,
    fontWeight: '400',
    color: '#fff',
    lineHeight: 20,
    textAlign: 'left',
  },
})

export default memo(ImagePlay)
