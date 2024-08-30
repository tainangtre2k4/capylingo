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