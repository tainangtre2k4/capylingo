import {StyleSheet, Text, View, StatusBar as RNStatusBar} from 'react-native'
import React, {useEffect} from 'react'
import {useNavigation} from "expo-router";
import HeaderProgressTracker from "@/components/learn/HeaderProgressTracker";
import {StatusBar} from "expo-status-bar";
import BackButton from "@/components/BackButton";

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
        <Text>Type 1</Text>
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
    marginTop: (RNStatusBar.currentHeight || 20),
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
