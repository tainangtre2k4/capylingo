import React from 'react'
import {SafeAreaView} from 'react-native'
import {Stack} from 'expo-router'

const VocabularyStack = () => {
  return (  
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <Stack screenOptions={{headerShown: false}}/>
    </SafeAreaView>  
  )
}

export default VocabularyStack
