import { FC, memo } from 'react'
import { View } from 'react-native'
import { SharedValue } from 'react-native-reanimated'
import DotTheme from '../ui/DotTheme'
import Dot from '../ui/Dot'

type Props = {
  data: any
  x: SharedValue<number>
  onPressPagination?: (index: number) => void
  dotTheme?: boolean
}

const PaginationDot: FC<Props> = ({ data, x, onPressPagination, dotTheme }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {data.map((_: any, index: number) => {
        return Boolean(dotTheme) ? (
          <DotTheme
            key={index}
            index={index}
            x={x}
            length={data.length}
            onPressPagination={onPressPagination}
          />
        ) : (
          <Dot key={index} index={index} x={x} />
        )
      })}
    </View>
  )
}

export default memo(PaginationDot)
