import React from 'react'
import { Stack } from 'expo-router'
import HeaderProgressTracker from "@/components/learn/HeaderProgressTracker";
import {StatusBar} from 'expo-status-bar';

const VocabularyStack = () => {
  return (
    <>
      <StatusBar style='dark' backgroundColor='white' />
      <Stack screenOptions={{
        header: () => (<HeaderProgressTracker current={1} all={4} />)
      }}>
        <Stack.Screen name='Type1' />
        {/*<Stack.Screen name='Type2' />*/}
        {/*<Stack.Screen name='Type3' />*/}
      </Stack>
    </>
  )
}

export default VocabularyStack
