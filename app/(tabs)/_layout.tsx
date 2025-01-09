import { useWindowDimensions } from 'react-native'
import { Tabs } from 'expo-router'
import { useTranslation } from 'react-i18next'
import TabBar from '@/src/components/navigation/TabBar'

const TabLayout = () => {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()

  return (
    <Tabs
      screenOptions={{
        tabBarPosition: width < 600 ? 'bottom' : 'left',
        tabBarLabelPosition: 'below-icon',
        tabBarShowLabel: false,
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => <TabBar {...props} />}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home_short'),
        }}
      />
      <Tabs.Screen
        name="article"
        options={{
          title: t('article_short'),
        }}
      />
      <Tabs.Screen
        name="livestream"
        options={{
          title: t('livestream_short'),
        }}
      />
      <Tabs.Screen
        name="local"
        options={{
          title: t('local_short'),
        }}
      />
      <Tabs.Screen
        name="vr360"
        options={{
          title: t('vr360_short'),
        }}
      />
    </Tabs>
  )
}

export default TabLayout
