import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';

// export default useTopicList = () => {
//   return useQuery({
//     queryKey: ['topics'],
//     queryFn: async () => {
//       const { data, error } = await supabase.from('topics').select('*');
//       if (error) {
//         throw new Error(error.message);
//       }
//       return data;
//     },
//   });
// };

export const useVocabList = (topicID) => {
  return useQuery({
    queryKey: ['Vocab', topicID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Vocab')
        .select('*')
        .eq('TopicId', topicID);

      if (error) {
        throw new Error(error.message);
      }

      return data
    },
  });
};

export const useVocabExType1List = (topicID) => {
  return useQuery({
    queryKey: ['VocabExType1', topicID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('VocabExType1')
        .select('*')
        .eq('TopicId', topicID);

      if (error) {
        throw new Error(error.message);
      }

      return data.map((item) => ({
        questionImage: item.ImageUrl,
        correctAnswerIndex: item.solution,
        answers: [
          item.choice1,
          item.choice2,
          item.choice3,
          item.choice4,
        ],
      }));
    },
  });
};

export const useVocabExType2List = (topicID) => {
  return useQuery({
    queryKey: ['VocabExType2', topicID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('VocabExType2')
        .select('*')
        .eq('TopicId', topicID);

      if (error) {
        throw new Error(error.message);
      }

      return data.map((item) => ({
        question: item.question,
        correctAnswerIndex: item.solution,
        answers: [item.choice1, item.choice2, item.choice3, item.choice4],
      }));
    },
  });
};

export const useVocabExType3List = (topicID) => {
  return useQuery({
    queryKey: ['VocabExType3', topicID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('VocabExType3')
        .select('*')
        .eq('TopicId', topicID);

      if (error) {
        throw new Error(error.message);
      }

      return data.map((item) => {
        const pair1Array = item.pair1.split('|');
        const pair2Array = item.pair2.split('|');
        const synonyms = pair1Array.map((word, index) => [word, pair2Array[index]]);

        return {
          question: item.question,
          synonyms,
        };
      });
    },
  });
};