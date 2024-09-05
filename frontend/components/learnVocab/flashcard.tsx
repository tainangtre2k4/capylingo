import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('screen');
import NextButton from '@/components/learnVocab/nextButton';

interface FlashcardProps {
  word: string;
  ipa: string;
  type: string;
  definition: string;
  example: string;
  onNext: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ word, ipa, type, definition, example, onNext }) => {
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    if (flipped) {
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }).start(() => setFlipped(!flipped));
    } else {
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start(() => setFlipped(!flipped));
    }
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
    zIndex: flipped ? 0 : 1,  // Mặt trước chỉ có thể nhận sự kiện khi không bị lật
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
    zIndex: flipped ? 1 : 0,  // Mặt sau chỉ có thể nhận sự kiện khi đã lật
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={flipCard} activeOpacity={1}>
        <View>
          <Animated.View style={[styles.card, frontAnimatedStyle]}>
            <Text style={styles.word}>{word}</Text>
            <Text style={styles.ipa}>/{ipa}/</Text>
            <Text style={styles.type}>[{type}]</Text>
            <Text style={styles.definition}>{definition}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.iconCell}>
                <Ionicons name="volume-medium-outline" size={32} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCell}>
                <Ionicons name="star-outline" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
            <Image source={require('@/assets/images/learn/learnVocab/clickCapyLogo.png')} style={styles.clickLogo}/>
          </Animated.View>

          <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
            <Text style={styles.word}>{word}</Text>
            <Text style={styles.ipa}>/{ipa}/</Text>
            <Text style={styles.type}>Example:</Text>
            <Text style={styles.definition}>{example}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.iconCell}>
                <Ionicons name="volume-medium-outline" size={32} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCell}>
                <Ionicons name="star-outline" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
            <Image source={require('@/assets/images/learn/learnVocab/clickCapyLogo.png')} style={styles.clickLogo}/>
          </Animated.View>
        </View>
      </TouchableOpacity>
      <NextButton result={null} onNext={onNext}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    alignItems: 'center',
  },
  card: {
    width: width * 0.85,
    height: height * 0.58,
    marginTop: height * 0.007,
    paddingHorizontal: width * 0.06,
    backgroundColor: '#fff',
    borderRadius: width * 0.072,
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  cardBack: {
    position: 'absolute',
    top: 0,
  },
  word: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: height * 0.05,
    marginBottom: height * 0.01143,
  },
  ipa: {
    fontSize: 24,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: height * 0.02057,
  },
  type: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#4095F1',
    marginBottom: height * 0.02515,
  },
  definition: {
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'center',
    color: '#333',
    marginBottom: height * 0.013,
  },
  clickLogo: {
    width: width*0.22,
    position: 'absolute',
    bottom: -height*0.12,
    right: 0.058*width,
    resizeMode: 'contain',
    tintColor: '#0279D6',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width*0.38,
    marginTop: height*0.025,
  },
  iconCell: {
    width: width*0.14,
    height: width*0.14,
    borderRadius: width*0.07,
    backgroundColor: '#5DB2FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
});

export default Flashcard;
