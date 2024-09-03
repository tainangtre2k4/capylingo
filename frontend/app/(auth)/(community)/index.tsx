import { View, FlatList, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import posts from '../../../assets/data/posts.json';
import Header from '@/components/news/Header';
import PostListItem from '@/components/community/PostListItem'
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/clerk-expo'; // Clerk for authentication

const FeedScreen = () => {
  const { user } = useUser(); // Get authenticated user from Clerk

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    let { data, error } = await supabase
      .from('posts')
      .select('*,user:users(*),my_likes:likesPost(*),likesPost(count)')
      .eq('my_likes.user_id', user?.id);
    if (error) {
      Alert.alert("Something went Wrong !");
    }
    const sortedPosts = data.sort((a, b) => b.id - a.id);
    setPosts(sortedPosts);
    setLoading(false);
  };

  const router = useRouter();

  const commentHandler = (post) => {
    router.push(`/comment?postId=${post.id}`);
  };

  return (
    <View>
      <Header
        title='Community'
        backHandler={() => {}}
        navigateHandler={() => { router.push('/create') }}
        search={false}
        create={true}
      />

      <FlatList
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} commentHandler={commentHandler} />}
        contentContainerStyle={{
          gap: 10,
          maxWidth: 512,
          alignSelf: 'center',
          width: '100%',
        }}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchPosts}
        refreshing={loading}
      />
    </View>
  );
};

export default FeedScreen;
