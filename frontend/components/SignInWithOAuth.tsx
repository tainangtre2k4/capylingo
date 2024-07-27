import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, View, Button, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { SocialIcon } from 'react-native-elements';

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
      <TouchableOpacity onPress={onPressGoogle}>
        <SocialIcon
          title='Sign In With Google'
          button
          type='google'
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressFacebook}>
        <SocialIcon
          title='Sign In With Facebook'
          button
          type='facebook'
        />
      </TouchableOpacity>
    </View>
  );
};

export default SignInWithOAuth;

const styles = StyleSheet.create({

});
