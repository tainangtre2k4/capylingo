import { View, StyleSheet, TextInput, Button,Text } from 'react-native';
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';
import colors from '@/constants/Colors';
import { color } from 'react-native-elements/dist/helpers';

const PwReset = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const { signIn, setActive } = useSignIn();

  // Request a passowrd reset code by email
  const onRequestReset = async () => {
    try {
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    }
  };

  // Reset the password with the code and the new password
  const onReset = async () => {
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });
      console.log(result);
      alert('Password reset successfully');

      // Set the user session active, which will log in the user automatically
      await setActive?.({ session: result?.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !successfulCreation }} />

      {!successfulCreation && (
        <>
          <View style={{marginVertical: 16}}>
            <Text style={{fontSize:20, textAlign:'center'}}>Enter Your Email Ro Reset Password</Text>
          </View>
          <TextInput autoCapitalize="none" placeholder="yourEmail@gmail.com" value={emailAddress} onChangeText={setEmailAddress} style={styles.inputField} />
          <View style={styles.button}>
          <Button onPress={onRequestReset} title="Send Reset Email" color={colors.base.black0}></Button>
          </View>
        </>
      )}

      {successfulCreation && (
        <>
          <View>
            <TextInput value={code} placeholder="Code..." style={styles.inputField} onChangeText={setCode} />
            <TextInput placeholder="New password" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputField} />
          </View>
          <Button onPress={onReset} title="Set new Password" color={colors.base.black0}></Button>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 58,
    borderWidth: 1,
    borderColor: colors.primary.primary100,
    borderRadius: 40,
    padding: 16,
    backgroundColor: '#fff',
  },
  button: {
    alignItems: 'center',
    backgroundColor:colors.primary.primary80,
    padding:16,
    borderRadius: 40,
    marginVertical: 16,
  },
});

export default PwReset;