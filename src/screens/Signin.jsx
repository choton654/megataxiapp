import React, { useState, useCallback, useContext } from 'react'
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity,
  InteractionManager, Dimensions, Platform
} from 'react-native'
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { TextInput, useTheme, Button, HelperText, Snackbar } from "react-native-paper"
import Loader from '../components/Loader'
import { handleLogin } from '../functions/auth'
import { AuthContext } from '../context/AuthContext'
import Header from '../components/Header'

const { width, height } = Dimensions.get('window')

const Signin = () => {

  const navigation = useNavigation()
  const { colors } = useTheme()
  const { dispatch: authDispatch } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [passwordError, setPasswordError] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [liginError, setLoginError] = useState(null)
  const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)

  const login = () => {
    if (email.trim() === "") {
      setEmailError("Email field can't be empty")
    } else if (password.trim() === "") {
      setPasswordError("Password field can't be empty")
    } else {
      handleLogin(email, password, { setEmail, setPassword }, setIsLoading, authDispatch,
        { setEmailError, setPasswordError, setLoginError }, navigation)
    }
  }

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setDidFinishInitialAnimation(true)
      });

      return () => task.cancel();
    }, []))

  if (!didFinishInitialAnimation) { return <Loader /> }

  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === "ios" &&
        <Header title={"COOP Montreal - Sign in"} />
      }
      <ScrollView contentContainerStyle={styles.div_1} keyboardDismissMode='none'>
        <TextInput
          label="Email"
          value={email}
          error={emailError ? true : false}
          onChangeText={text => {
            setEmail(text)
            setPasswordError(null)
            setEmailError(null)
            setLoginError(null)
          }}
          activeUnderlineColor="#f59e0b"
          style={{ backgroundColor: colors.primary, paddingHorizontal: 0 }}
        />
        {emailError &&
          <HelperText type="error" visible={true}>
            {emailError}
          </HelperText>
        }
        <TextInput
          label="Password"
          value={password}
          error={passwordError ? true : false}
          secureTextEntry={true}
          onChangeText={text => {
            setPassword(text)
            setPasswordError(null)
            setEmailError(null)
            setLoginError(null)
          }}
          activeUnderlineColor="#f59e0b"
          style={{ marginTop: 10, backgroundColor: colors.primary, paddingHorizontal: 0 }}
        />
        {passwordError &&
          <HelperText type="error" visible={true}>
            {passwordError}
          </HelperText>
        }
        <Button mode="contained"
          loading={isLoading}
          color={colors.button}
          style={{ marginTop: 20 }}
          onPress={login}
        >
          SIGN IN
        </Button>

        <View style={{
          flexDirection: "row", marginTop: 20, justifyContent: "space-between",
          paddingHorizontal: 0, alignItems: "center"
        }}>
          <Button mode="outlined"
            color="#424242"
            style={{ borderWidth: 1, borderColor: "#424242" }}
            onPress={() => navigation.navigate("Stack", { screen: "Sign up" })}
          >
            SIGN UP
          </Button>
          <TouchableOpacity onPress={() => navigation.navigate("Stack", { screen: "Forgot Password" })}>
            <Text style={{ fontWeight: "600" }}>FORGOT PASSWORD ?</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ marginTop: 30, color: colors.myOwnColor, textAlign: "center" }}>Privacy Policy</Text>
        <Snackbar
          visible={liginError}
          style={{ width: width * 0.95 }}
          onDismiss={() => setLoginError(null)}
          action={{
            label: 'Close',
            onPress: () => {
              setLoginError(null)
            },
          }}>
          {liginError}
        </Snackbar>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  div_1: {
    height: height - 55,
    padding: 20,
    backgroundColor: "#fff"
  }
})

export default Signin