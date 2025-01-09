import { FC, memo } from 'react'
import { Text, View } from 'react-native'
import useThemeApp from '@/src/common/hooks/useThemeApp'
import ButtonUI from '../ui/ButtonUI'

type Props = {
  title: string
  overview?: string
  date?: string
  view?: number
}

const ContentText: FC<Props> = ({ title, overview, date, view }) => {
  const theme = useThemeApp()
  return (
    <View style={{ flex: 1, justifyContent: 'center', gap: 5 }}>
      <Text
        numberOfLines={Boolean(overview) ? 2 : 2}
        ellipsizeMode="tail"
        style={{
          fontSize: 16,
          fontWeight: '700',
          color: theme.colors.text,
          textAlign: 'left',
          lineHeight: 20,
        }}
      >
        {title}
      </Text>
      {Boolean(overview) && (
        <Text
          numberOfLines={3}
          ellipsizeMode="tail"
          style={{
            fontSize: 14,
            fontWeight: '400',
            color: theme.colors.text,
            textAlign: 'left',
            letterSpacing: 0.5,
            lineHeight: 20,
          }}
        >
          {overview}
        </Text>
      )}
      {Boolean(date) && (
        <View style={{ alignSelf: 'flex-start' }}>
          <ButtonUI
            startIcon={true}
            title={date}
            icon="today"
            chilColor={theme.colors.primary}
            size="small"
            onPress={() => {}}
          />
          {Boolean(view) && (
            <View style={{ alignSelf: 'flex-start' }}>
              <ButtonUI
                startIcon={true}
                title={`${view}`}
                icon="visibility"
                chilColor={theme.colors.primary}
                size="small"
                onPress={() => {}}
              />
            </View>
          )}
        </View>
      )}
    </View>
  )
}

export default memo(ContentText)
