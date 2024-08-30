import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet,Image } from 'react-native';
import { useUser } from '@clerk/clerk-expo'; // Clerk for authentication
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import { decode } from 'base64-arraybuffer';
import RemoteImage from '../../components/RemoteImage'
const Profile = () => {
  const { user } = useUser(); // Get authenticated user from Clerk
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const defaultPizzaImage =
  'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';
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
        .eq('id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        console.log(data)
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setImage(data.avatar_url)
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
      const imagePath = await uploadImage();
      const { data, error } = await supabase
        .from('users')
        .update({
          first_name: firstName,
          last_name: lastName,
          avatar_url: imagePath,
        })
        .eq('id', user?.id);

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

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image?.startsWith('file://')) {
      return;
    }
  
    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: 'base64',
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = 'image/png';
    const { data, error } = await supabase.storage
      .from('ProfileImage')
      .upload(filePath, decode(base64), { contentType });
    
    console.log(error)
    if (data) {
      return data.path;
    }
  };
  const isRemoteImage = image && /^[a-zA-Z0-9-]+\.png$/.test(image);

  return (
    <View style={styles.container}>
      {isRemoteImage ? (
        <RemoteImage
          path={image}
          fallback={defaultPizzaImage}
          NameOfStorage={'ProfileImage'}
          style={styles.image}
        />
      ) : (
        <Image
          source={{ uri: image || defaultPizzaImage }}
          style={styles.image}
        />
      )}
      <Text onPress={pickImage} style={styles.textButton}>
        Select Image
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
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
});

export default Profile;
