import React from 'react'
import { Stack } from 'expo-router'
import HeaderProgressTracker from "@/components/learn/HeaderProgressTracker";
import {StatusBar} from 'expo-status-bar';

const SkillcheckStack = () => {
  return <Stack screenOptions={{headerShown: false}} />
}

export default SkillcheckStack
