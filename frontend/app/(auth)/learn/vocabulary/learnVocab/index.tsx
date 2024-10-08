import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from "expo-router";
import BackButton from "@/components/BackButton";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Platform, View, Text, StyleSheet, Dimensions, StatusBar as RNStatusBar } from 'react-native';
import Flashcard from '@/components/learnVocab/flashcard';
import RewriteVocab from '@/components/learnVocab/rewriteVocab';
import { useVocabList } from '@/src/api/level/index';
import ProgressTracker from '@/components/ProgressTracker';

const topicID = 1;
const { width, height } = Dimensions.get('screen');

const LearnVocab = () => {
  const navigation = useNavigation();
  const { data: vocabs = [], isLoading: loading, error: error } = useVocabList(topicID);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [incorrectVocabs, setIncorrectVocabs] = useState<any[]>([]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View style={styles.headerContainer}>
          <BackButton />
          <ProgressTracker current={currentIndex} all={Math.max(vocabs.length*2 + incorrectVocabs.length - 1, 1)} />

          <View style={styles.headerFillerContainer} />
        </View>
      ),
    });
  }, [navigation, currentIndex, incorrectVocabs.length]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Sorry! Failed to load Vocabulary</Text>;
  }

  const goToNextVocab = () => {
    if (currentIndex < vocabs.length*2 + incorrectVocabs.length - 1) {
      const nextIndex = currentIndex + 1;
      //setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    }
  };

  const handleIncorrectAnswer = (vocab: any) => {
    setIncorrectVocabs(prev => [...prev, vocab]);
  };

  return (
    <>
      <StatusBar style="dark" backgroundColor='#f5f5f5' />
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          onScroll={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            if (newIndex !== currentIndex) {
              setCurrentIndex(newIndex);
            }
          }}
          scrollEventThrottle={32}
          showsHorizontalScrollIndicator={false}
          scrollEnabled = {false}
          pagingEnabled
        >
          {vocabs.map((vocab, index) => (
            <View key={index} style={{ flexDirection: 'row' }}>
              <Flashcard 
                word={vocab.word} 
                ipa={vocab.ipa} 
                type={vocab.type} 
                definition={vocab.definition} 
                example={vocab.example}
                onNext={goToNextVocab}
              />
              <RewriteVocab 
                word={vocab.word} 
                ipa={vocab.ipa} 
                type={vocab.type} 
                definition={vocab.definition} 
                example={vocab.example} 
                onNext={goToNextVocab}
                onIncorrectAnswer={() => handleIncorrectAnswer(vocab)}
              />
            </View>
          ))}
          {/* Render các từ vựng sai */}
          {incorrectVocabs.map((vocab, index) => (
            <View key={`incorrect-${index}`} style={{ flexDirection: 'row' }}>
              <RewriteVocab 
                word={vocab.word} 
                ipa={vocab.ipa} 
                type={vocab.type} 
                definition={vocab.definition} 
                example={vocab.example} 
                onNext={goToNextVocab}
                onIncorrectAnswer={() => handleIncorrectAnswer(vocab)}
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
    paddingVertical: height * 0.01477,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: width * 0.0533,
  },
  headerFillerContainer: {
    height: height * 0.05,
    width: height * 0.05,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default LearnVocab;
