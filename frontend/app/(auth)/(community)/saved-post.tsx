import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import PostListItem from '@/components/community/PostListItem';
import Header from '@/components/news/Header';

const SavedPostsScreen: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    loadSavedPosts();
  }, []);

  const loadSavedPosts = async () => {
    setLoading(true);
    try {
      const savedPosts = await AsyncStorage.getItem('savedPosts');
      const savedPostsArray = savedPosts ? JSON.parse(savedPosts) : [];
      setSavedPosts(savedPostsArray);
    } catch (error) {
      console.error('Error loading saved posts:', error);
      Alert.alert('Error', 'Failed to load saved posts.');
    }
    setLoading(false);
  };

  const removePost = async (postId: number) => {
    try {
      const updatedPosts = savedPosts.filter(post => post.id !== postId);
      await AsyncStorage.setItem('savedPosts', JSON.stringify(updatedPosts));
      setSavedPosts(updatedPosts);
    } catch (error) {
      console.error('Error removing saved post:', error);
      Alert.alert('Error', 'Failed to remove saved post.');
    }
  };

  // Comment handler to navigate to comment screen
  const commentHandler = (post) => {
    router.push(`/comment?postId=${post.id}`);
  };

  return (
    <View style={styles.container}>
      <Header
        title='Saved Posts'
        backHandler={() => { router.back(); }}
        search={false}
      />
      
      {savedPosts.length === 0 ? (
        <Text style={styles.noPostsText}>No saved posts available.</Text>
      ) : (
        <FlatList
          data={savedPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostListItem
              post={item}
              commentHandler={commentHandler} // Pass the comment handler here
              show={true}
            />
          )}
          refreshing={loading}
          onRefresh={loadSavedPosts}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  noPostsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default SavedPostsScreen;
