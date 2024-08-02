import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, View, Button, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { SocialIcon } from 'react-native-elements';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
  useWarmUpBrowser();

  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startFacebookOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });

  const onPressGoogle = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startGoogleOAuthFlow({ redirectUrl: Linking.createURL("/dashboard", { scheme: "myapp" })});

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  const onPressFacebook = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startFacebookOAuthFlow({ redirectUrl: Linking.createURL("/dashboard", { scheme: "myapp" })});

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <View>
      <TouchableOpacity onPress={onPressGoogle} style={{flexDirection:'row',alignItems:'center', justifyContent:'center',marginVertical:16,}}>
        <View style={{marginHorizontal:10}}>
           <Text>Login with Google</Text> 
        </View>
        <AntDesign name="google" size={20} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressGoogle} style={{flexDirection:'row',alignItems:'center', justifyContent:'center'}}>
        <View style={{marginHorizontal:10}}>
           <Text>Login with Facebook</Text> 
        </View>
        <FontAwesome name="facebook" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default SignInWithOAuth;

const styles = StyleSheet.create({
    title:{
      color:'#111111'
    }
});
