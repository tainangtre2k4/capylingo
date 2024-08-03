import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';

const { width, height } = Dimensions.get('window');

const type1 = () => {

    const question = "What is the capital of France?";
    const correctAnswer = "Paris";
  
    const [userAnswer, setUserAnswer] = useState('');
  

    const checkAnswer = () => {
      if (userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
        Alert.alert("Correct!", "You answered correctly.");
      } else {
        Alert.alert("Incorrect", "Please try again.");
      }
    };
  
    return (
      <TouchableWithoutFeedback onPress={()=> {Keyboard.dismiss()}}>
      <View style={styles.container}>
        <Text style={styles.question}>{question}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your answer"
          onChangeText={text => setUserAnswer(text)}
          value={userAnswer}
          multiline={true}
          textAlignVertical="top"

        />
        <Button title="Check Answer" onPress={checkAnswer} />
      </View>
      </TouchableWithoutFeedback>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.05,
        alignItems: 'center',
      },
      question: {
        marginTop: width*0.248,
        fontSize: width * 0.06,
        textAlign: 'center',
        marginBottom: height * 0.05,
      },
      input: {
        height: height * 0.23,
        borderColor: '#C5BFBF',
        borderWidth: 1,
        marginBottom: height * 0.05,
        width: width*0.8,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: width*0.048,
        fontSize: width * 0.045,
      },
  });

export default type1;