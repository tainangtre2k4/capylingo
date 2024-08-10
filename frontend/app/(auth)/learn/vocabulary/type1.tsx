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
        <>
          <View style={styles.backButtonContainer}>
            <BackButton/>
          </View>
          <HeaderProgressTracker current={1} all={4}/>
        </>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backButtonContainer: {
    position: 'absolute',
    top: (RNStatusBar.currentHeight || 20) + 14,
    left: 20,
    zIndex: 1,
  },
})
