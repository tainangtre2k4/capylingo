import { View, Text,Image,TextInput, Pressable } from 'react-native'
import {useEffect, useState} from 'react'
import Header from '@/components/news/Header'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import Button from '@/components/community/button'
import {uploadImage } from '@/lib/cloudinary'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/clerk-expo'; // Clerk for authentication
const create = () => {
    const { user } = useUser();
    const [caption,setCaption] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const router = useRouter();
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.5,
        });
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
    };
    useEffect(()=>{
        if (!image) pickImage();
    },[image])


    const createPost = async () => {
        if (!image) return
        const response = await uploadImage(image);
        console.log(response?.public_id)
        
        const { data, error } = await supabase
        .from('posts')
        .insert([{
            caption,
            image: response?.public_id,
            user_id: user?.id 
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
        <View className='p-3 items-center '>
            {image ? (<Image
            source={{
                uri: image,
            }}
            className='w-52 aspect-[3/4] rounded-lg bg-slate-300'
            />) : (<View className='w-52 aspect-[3/4] rounded-lg bg-slate-300'/>)}
            <Text onPress={pickImage} className='text-blue-500 font-semibold m-5'>Change</Text>
        
        
        {/* Caption*/}
        <TextInput 
        value = {caption}
        onChangeText={(newValue)=>{setCaption(newValue)}}
        placeholder='What is on your mind' className='w-full p-3'/>

            <View className='w-full mt-40'>
                <Button title='Share' onPress={createPost}/>
            </View>
        </View>
    </View>
  )
}

export default create