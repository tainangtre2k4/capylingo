import { View, Text,Image,TextInput, Pressable } from 'react-native'
import {useEffect, useState} from 'react'
import Header from '@/components/news/Header'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import Button from '@/components/community/button'
import {uploadImage } from '@/lib/cloudinary'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/clerk-expo'; // Clerk for authentication
import {Video,ResizeMode} from 'expo-av'
const create = () => {
    const { user } = useUser();
    const [caption,setCaption] = useState('');
    const [media, setMedia] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'video' | 'image' | undefined>();
    const router = useRouter();
    const pickMedia = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.5,
        });
    
        if (!result.canceled) {
            setMedia(result.assets[0].uri);
            setMediaType(result.assets[0].type);
        }
    };
    useEffect(()=>{
        if (!media) pickMedia();
    },[media])


    const createPost = async () => {
        if (!media) return
        const response = await uploadImage(media);
        console.log(response?.public_id)
        
        const { data, error } = await supabase
        .from('posts')
        .insert([{
            caption,
            image: response?.public_id,
            user_id: user?.id,
            media_type: mediaType
        }])
        .select();
        router.back();
    }
  return (
    <View>
        <Header 
        title='Create' backHandler={() => {router.back()}}
        search={false} 
        />
        {/* Image Picker*/}
        <View className='p-3 items-center'>
        {!media ? (
        <View className="w-52 aspect-[3/4] rounded-lg bg-slate-300" />
      ) : mediaType === 'image' ? (
        <Image
          source={{ uri: media }}
          className="w-52 aspect-[3/4] rounded-lg bg-slate-300"
        />
      ) : (
        <Video
          className="w-52 aspect-[3/4] rounded-lg bg-slate-300"
          style={{ width: '100%', aspectRatio: 16 / 9 }}
          source={{
            uri: media,
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          shouldPlay
        />
      )}

            
            <Text onPress={pickMedia} className='text-blue-500 font-semibold m-5'>Change</Text>
        
        
        {/* Caption*/}
        <TextInput 
        value = {caption}
        onChangeText={(newValue)=>{setCaption(newValue)}}
        placeholder='What is on your mind' className='w-full p-3'/>

        <View className='w-full mt-40 items-center bg-blue-200 p-4'>
            <Button title='Share' onPress={createPost}/>
        </View>
        </View>
    </View>
  )
}

export default create