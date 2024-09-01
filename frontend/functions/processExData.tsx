import { useVocabExList } from '@/src/api/level/index';

export interface ExerciseType2 {
  question: string;
  correctAnswerIndex: number;
  answers: string[];
}
export interface ExerciseType3 {
    question: string;
    synonyms: string[][];
  }

export const fetchVocabType2 = async (topicId: number): Promise<ExerciseType2[]> => {
    const { data, error, isLoading } = useVocabExList(2, topicId);

    if (isLoading || !data) {
        return [];
    }

    const exercises: ExerciseType2[] = data.map((item) => ({
        question: item.question,
        correctAnswerIndex: item.solution,
        answers: [
        item.choice1,
        item.choice2,
        item.choice3,
        item.choice4,
        ],
    }));

    return exercises;
};
  
export const fetchVocabType3 = async (topicID: number): Promise<ExerciseType3[]> => {
    const { data, error, isLoading } = useVocabExList(3, topicID);
  
    if (isLoading || !data) {
      return [];
    }
  
    const exercises: ExerciseType3[] = data.map((item) => {
      const pair1Array = item.pair1.split('|');
      const pair2Array = item.pair2.split('|');
      const synonyms = pair1Array.map((word: string, index: number) => [word, pair2Array[index]]);
  
      return {
        question: item.question,
        synonyms,
      };
    });
  
    return exercises;
  };
