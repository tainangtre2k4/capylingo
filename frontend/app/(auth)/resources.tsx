import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Resources = () => {
  return (
    <View style={styles.container}>
      <Text>Resources</Text>
    </View>
  )
}

export default Resources

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
