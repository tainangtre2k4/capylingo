import { View, Text  } from 'react-native'
import {Ionicons,Feather,AntDesign} from '@expo/vector-icons'
import { AdvancedImage } from 'cloudinary-react-native';
import { cld } from '@/lib/cloudinary';
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import {Video,ResizeMode} from 'expo-av'
import PostContent from './PostContent';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo'; // Clerk for authentication
import { supabase } from '@/lib/supabase';
import { sendLikeNotification } from '@/utils/Notification';

export default function PostListItem({post}){
    const { user } = useUser(); // Get authenticated user from Clerk
    const [isLiked,setIsLiked]= useState(false);
    const [likeRecord,setLikeRecord] = useState(null)

    useEffect(()=>{
      if (post.my_likes.length > 0) {
        setLikeRecord(post.my_likes[0]);
        setIsLiked(true);
      }
    },[post.my_likes])

    useEffect(()=>{
      if (isLiked) {
        saveLike();
      }
      else deleteLike();
    },[isLiked])

    // const fetchLike = async () => {
    //   const {data} = await supabase.from('likesPost').select('*')
    //   .eq('user_id',user?.id)
    //   .eq('post_id',post.id)
    //   .select()
    //   if (data && data?.length>0)
    //   {
    //     setLikeRecord(data[0])
    //     setIsLiked(true)
    //   }
    // }

    const saveLike = async ()  => {
      if (likeRecord) return;
      const {data,error} = await supabase.from('likesPost').insert([{
        user_id: user?.id,
        post_id: post.id,
      }]).select('*')
      if (error) console.log(error)
      sendLikeNotification(data[0])
      if (data)  {console.log(data[0]); setLikeRecord(data[0]);}
    }

    const deleteLike = async ()  => {
      if (likeRecord){
        const {error} = await supabase.from('likesPost').delete().eq('id',likeRecord.id)
        if (!error) setLikeRecord(null);
      }
     
    }

    const avatarUrl = post.user.avatar_url;
    const avatar = cld.image(
      avatarUrl && avatarUrl.startsWith('https://img.clerk.com/')
        ? 'user_ynfjc7'
        : avatarUrl || 'user_ynfjc7'
    );
    avatar.resize(thumbnail().width(48).height(48).gravity(focusOn(FocusOn.face())));
    

    return (
        <View className='bg-white'>
          
    
    
          <View className='p-3 flex-row items-center gap-2'>
              <AdvancedImage
                cldImg={avatar}
                className='w-12 aspect-square rounded-full'
              />
              <Text className='font-semibold '>{post.user.username || 'New User'}</Text>
          </View>

          <PostContent post={post}/>
          

          {/* Icons */}
          <View className="flex-row gap-3 p-3">
            <AntDesign onPress={()=>setIsLiked(!isLiked)}
            name={isLiked? "heart" :"hearto" } size={20} 
            color={isLiked? 'crimson': 'black' }/>
            <Ionicons name="chatbubble-outline" size={20} />
            <Feather name="send" size={20} />
    
            <Feather name="bookmark" size={20} className="ml-auto" />
          </View>

          <View className='px-3 gap-1'>
            <Text className='font-semibold'>{post.likesPost?.[0]?.count || 0} likes</Text>
            <Text>
              <Text className='font-semibold'>{post.user.username} </Text>
              {post.caption}
            </Text>
          </View>
    
        </View>
    )
}