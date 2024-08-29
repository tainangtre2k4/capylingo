import { View, Text,ActivityIndicator } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';
import useTopicList from '../../src/api/level/index'
const Home = () => {
  const { user } = useUser();
  const { data, isLoading, error } = useTopicList();

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch topics</Text>;
  }
  console.log(data)

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome, {user?.emailAddresses[0].emailAddress} 🎉</Text>
      <Text>{data[0].title}</Text>
    </View>
  );
};

export default Home;