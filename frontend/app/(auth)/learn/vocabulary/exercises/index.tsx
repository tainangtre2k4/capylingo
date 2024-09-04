import { Platform, Text, StyleSheet, Dimensions, ScrollView, View, StatusBar as RNStatusBar } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from "expo-router";
import ProgressTracker from '@/components/ProgressTracker';
import { StatusBar } from "expo-status-bar";
import { useRouter } from 'expo-router';
import { useVocabExType1List, useVocabExType2List, useVocabExType3List } from '@/src/api/level/index';
import BackButton from "@/components/BackButton";
import ExVocabType1 from '@/components/exercise/VocabType1/VocabType1';
import ExVocabType2 from '@/components/exercise/VocabType2/VocabType2';
import ExVocabType3 from '@/components/exercise/VocabType3/VocabType3';


const { width } = Dimensions.get('screen');

const topicID = 1;

const VocabExercises = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numberCorrectAnswers, setNumberCorrectAnswers] = useState(0);
  const [numberIncorrectAnswers, setNumberIncorrectAnswers] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { data: vocabType1Exercises = [], isLoading: loadingType1, error: errorType1 } = useVocabExType1List(topicID);
  const { data: vocabType2Exercises = [], isLoading: loadingType2, error: errorType2 } = useVocabExType2List(topicID);
  const { data: vocabType3Exercises = [], isLoading: loadingType3, error: errorType3 } = useVocabExType3List(topicID);
  const router = useRouter();

  const exerciseLength = vocabType1Exercises.length + vocabType2Exercises.length + vocabType3Exercises.length;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <BackButton />
          <ProgressTracker current={currentIndex} all={Math.max(exerciseLength, 1)} />
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
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else{
      router.push({
        pathname: './exercises/resultScreen',
        params: {
          correctAnswers: numberCorrectAnswers,
          wrongAnswers: numberIncorrectAnswers,
          totalQuestions: exerciseLength,
        },
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
          {vocabType1Exercises.map((exercise, index) => (
            <View style={{ width }} key={`type1-${index}`}>
              <ExVocabType1
                key={index}
                onNext={goToNextExercise}
                questionImageUrl={exercise.questionImage}
                correctAnswerIndex={exercise.correctAnswerIndex-1}
                answers={exercise.answers}
                onCorrectAnswer={() => setNumberCorrectAnswers(prev => prev + 1)}
                onIncorrectAnswer={() => setNumberIncorrectAnswers(prev => prev + 1)}
              />
            </View>
          ))}

          {vocabType2Exercises.map((exercise, index) => (
            <View style={{ width }} key={`type2-${index}`}>
              <ExVocabType2
                key={index}
                onNext={goToNextExercise}
                question={exercise.question}
                correctAnswerIndex={exercise.correctAnswerIndex-1}
                answers={exercise.answers}
                onCorrectAnswer={() => setNumberCorrectAnswers(prev => prev + 1)}
                onIncorrectAnswer={() => setNumberIncorrectAnswers(prev => prev + 1)}
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
                onCorrectAnswer={() => setNumberCorrectAnswers(prev => prev + 1)}
                onIncorrectAnswer={() => setNumberIncorrectAnswers(prev => prev + 1)}
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