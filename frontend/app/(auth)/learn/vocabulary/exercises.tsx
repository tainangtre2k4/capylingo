import { Platform, StyleSheet, Dimensions, ScrollView, View, StatusBar as RNStatusBar } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from "expo-router";
import HeaderProgressTracker from "@/components/learn/HeaderProgressTracker";
import { StatusBar } from "expo-status-bar";
import { fetchVocabType2, fetchVocabType3, ExerciseType2, ExerciseType3} from '@/functions/processExData';
import BackButton from "@/components/BackButton";
import ExType1 from '@/components/exercise/type1/type1';
import ExType2 from '@/components/exercise/type2/type2';
import ExVocabType2 from '@/components/exercise/VocabType2/VocabType2';
import ExType4 from '@/components/exercise/type4/type4';
import ExVocabType3 from '@/components/exercise/VocabType3/VocabType3';
import VocabType2 from '@/components/exercise/VocabType2/VocabType2';

const { width } = Dimensions.get('screen');

const topicID = 1;
const exerciseSequence = [3, 1, 1, 2, 3, 5, 2]; // Mảng bài tập sẽ lấy từ DB

const VocabExercises = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null); // Tạo ref cho ScrollView
  const [vocabType2Exercises, setVocabType2Exercises] = useState<ExerciseType2[]>([]);
  const [vocabType3Exercises, setVocabType3Exercises] = useState<ExerciseType3[]>([]);
  const [exerciseLength, setExerciseLength] = useState(0);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const type2Exercises = await fetchVocabType2(topicID);
        const type3Exercises = await fetchVocabType3(topicID);

        setVocabType2Exercises(type2Exercises);
        setVocabType3Exercises(type3Exercises);
        setExerciseLength(type2Exercises.length + type3Exercises.length);
      } catch (error) {
        console.error('Failed to fetch exercises:', error);
      }
    };

    fetchExercises();
  }, [topicID]);

  const goToNextExercise = () => {
    if (currentIndex < exerciseLength - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true
      });
    }
  };

  const renderExerciseItem = (exercise: ExerciseType2 | ExerciseType3, index: number, type: 'type2' | 'type3') => {
    switch (type) {
      case 'type2':
        return (
          <ExVocabType2
            key={index}
            onNext={goToNextExercise}
            question={(exercise as ExerciseType2).question}
            correctAnswerIndex={(exercise as ExerciseType2).correctAnswerIndex}
            answers={(exercise as ExerciseType2).answers}
          />
        );
      case 'type3':
        return (
          <ExVocabType3
            key={index}
            onNext={goToNextExercise}
            question={(exercise as ExerciseType3).question}
            synonyms={(exercise as ExerciseType3).synonyms}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true, header: () => (
        <View style={styles.headerContainer}>
          <BackButton />
          <HeaderProgressTracker current={currentIndex + 1} all={exerciseLength} />
          <View style={styles.headerFillerContainer} />
        </View>
      )
    });
  }, [navigation, currentIndex, exerciseLength]);

  return (
    <>
      <StatusBar style='dark' backgroundColor='white' />
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef} // Gán ref cho ScrollView
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
          {/* {exerciseSequence.map((exercise, index) => (
            <View style={{ width }} key={index}>
              {renderExerciseItem(exercise, index)}
            </View>
          ))} */}
          {vocabType2Exercises.map((exercise, index) => (
            <View style={{ width }} key={`type2-${index}`}>
              {renderExerciseItem(exercise, index, 'type2')}
            </View>
          ))}
          {vocabType3Exercises.map((exercise, index) => (
            <View style={{ width }} key={`type3-${index}`}>
              {renderExerciseItem(exercise, index + vocabType2Exercises.length, 'type3')}
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

export default VocabExercises;

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
