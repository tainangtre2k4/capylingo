import { View, FlatList, Alert, TouchableOpacity, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '@/components/news/Header';
import PostListItem from '@/components/community/PostListItem';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons'; // Import icon for Saved posts

const FeedScreen = () => {
  const { user } = useUser(); // Get authenticated user from Clerk
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const commentHandler = (post) => {
    router.push(`/comment?postId=${post.id}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header
        title='Community'
        backHandler={() => {}}
        navigateHandler={() => { router.push('/create') }}
        search={false}
        create={true}
      />

      {/* Navigation to Saved Posts */}
      <View style={styles.savedPostsContainer}>
        <TouchableOpacity style={styles.savedPostsButton} onPress={() => router.push('/saved-post')}>
          <Ionicons name="bookmark-outline" size={24} color="white" />
          <Text style={styles.savedPostsText}>Saved Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.savedPostsButton} onPress={() => router.push('/my-post')}>
          <Ionicons name="document-outline" size={24} color="white" />
          <Text style={styles.savedPostsText}>My Posts</Text>
        </TouchableOpacity>
      </View>

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

const styles = StyleSheet.create({
  savedPostsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    justifyContent: 'space-around',
    backgroundColor:'white',
  },
  savedPostsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF2442',
    padding: 10,
    borderRadius: 16,
    width: 150,
    justifyContent:'center'
  },
  savedPostsText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default FeedScreen;
