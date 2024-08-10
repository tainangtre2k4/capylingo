import {StatusBar, StyleSheet, Text, View} from 'react-native'
import React from 'react'

const Type1 = () => {
  return (
    <View style={styles.container}>
      <Text>Type 1</Text>
    </View>
  )
}

export default Type1

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  }
})
