import { View,FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import posts from '../../../assets/data/posts.json'
import Header from '@/components/news/Header';
import PostListItem from '@/components/community/PostListItem';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
const FeedScreen = () => {
  const [posts,setPosts] = useState([]);

  useEffect(()=>{
    fetchPosts();
  },[])

  const fetchPosts = async () =>{
    let { data, error } = await supabase
    .from('posts')
    .select('*,user:users(*)')  
    if (error) {
      Alert.alert("Something went Wrong !")
    }
    setPosts(data);
  }

  const router =useRouter();
  
  return(
    <View>
      <Header 
      title='Comunity' backHandler={() => {}} navigateHandler={()=>{router.push('/create')}}
      search={false} 
      create={true}
      />
      
      <FlatList
        data={posts}
        className='items-cente'
        contentContainerStyle={{gap: 10,width:'100%',maxWidth:512,alignSelf:'center'}}
        renderItem={({item})=><PostListItem post={item}/>}
        showsVerticalScrollIndicator = {false}
      />

      
    </View>
  )
}

export default FeedScreen