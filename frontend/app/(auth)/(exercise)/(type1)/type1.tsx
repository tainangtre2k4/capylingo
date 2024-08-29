import React, { useState } from 'react';
import { View, TextInput, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import CheckAnswerButton from '../components/checkAnswerButton';
import QuestionText from '../components/questionText';
import ResultBox from '../components/resultBox';
import { sharedStyles } from '../styles/sharedStyles';
import ResultContent from './resultContent';

const type1 = () => {

  const question = "What is the capital of France?";
  const correctAnswer = "Paris";
  
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  
  const checkAnswer = () => {
    if (userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      setResult('correct');
    } else {
      setResult('incorrect');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
      <View style={sharedStyles.container}>
        <QuestionText question={question} />
        <TextInput
          style={sharedStyles.input}
          placeholder="Enter your answer"
          onChangeText={text => setUserAnswer(text)}
          value={userAnswer}
          multiline={true}
          textAlignVertical="top"
          editable={!result}
        />

        <ResultBox result={result} content={<ResultContent result={result} answer={correctAnswer} />} />

        <CheckAnswerButton onPress={checkAnswer} result={result} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default type1;
