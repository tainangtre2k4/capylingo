import { View, Text, TouchableOpacity, StyleSheet, StatusBar as RNStatusBar } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';
import BackButton from "@/components/BackButton";

const LearnStack = () => {
  const router = useRouter();
  return (
    <Stack initialRouteName='index' screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='VocabularyLesson' options={{
        headerShown: true,
        title: 'Vocabulary',
        header: () => (
          <View style={styles.header}>
            <BackButton/>
            <Text style={styles.title}>Vocabulary</Text>
          </View>
        ),
        headerStyle: {
        },
        headerTitleStyle: {
          color: 'white'
        },
      }} />
      <Stack.Screen name='GrammarLesson' />
    </Stack>
  )
}

export default LearnStack

const styles = StyleSheet.create({
  header: {
    paddingTop: RNStatusBar.currentHeight,
    paddingHorizontal: 20,
    height: (RNStatusBar.currentHeight || 20) + 70,
    backgroundColor: '#3DB2FF',
    alignItems: 'center',
    flexDirection: 'row'
  },
  title: {
    marginHorizontal: 10,
    color: 'white',
    fontSize: 24,
    fontWeight: '500'
  }
})
