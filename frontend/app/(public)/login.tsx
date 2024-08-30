import SignInWithOAuth from '@/components/SignInWithOAuth';
import { useSignIn } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Pressable, Text, Alert,Image, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import colors from '@/constants/Colors';
import { color } from 'react-native-elements/dist/helpers';
const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />
      <View style={{alignItems:'center'}}>
      <Image source={require('../../assets/images/login/1.png')} style={{width: 281, height: 285}} />
      </View>
      <View>
        <Text style={styles.titleInput}>Email</Text>
        <TextInput autoCapitalize="none" placeholder="Enter your email" value={emailAddress} onChangeText={setEmailAddress} style={styles.inputField} />
      </View>
      <View>
        <Text style={styles.titleInput}>Password</Text>
        <TextInput placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputField} />
      </View>
      {/* <View style={styles.button}>
        <Button onPress={onSignInPress} title="Login" color={'#FFFFFF'}/>
      </View> */}
      <TouchableOpacity onPress={onSignInPress} style={styles.button}>
        <Text style={{color: '#FFF', fontSize: 20, fontWeight: '500'}}> Login </Text>
      </TouchableOpacity>

      <SignInWithOAuth/>

      <View style={{marginVertical: 20, alignItems:'center'}}>
      <Link href="/reset" asChild>
        <Pressable>
          <Text>Forgot password?</Text>
        </Pressable>
      </Link>
      </View>

      <View style={{flexDirection:'row',justifyContent: 'center'}}>
      <Text>Doesn't have account?    </Text>
      <Link href="/register" asChild>
        <Pressable>
          <Text style={{color: '#3DB2FF'}}>Create Account</Text>
        </Pressable>
      </Link>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  titleInput:{
    color:'#0074CE',
    fontSize:16,
  },
  inputField: {
    marginVertical: 4,
    height: 58,
    borderWidth: 1,
    borderColor: '#0074CE',
    borderRadius: 40,
    padding: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 4,
    alignItems: 'center',
    backgroundColor: colors.primary.primary80,
    padding: 20,
    marginTop: 16,
    borderRadius: 40,
  },
});

export default Login;