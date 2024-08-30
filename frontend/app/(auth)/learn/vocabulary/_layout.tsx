import React from 'react'
import { SafeAreaView } from 'react-native'
import { Stack } from 'expo-router'
import HeaderProgressTracker from "@/components/learn/HeaderProgressTracker";
import {StatusBar} from 'expo-status-bar';

const VocabularyStack = () => {
  return (  
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <Stack />
    </SafeAreaView>  
  )
}

export default VocabularyStack
