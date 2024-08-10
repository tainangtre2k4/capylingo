import {View, Text, StyleSheet, StatusBar as RNStatusBar, ProgressBarAndroidBase} from 'react-native'
import React, {useEffect} from 'react'
import {Link, useNavigation} from 'expo-router'
import BackButton from "@/components/BackButton";
import HeaderProgressTracker from "@/components/learn/HeaderProgressTracker";

const ReadingArticle = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <>
          <View style={styles.backButtonContainer}>
            <BackButton/>
          </View>
          <HeaderProgressTracker current={1} all={3} />
        </>
      ),
      headerTitleStyle: {
        color: 'white'
      },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text selectable={true}>hello</Text>
    </View>
  )
}

export default ReadingArticle

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  backButtonContainer: {
    position: 'absolute',
    top: (RNStatusBar.currentHeight || 20) + 14,
    left: 20,
    zIndex: 1,
  },
})
