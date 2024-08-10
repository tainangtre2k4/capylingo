import React from 'react';
import { Text, StyleSheet, View, Dimensions } from 'react-native';
import { sharedStyles } from '../styles/sharedStyles';

const { width, height } = Dimensions.get('window');

interface ResultContentProps {
  result: 'correct' | 'incorrect' | null;
  answer: string;
}

const ResultContent: React.FC<ResultContentProps> = ({ result, answer }) => {
  if (!result) return null;

  return (
        <View style={sharedStyles.answerBox}>
            <Text style={[
                sharedStyles.resultTitle,
                result === 'correct' ? sharedStyles.correctColor : sharedStyles.incorrectColor,
                {marginLeft: 0.042*width}
            ]}>
                {result === 'correct' ? 'That’s right!' : 'Ups.. That’s not quite right'}
            </Text>
        
            <Text style={[sharedStyles.answerText , result === 'correct' ? sharedStyles.correctColor : sharedStyles.incorrectColor, {marginLeft: 0.042*width}]}>
                    Answer:
            </Text>
            <Text style={[
                sharedStyles.answerText,
                result === 'correct' ? sharedStyles.correctColor : sharedStyles.incorrectColor,
                {textAlign: 'center', fontWeight: '500'}
            ]}>
                    {answer}
            </Text>
        </View>

  );
};

const styles = StyleSheet.create({
  correctText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  incorrectText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ResultContent;
