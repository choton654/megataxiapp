import React, { useContext, useEffect, useState } from 'react'
import { InteractionManager, Alert, Linking, BackHandler } from 'react-native';
import * as Location from 'expo-location'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigation from './DrawerNavigation';
import StackNavigation from './StackNavigation';
import { AuthContext } from '../context/AuthContext';
import auth from '@react-native-firebase/auth';
// import { getAuth } from "firebase/auth"
// import app from '../firebase/config'
import Loader from '../components/Loader';

// const auth = getAuth(app)

const Stack = createNativeStackNavigator()

const MainApp = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Drawer'>
      <Stack.Screen name='Drawer' component={DrawerNavigation} />
      <Stack.Screen name='Stack' component={StackNavigation} />
    </Stack.Navigator>
  )
}

const RootNavigation = () => {

  const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)
  const { dispatch: authDispatch } = useContext(AuthContext)

  useEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      // auth.onAuthStateChanged((user) => {
      // if (user) {
      //   authDispatch({ type: 'SIGN UP', payload: user })
      // } else {
      //   console.log('user not available');
      // }
      // })
      const unSubscribe = auth().onAuthStateChanged(user => {
        if (user) {
          // console.log("user", user)
          authDispatch({ type: 'SIGN UP', payload: user })
        } else {
          console.log('user not available');
        }
      })
      unSubscribe()
      let { status } = await Location.getForegroundPermissionsAsync()
      if (status !== 'granted') {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        if (newStatus !== 'granted') {
          return Alert.alert(
            "Allow location",
            "Location should be enabled in order to order Taxi",
            [
              { text: "Cancel", onPress: () => BackHandler.exitApp(), style: "cancel" },
              { text: "OK", onPress: () => Linking.openSettings() }
            ]
          );
        }
      }
      setDidFinishInitialAnimation(true)
    })
  }, [])

  if (!didFinishInitialAnimation) { return <Loader /> }

  return (
    <NavigationContainer>
      <MainApp />
    </NavigationContainer>
  )
}

export default RootNavigation