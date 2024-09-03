import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet,Image,ActivityIndicator,TouchableOpacity } from 'react-native';
import { useUser } from '@clerk/clerk-expo'; // Clerk for authentication
import { supabase } from '../../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { randomUUID } from 'expo-crypto';
import { decode } from 'base64-arraybuffer';
import RemoteImage from '../../../components/RemoteImage';
import colors from '@/constants/Colors';

const Profile = () => {
  const { user } = useUser(); // Get authenticated user from Clerk
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUserName] = useState('');
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
        setUserName(data.username)
      }
    } catch (error: any) {
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
          username: username
        })
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      console.log('User data updated:', data);
      console.log('User data updated:',imagePath);
    } catch (e: any) {
      console.log('Error updating user data:', e.message);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator/>
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
      <View style={{marginBottom: 16,}}>
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
        <Text onPress={pickImage}>
          Select Image
        </Text>
        </View>
      <View>
      <Text style={{fontSize: 16}}>First Name</Text>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.inputField}
      />
      </View>
      <View>
      <Text style={{fontSize: 16}}>Last Name</Text>
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.inputField}
      />
      </View>
      <View>
      <Text style={{fontSize: 16}}>User Name</Text>
      <TextInput
        placeholder="User Name"
        value={username}
        onChangeText={setUserName}
        style={styles.inputField}
      />
      </View>
      <TouchableOpacity onPress={onSaveUser} style={styles.button}>
        <Text style={{fontSize: 20,color:'#fff'}}>Save Changes</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 16,
  },
  inputField: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    borderRadius: 40,
    padding: 18,
    fontSize: 16,
    height: 55,
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  button:{
    marginTop: 16,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.primary.primary80,
    borderRadius: 40,
  },
});

export default Profile;
