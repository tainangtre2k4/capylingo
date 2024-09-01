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

export const useVocabExList = (type, topicID) => {
    let tableName;
    switch (type) {
      case 1:
        tableName = 'VocabExType1';
        break;
      case 2:
        tableName = 'VocabExType2';
        break;
      case 3:
        tableName = 'VocabExType3';
        break;
      default:
        throw new Error('Invalid type provided');
    }
  
    return useQuery({
      queryKey: [tableName, topicID],
      queryFn: async () => {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('TopicId', topicID);
  
        if (error) {
          throw new Error(error.message);
        }
        return data;
      },
    });
  };