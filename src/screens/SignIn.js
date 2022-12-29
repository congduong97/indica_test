import {View, StyleSheet, Alert, Text, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {CONFIG} from '../utils/config';
import {LOGIN_TYPE, PROFILE_IMAGE_SIZE} from '../utils/constants';
import {useDispatch} from 'react-redux';
import {setLogin} from '../redux/userSlice';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {COLORS} from '../utils/colors';

const SignIn = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: CONFIG.webClientId,
      offlineAccess: false,
      profileImageSize: PROFILE_IMAGE_SIZE,
    });
  }, []);

  const onGoogleLogin = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // Sign-in the user with the credential
      const res = await auth().signInWithCredential(googleCredential);
      dispatch(
        setLogin({
          isLoggedIn: true,
          loginType: LOGIN_TYPE.GOOGLE,
          token: idToken,
          userInfo: res.user,
        }),
      );
    } catch (error) {
      Alert.alert('Login failed !');
    }
  };

  const onFacebookButtonPress = async () => {
    try {
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );
      // Sign-in the user with the credential
      const res = await auth().signInWithCredential(facebookCredential);
      dispatch(
        setLogin({
          isLoggedIn: true,
          loginType: LOGIN_TYPE.FACEBOOK,
          token: data.accessToken,
          userInfo: res.user,
        }),
      );
    } catch (error) {
      Alert.alert('Login failed !');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logiByFB} onPress={onFacebookButtonPress}>
        <Text style={styles.logiByFBText}>Facebook Sign-In</Text>
      </TouchableOpacity>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Standard}
        color={GoogleSigninButton.Color.Dark}
        onPress={onGoogleLogin}
      />
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logiByFB: {
    backgroundColor: COLORS.MAIN,
    paddingVertical: 12,
    paddingHorizontal: 50,
  },
  logiByFBText: {
    fontSize: 16,
    color: COLORS.WHITE,
  },
});
