import {Platform, StyleSheet, Text, View, StatusBar as RNStatusBar} from 'react-native'
import React, {useEffect, useState} from 'react'
import {useNavigation} from "expo-router";
import HeaderProgressTracker from "@/components/learn/HeaderProgressTracker";
import {StatusBar} from "expo-status-bar";
import BackButton from "@/components/BackButton";
import ExType5 from '@/components/exercise/type5/type5';

const Type1 = () => {
  const navigation = useNavigation();
  
  useEffect(() => {
    navigation.setOptions({
      headerShown: true, header: () => (
        <View style={styles.headerContainer}>
          <BackButton/>
          <HeaderProgressTracker current={1} all={4}/>
          <View style={styles.headerFillerContainer} />
        </View>
      )
    })
  }, [navigation]);

  return (
    <>
      <StatusBar style='dark' backgroundColor='white'/>
      <View style={styles.container}>
        <ExType5/>
      </View>
    </>

  )
}

export default Type1

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 20) : 0,
    paddingVertical: 12,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerFillerContainer: {
    height: 42,
    width: 42,
    backgroundColor: 'white',
  },
})
