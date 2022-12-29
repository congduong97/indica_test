import {StatusBar, TouchableOpacity, Text, StyleSheet} from 'react-native';
import React, {useRef} from 'react';
import {COLORS} from '../utils/colors';
import {NavigationContainer} from '@react-navigation/native';
import {ROUTE_KEY} from './routers';
import SignIn from '../screens/SignIn';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import {logout, selectUser} from '../redux/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, Settings} from 'react-native-fbsdk-next';
import {LOGIN_TYPE} from '../utils/constants';
export const {Navigator, Screen} = createNativeStackNavigator();
Settings.initializeSDK();
const RootNavigator = () => {
  const navigationRef = useRef(null);
  const {isLoggedIn, loginType} = useSelector(selectUser);
  const dispatch = useDispatch();
  const onLogout = async () => {
    try {
      if (loginType === LOGIN_TYPE.GOOGLE) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } else {
        LoginManager.logOut();
      }
      dispatch(logout());
    } catch (error) {}
  };
  return (
    <>
      <StatusBar backgroundColor={COLORS.WHITE} barStyle="dark-content" />
      <NavigationContainer ref={navigationRef}>
        <Navigator
          screenOptions={{
            animation: 'fade',
            gestureEnabled: true,
          }}>
          {isLoggedIn ? (
            <Screen
              options={{
                headerRight: () => (
                  <TouchableOpacity onPress={onLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                  </TouchableOpacity>
                ),
              }}
              name={ROUTE_KEY.Home}
              component={Home}
            />
          ) : (
            <Screen name={ROUTE_KEY.SignIn} component={SignIn} />
          )}
        </Navigator>
      </NavigationContainer>
    </>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({
  logoutText: {
    fontSize: 16,
    color: COLORS.ORANGE,
  },
});
