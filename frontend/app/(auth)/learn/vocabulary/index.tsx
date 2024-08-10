import {View, Text, StyleSheet, StatusBar as RNStatusBar, Dimensions} from 'react-native'
import React, {useEffect} from 'react'
import {Link, useNavigation} from 'expo-router'
import BackButton from "@/components/BackButton";

const {width, height} = Dimensions.get('window')

const VocabularyLesson = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <View style={styles.header}>
          <BackButton/>
          <Text style={styles.title}>Vocabulary</Text>
        </View>
      ),
      headerTitleStyle: {
        color: 'white'
      },
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Link href='/learn/vocabulary/type1'>type 1</Link>
    </View>
  )
}

export default VocabularyLesson

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    paddingTop: RNStatusBar.currentHeight,
    paddingHorizontal: width * .053,
    height: (RNStatusBar.currentHeight || height * .042) + height * .1,
    backgroundColor: '#3DB2FF',
    alignItems: 'center',
    flexDirection: 'row'
  },
  title: {
    marginHorizontal: width * .03,
    color: 'white',
    fontSize: 24,
    fontWeight: '500'
  }
})
