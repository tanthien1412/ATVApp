import React, { FC, memo } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

const CircularLoading: FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00ff00" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'honeydew',
  },
  indicator: {
    position: 'absolute',
  },
})

export default memo(CircularLoading)
