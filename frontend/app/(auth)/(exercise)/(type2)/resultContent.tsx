import React from 'react';
import { Text, StyleSheet, View, Dimensions } from 'react-native';
import { sharedStyles } from '../styles/sharedStyles';
import { Styles } from './styles'

const { width, height } = Dimensions.get('window');

interface ResultContentProps {
  result: 'correct' | 'incorrect' | null;
  answers: string[];
}

const ResultContent: React.FC<ResultContentProps> = ({ result, answers }) => {
  if (!result) return null;

  return (
    <View>
      <View style={[sharedStyles.answerBox]}>
        <Text
          style={[
            sharedStyles.resultTitle,
            result === 'correct' ? sharedStyles.correctColor : sharedStyles.incorrectColor,
            {marginLeft: 0.042*width}
          ]}
        >
          {result === 'correct' ? 'That’s right!' : 'Oops.. That’s not quite right'}
        </Text>

        <Text
          style={[
            sharedStyles.answerText,
            result === 'correct' ? sharedStyles.correctColor : sharedStyles.incorrectColor,
            {marginLeft: 0.042*width}
          ]}
        >
          Answer:
        </Text>

        <View style={Styles.sentenceContainer}>
          {answers.map((word, index) => (
            <View key={index} style={Styles.selectedWordButton}>
              <Text style={[Styles.selectedWordText, result === 'correct' ? sharedStyles.correctColor : sharedStyles.incorrectColor,]}>{word}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};


export default ResultContent;
