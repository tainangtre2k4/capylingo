import React from 'react'
import { SafeAreaView } from 'react-native'
import { Stack } from 'expo-router'
import HeaderProgressTracker from "@/components/learn/HeaderProgressTracker";
import {StatusBar} from 'expo-status-bar';

const ExercisesStack = () => {
  return (  
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <Stack screenOptions={{ headerShown: false }}/>
    </SafeAreaView>  
  )
}

export default ExercisesStack
