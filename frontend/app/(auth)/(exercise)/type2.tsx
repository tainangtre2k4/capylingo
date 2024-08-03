import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight;

const words = ['What’s', 'Your', 'Name', '?', 'I', 'Am', 'Ujang'];
const correctAnswer = ['I', 'Am', 'Ujang', 'What’s', 'Your', 'Name', '?'];

const RearrangeWordsScreen = () => {
  const [selectedWords, setSelectedWords] = useState<string[]>(Array(correctAnswer.length).fill(''));
  const [availableWords, setAvailableWords] = useState<string[]>(words);
  const [message, setMessage] = useState('');

  const handleWordPress = (word: string) => {
    // Tìm vị trí trống đầu tiên trong selectedWords
    const emptyIndex = selectedWords.findIndex(w => w === '');

    // Nếu có vị trí trống thì thêm từ vào
    if (emptyIndex !== -1) {
      const newSelectedWords = [...selectedWords];
      newSelectedWords[emptyIndex] = word;
      setSelectedWords(newSelectedWords);
      setAvailableWords(availableWords.filter(w => w !== word));
    }
  };

  const handleRemoveWord = (index: number) => {
    const word = selectedWords[index];
    if (word !== '') {
      const newSelectedWords = [...selectedWords];
      newSelectedWords[index] = '';
      setSelectedWords(newSelectedWords);
      setAvailableWords([...availableWords, word]);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedWords.join(' ') === correctAnswer.join(' ')) {
      setMessage('Correct!');
    } else {
      setMessage('Incorrect!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>Rearrange the words below to form a meaningful sentence!</Text>
      <View style={styles.sentenceContainer}>
        {selectedWords.map((word, index) => (
          <TouchableOpacity key={index} onPress={() => handleRemoveWord(index)} style={styles.selectedWordButton}>
            <Text style={styles.selectedWordText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.wordsContainer}>
        {availableWords.map((word, index) => (
          <TouchableOpacity
            key={index}
            style={styles.wordButton}
            onPress={() => handleWordPress(word)}
          >
            <Text style={styles.wordButtonText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleCheckAnswer} style={styles.checkButton}>
          <Text style={styles.checkButtonText}>Check Answer</Text>
        </TouchableOpacity>
      </View>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  question: {
    marginTop: height * 0.08,
    fontSize: width * 0.067,
    textAlign: 'center',
  },
  sentenceContainer: {
    marginTop: height * 0.05,
    marginHorizontal: width * 0.0426,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  selectedWordButton: {
    backgroundColor: '#f0f0f0', // Màu nền cho khung từ đã chọn
    borderBottomWidth: width*0.00267,
    borderColor: '#898A8D',
    marginVertical: width*0.0213,
    marginHorizontal: width*0.04,
    minWidth: width * 0.1866,
    height: height*0.04,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedWordText: {
    fontSize: width * 0.053,
    color: '#0074CE',
    fontWeight: '500',
  },
  wordsContainer: {
    //marginHorizontal: width * 0.03,
    marginTop: height * 0.07,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wordButton: {
    backgroundColor: '#3DB2FF',
    borderRadius: width * 0.0267,
    padding: width*0.0266,
    margin: width*0.0266,
    minWidth: width * 0.15,

    // Thuộc tính đổ bóng cho iOS
    shadowColor: '#000', // Màu đổ bóng đen
    shadowOffset: {
      width: 2.5, // Độ lệch ngang
      height: 5, // Độ lệch dọc
    },
    shadowOpacity: 0.2, // Độ mờ đổ bóng (20%)
    shadowRadius: 1, // Độ mờ của đổ bóng (blur)

    // Thuộc tính đổ bóng cho Android
    elevation: 5,
  },

  // CHECK ANSWER BUTTON
  wordButtonText: {
    fontSize: width*0.042,
    color: "#FFF",
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 100,
  },
  checkButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: 'green',
    marginTop: 10,
  },
});

export default RearrangeWordsScreen;
