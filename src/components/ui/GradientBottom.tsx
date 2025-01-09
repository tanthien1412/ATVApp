import { FC, memo } from 'react'
import { LinearGradient } from 'expo-linear-gradient'

type Props = {
  start: string
  end: string
}

const GradientBottom: FC<Props> = ({ start, end }) => {
  return (
    <LinearGradient
      colors={[start, end]}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
      }}
    />
  )
}

export default memo(GradientBottom)
