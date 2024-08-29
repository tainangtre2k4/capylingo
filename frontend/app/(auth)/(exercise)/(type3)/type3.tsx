import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CheckAnswerButton from '../components/checkAnswerButton';
import QuestionText from '../components/questionText';
import ResultBox from '../components/resultBox';
import { sharedStyles, correctColor, incorrectAnswerColor } from '../styles/sharedStyles';
import ResultContent from './resultContent';

const type3 = () => {

  const question = "Our vicar is always ……………money for for one cause or another.";
  const correctAnswerIndex = 0;
  const answers = [
    'lifting',
    'gathering',
    'raising',
    'asking',
  ];

  
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const checkAnswer = () => {
    if (userAnswer === correctAnswerIndex) {
        setResult('correct');
      } else {
        setResult('incorrect');
      }
      setTimeout(() => {
        setShowCorrectAnswer(true);
      }, 700);
  };

  return (
    <View style={sharedStyles.container}>
        <QuestionText question={'Answer the following question'} />
        <Text style={sharedStyles.smallQuestionText}> {question} </Text>


        {answers.map((answer, index) => {
        // Xác định màu nền của từng đáp án
        let backgroundColor = sharedStyles.MCBoxAnswer.backgroundColor;
        // Nếu người dùng chọn, đổi màu thành '#0077CC'
        if (userAnswer === index && result === null) {
          backgroundColor = '#0077CC'; // Màu khi đang chọn trước khi check answer
        } else if (result === 'correct' && userAnswer === index) {
          backgroundColor = correctColor; // Màu xanh lá khi đúng
        } else if (result === 'incorrect' && userAnswer === index) {
          backgroundColor = incorrectAnswerColor; // Màu đỏ khi sai
        } else if (showCorrectAnswer && index === correctAnswerIndex) {
          backgroundColor = correctColor; // Màu xanh lá cho đáp án đúng sau 1 giây
        }
        return (
          <TouchableOpacity
            key={index}
            style={[sharedStyles.MCBoxAnswer, { backgroundColor }]}
            onPress={() => setUserAnswer(index)}
            activeOpacity={0.75}
            disabled={result !== null} // Khóa các nút sau khi đã chọn đáp án
          >
            <Text style={sharedStyles.textCheckAnswerButton}>{answer}</Text>
          </TouchableOpacity>
        );
      })}

        <ResultBox result={result} content={<ResultContent result={result} />} />

        <CheckAnswerButton onPress={checkAnswer} result={result} />
      </View>
  );
};

export default type3;
