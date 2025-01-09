import { FC, memo } from 'react'
import { Text, View } from 'react-native'
import useThemeApp from '@/src/common/hooks/useThemeApp'

type Props = {
  title: string
}

const Heading: FC<Props> = ({ title }) => {
  const theme = useThemeApp()
  return (
    <View
      style={{
        width: '100%',
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
      }}
    >
      <Text
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: '#fff',
          textTransform: 'capitalize',
        }}
      >
        {title}
      </Text>
    </View>
  )
}

export default memo(Heading)
