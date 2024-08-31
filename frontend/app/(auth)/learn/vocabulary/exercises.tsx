import {Platform, StyleSheet, Text, View, StatusBar as RNStatusBar} from 'react-native'
import React, {useEffect, useState} from 'react'
import {useNavigation} from "expo-router";
import HeaderProgressTracker from "@/components/learn/HeaderProgressTracker";
import {StatusBar} from "expo-status-bar";
import BackButton from "@/components/BackButton";
import ExType1 from '@/components/exercise/type1/type1';
import ExType2 from '@/components/exercise/type2/type2';
import ExType3 from '@/components/exercise/type3/type3';
import ExType4 from '@/components/exercise/type4/type4';
import ExType5 from '@/components/exercise/type5/type5';

const exerciseSequence = [3, 1, 1, 2, 3, 5, 2]; // Mảng bài tập sẽ lấy từ DB

const VocabExercises = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextExercise = () => {
    if (currentIndex < exerciseSequence.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const renderExercise = () => {
    const currentExercise = exerciseSequence[currentIndex];
    switch (currentExercise) {
      case 1:
        return <ExType1 key={currentIndex} onNext={goToNextExercise} />;
      case 2:
        return <ExType2 key={currentIndex} onNext={goToNextExercise} />;
      case 3:
        return <ExType3 key={currentIndex} onNext={goToNextExercise} />;
      case 4:
        return <ExType4 key={currentIndex} onNext={goToNextExercise} />;
      case 5:
        return <ExType5 key={currentIndex} onNext={goToNextExercise} />;
      default:
        return null;
    }
  };
  
  useEffect(() => {
    navigation.setOptions({
      headerShown: true, header: () => (
        <View style={styles.headerContainer}>
          <BackButton/>
          <HeaderProgressTracker current={currentIndex+1} all={exerciseSequence.length}/>
          <View style={styles.headerFillerContainer} />
        </View>
      )
    })
  }, [navigation, currentIndex]);

  return (
    <>
      <StatusBar style='dark' backgroundColor='white'/>
      <View style={styles.container}>
        {renderExercise()}
      </View>
    </>

  )
}

export default VocabExercises

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
