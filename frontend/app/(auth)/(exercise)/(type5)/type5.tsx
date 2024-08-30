import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, FlatList} from 'react-native';
import CheckAnswerButton from '../components/checkAnswerButton';
import QuestionText from '../components/questionText';
import ResultBox from '../components/resultBox';
import { correctColor, incorrectColor, sharedStyles } from '../styles/sharedStyles';
import ResultContent from './resultContent';

// Hàm đảo thứ tự ngẫu nhiên mảng
const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
};

const generateColors = (numColors: number) => {
    const colors = [];
    const hueStep = 360 / numColors; // Đảm bảo mỗi màu sẽ có sự khác biệt về hue
    
    for (let i = 0; i < numColors; i++) {
      const hue = i * hueStep; // Điều chỉnh độ hue để tạo sự khác biệt
      const color = `hsl(${hue}, 70%, 70%)`; // Bạn có thể điều chỉnh giá trị saturation và lightness
      colors.push(color);
    }
    
    return shuffleArray(colors);
  };

const type5 = () => {
  const question = 'Matching synonyms ';
  const synonyms = [
    ['Happy', 'Joyful'],
    ['Sad', 'Unhappy'],
    ['Fast', 'Quick'],
    ['Hello', 'Hi'],
    // ['Big', 'Large'],
    // ['Smart', 'Intelligent'],
    // ['Strong', 'Powerful'],
    // ['Easy', 'Simple'],
    // ['Begin', 'Start'],
    // ['Rich', 'Wealthy'],
    // ['Quiet', 'Silent'],
    // ['Brave', 'Courageous'],
   ];

  const [leftColumn, setLeftColumn] = useState<{ word: string, index: number }[]>([]);
  const [rightColumn, setRightColumn] = useState<{ word: string, index: number }[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[][]>([]);
  const [results, setResults] = useState<boolean[]>([]);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);

  const colors = useMemo(() => generateColors(synonyms.length), [synonyms.length]);
  //const colors = ['#3DB2FF', '#FFAFBD', '#85D4B5', '#4275DB', '#7AD47A', '#ff9800', '#4caf50', '#F08792'];
  

  // Randomize the order of the synonyms in the columns
  useEffect(() => {
    let shuffledSynonyms = [...synonyms].map((pair, index) => ({
      left: { word: pair[0], index },
      right: { word: pair[1], index },
    }));
  
    shuffledSynonyms = shuffleArray(shuffledSynonyms);
  
    const left = shuffledSynonyms.map(item => item.left);
    const right = shuffledSynonyms.map(item => item.right);
  
    const shuffledRight = shuffleArray(right);

    setLeftColumn(left);
    setRightColumn(shuffledRight);
  }, []);

  const handleMatch = () => {
    if (selectedLeft !== null && selectedRight !== null) {
      // Find the indices of the pairs to remove
      const leftIndex = selectedLeft;
      const rightIndex = selectedRight;

      const updatedMatchedPairs = matchedPairs.filter(([leftPairIndex, rightPairIndex]) => {
        return leftPairIndex !== leftIndex && rightPairIndex !== rightIndex;
      });

      // Add the new pair
      setMatchedPairs([...updatedMatchedPairs, [leftIndex, rightIndex]]);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const checkAnswer = () => {
    const results = matchedPairs.map(([leftIndex, rightIndex]) => {
        return leftColumn[leftIndex].index === rightColumn[rightIndex].index;
      });
    setResults(results);

    if (results.every(result => result === true)){
        setResult('correct');
    } else {
         setResult('incorrect');
      }
  };

  const handleButtonPress = () => {
    if (buttonTitle === "Check Answer") {
      checkAnswer();
    } else {
      handleMatch();
    }
  };
  
  const renderItem = (isRight: 0 | 1) => ({ item, index }: { item: { word: string, index: number }, index: number }) => {
    const isMatched = matchedPairs.some(pair => pair[isRight] === index);
    const isSelected = isRight === 0 ? selectedLeft === index : selectedRight === index;
    const handlePress = () => {
        if (isRight === 0) {
          setSelectedLeft(selectedLeft === index ? null : index);
        } else {
          setSelectedRight(selectedRight === index ? null : index);
        }
    };

    // Determine the background color based on the state

    let backgroundColor = '#A2B7CC'; //BDCEDF
    if (results.length){
        const matchIndex = matchedPairs.findIndex(pair => pair[isRight] === index);
        const isCorrect = results[matchIndex];
        backgroundColor = isCorrect ? correctColor : incorrectColor;
    }
    else{
        if (isSelected) {
        backgroundColor = '#a0c0ff'; // Color when selected
        } else if (isMatched) {
        // Determine the color for matched pairs
        const matchColor = matchedPairs.findIndex(pair => pair[isRight] === index);
        backgroundColor = colors[matchColor % colors.length];
        }
    }

    return (
      <TouchableOpacity
        style={[
          sharedStyles.MCBoxAnswerSmall,
          { backgroundColor }
        ]}
        onPress={handlePress}
        disabled={buttonTitle === "Next Question"}
      >
        <Text style={[sharedStyles.textCheckAnswerButton, {color: isMatched ? '#444444' : '#fff'}]}>{item.word}</Text>
      </TouchableOpacity>
    );
  };

    // Determine the title and background color of the TouchableOpacity
  const buttonTitle =  results.length ? "Next Question"
                       : matchedPairs.length !== synonyms.length ? "Match"
                       : (selectedLeft === null && selectedRight === null)
                       ? "Check Answer" : "Match"

  const buttonColor = buttonTitle === "Next Question"
                      ? (result === 'correct' ? correctColor : incorrectColor)
                      : buttonTitle === "Check Answer"
                      ? '#0693F1' // color for "Check Answer"
                      : (selectedLeft === null || selectedRight === null)
                      ? '#A2B7CC' // Gray
                      : '#a0c0ff'; // color for "Match

  return (
    <View style={[sharedStyles.container]}>
        <QuestionText question={question} />
        <View style={{flexDirection: 'row',
                      justifyContent: 'space-between',
                      height: '67%',
                      borderWidth: 2,
                      paddingTop: 24,
                      paddingBottom: 18,
                      borderRadius: 25,
                      borderColor: '#CDCDCD'}}>
            <FlatList
                data={leftColumn}
                renderItem={renderItem(0)}
                keyExtractor={(item) => item.index.toString()}
                contentContainerStyle={{alignItems: 'center'}}             
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            />

            <FlatList
                data={rightColumn}
                renderItem={renderItem(1)}
                keyExtractor={(item) => item.index.toString()}
                contentContainerStyle={{alignItems: 'center'}}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
        
        <ResultBox result={result} content={<ResultContent result={result} />} />

        <TouchableOpacity
            style={[sharedStyles.checkAnswerButton, { backgroundColor: buttonColor }]}
            onPress={handleButtonPress}
            disabled={selectedLeft === null && selectedRight === null && buttonTitle === "Match"}
        >
            <Text style={sharedStyles.textCheckAnswerButton}>{buttonTitle}</Text>
        </TouchableOpacity>

    </View>
  );
};


const styles = StyleSheet.create({
    matched: {
        backgroundColor: '#a0ffa0',
      },
      selected: {
        backgroundColor: '#a0c0ff',
      },

  });
export default type5;
