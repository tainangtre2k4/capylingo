import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { sharedStyles } from '../styles/sharedStyles';

interface CheckAnswerButtonProps {
  onPress: () => void;
  result: 'correct' | 'incorrect' | null; // null nếu chưa có kết quả
}

const CheckAnswerButton: React.FC<CheckAnswerButtonProps> = ({ onPress, result }) => {
  const getBackgroundColor = () => {
    if (result === 'correct') return '#99CC29';
    if (result === 'incorrect') return '#FF4B4C';
    return '#007bff'; // Màu mặc định
  };

  return (
    <TouchableOpacity style={[sharedStyles.checkAnswerButton, { backgroundColor: getBackgroundColor() }]} onPress={onPress}>
        <Text style={sharedStyles.textCheckAnswerButton}>
          {result ? 'Next Question' : 'Check Answer'}
        </Text>
    </TouchableOpacity>
  );
};

export default CheckAnswerButton;
