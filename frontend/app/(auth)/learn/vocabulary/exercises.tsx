import { Platform, Text, StyleSheet, Dimensions, ScrollView, View, StatusBar as RNStatusBar } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from "expo-router";
import HeaderProgressTracker from "@/components/learn/HeaderProgressTracker";
import { StatusBar } from "expo-status-bar";
import { useVocabExType2List, useVocabExType3List } from '@/src/api/level/index';
import BackButton from "@/components/BackButton";
import ExVocabType2 from '@/components/exercise/VocabType2/VocabType2';
import ExVocabType3 from '@/components/exercise/VocabType3/VocabType3';

const { width } = Dimensions.get('screen');

const topicID = 1;

const VocabExercises = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { data: vocabType2Exercises = [], isLoading: loadingType2, error: errorType2 } = useVocabExType2List(topicID);
  const { data: vocabType3Exercises = [], isLoading: loadingType3, error: errorType3 } = useVocabExType3List(topicID);

  const exerciseLength = vocabType2Exercises.length + vocabType3Exercises.length;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <BackButton />
          <HeaderProgressTracker current={currentIndex + 1} all={exerciseLength} />
          <View style={styles.headerFillerContainer} />
        </View>
      ),
    });
  }, [navigation, currentIndex, exerciseLength]);

  if (loadingType2 || loadingType3) {
    return <Text>Loading...</Text>;
  }

  if (errorType2 || errorType3) {
    return <Text>Failed to load exercises</Text>;
  }

  const goToNextExercise = () => {
    if (currentIndex < exerciseLength - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    }
  };


  return (
    
    <>
      <StatusBar style="dark" backgroundColor="white" />
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          onScroll={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            if (newIndex !== currentIndex) {
              setCurrentIndex(newIndex);
            }
          }}
          scrollEventThrottle={32}
          showsHorizontalScrollIndicator={false}
        >
          {vocabType2Exercises.map((exercise, index) => (
            <View style={{ width }} key={`type2-${index}`}>
              <ExVocabType2
                key={index}
                onNext={goToNextExercise}
                question={exercise.question}
                correctAnswerIndex={exercise.correctAnswerIndex-1}
                answers={exercise.answers}
              />
            </View>
          ))}
          {vocabType3Exercises.map((exercise, index) => (
            <View style={{ width }} key={`type3-${index}`}>
              <ExVocabType3
                key={index}
                onNext={goToNextExercise}
                question={exercise.question}
                synonyms={exercise.synonyms}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
};


const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 20 : 0,
    paddingVertical: 12,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  headerFillerContainer: {
    height: 42,
    width: 42,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default VocabExercises;