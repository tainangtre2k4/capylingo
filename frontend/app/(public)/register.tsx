import { Button, TextInput, View, StyleSheet,Text } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import Spinner from 'react-native-loading-spinner-overlay';
import { useState } from 'react';
import { Stack } from 'expo-router';
import colors from '@/constants/Colors';
const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Create the user and send the verification email
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      // Create the user on Clerk
      await signUp.create({
        emailAddress,
        password,
      });

      // Send verification Email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // change the UI to verify the email address
      setPendingVerification(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  // Verify the email address
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
      <Spinner visible={loading} />

      {!pendingVerification && (
        <>
          <View>
            <Text style={styles.title}>Enter Your Email</Text>
            <TextInput autoCapitalize="none" placeholder="yourgmail@gmail.com" value={emailAddress} onChangeText={setEmailAddress} style={styles.inputField} />
          </View>
          <View>
            <Text style={styles.title}>Enter Your Password</Text>
            <TextInput placeholder="password" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputField} />
          </View>

          <View style={styles.button}>         
             <Button onPress={onSignUpPress} title="Sign up" color={colors.base.black0}></Button>
          </View>
        </>
      )}

      {pendingVerification && (
        <>
          <View style={styles.header}>
            <Text style={{fontSize:20,fontWeight:'bold'}}>You have successfully registered!</Text>
            <Text style={{textAlign:'center'}}>We have sent a confirmation email to you. Please check your email and enter the code below</Text>
          </View>
          <View>
            <TextInput value={code} placeholder="Code..." style={styles.inputField} onChangeText={setCode} />
          </View>
          <View style={styles.button}>
          <Button onPress={onPressVerify} title="Verify Email" color={colors.base.black0}></Button>
          </View>
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
    marginVertical: 6,
    height: 58,
    borderWidth: 1,
    borderColor: colors.primary.primary100,
    borderRadius: 40,
    padding: 16,
    backgroundColor: colors.base.black0,
  },
  button: {
    marginVertical: 10,
    height: 58,
    borderRadius: 40,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:colors.primary.primary80
  },
  title:{
    color:colors.primary.primary100,
    fontSize: 16,
  },
  header:{
    alignItems:'center',
    marginVertical: 16,
  },
});

export default Register;