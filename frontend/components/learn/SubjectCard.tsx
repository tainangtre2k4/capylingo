import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import VocabularyLesson from '@/app/(auth)/learn/VocabularyLesson';

// Define the allowed types
type SubjectType = 'vocabulary' | 'grammar' | 'skillcheck';

// Define an object to map types to their corresponding illustrations
const illustrationMap: Record<SubjectType, ImageSourcePropType> = {
  vocabulary: require('../../assets/images/learn/vocabulary-illustration.png'),
  grammar: require('../../assets/images/learn/grammar-illustration.png'),
  skillcheck: require('../../assets/images/learn/skillcheck-illustration.png'),
};

const link = {
  vocabulary: 'vocabularyLesson',
  grammar: 'grammarLesson',
  skillcheck: 'skillcheckLesson'
}

interface SubjectCardProps {
  type: SubjectType;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ type }) => {
  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
  const router = useRouter();

  const pressHandler = () => {
    switch (type) {
      case 'vocabulary':
        router.push('/(auth)/learn/VocabularyLesson');
        break;
      case 'grammar':
        router.push('/(auth)/learn/GrammarLesson');
        break;
      case 'skillcheck':
        router.push('/(auth)/learn/SkillcheckLesson');
    }
  }

  return (
    <TouchableOpacity onPress={pressHandler}>
      <View style={styles.container}>
        <Image source={illustrationMap[type]} style={styles.subjectIllustration} />
        <View style={styles.progressContainer}>
          <Text style={styles.label}>{capitalizedType}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SubjectCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 2,
    borderColor: '#CDCDCD',
    borderRadius: 16,
    alignItems: 'center',
  },
  subjectIllustration: {
    width: 60,
    height: 60,
  },
  progressContainer: {
    flex: 1,
  },
  label: {
    fontSize: 24,
    fontWeight: '500',
    marginLeft: 10
  }
});
