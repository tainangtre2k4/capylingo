import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { useUser } from '@clerk/clerk-expo'; // Clerk for authentication
import { supabase } from '../../lib/supabase';

const Profile = () => {
  const { user } = useUser(); // Get authenticated user from Clerk
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

  // Fetch user data from Supabase
  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        console.log(data)
        setFirstName(data.first_name);
        setLastName(data.last_name);
      }
    } catch (error) {
      console.log('Error fetching user data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update user data in Supabase
  const onSaveUser = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          first_name: firstName,
          last_name: lastName,
        })
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      console.log('User data updated:', data);
    } catch (e) {
      console.log('Error updating user data:', e.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={{ textAlign: 'center' }}>
        Good morning {firstName} {lastName}!
      </Text>

      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.inputField}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.inputField}
      />
      <Button onPress={onSaveUser} title="Update account" color={'#6c47ff'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: '#6c47ff',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default Profile;
