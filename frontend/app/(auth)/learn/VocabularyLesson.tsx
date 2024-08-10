import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const VocabularyLesson = () => {
  return (
    <View style={styles.container}>
      <Link href='/learn/vocabulary/Type1'>type 1</Link>
    </View>
  )
}

export default VocabularyLesson

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})
