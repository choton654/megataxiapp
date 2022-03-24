import React, { useState, useContext, useCallback, useRef } from 'react'
import { View, InteractionManager, ScrollView, Platform } from 'react-native'
import { TextInput, Text, Button, useTheme, HelperText } from "react-native-paper"
// import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import Loader from '../components/Loader'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { AuthContext } from '../context/AuthContext'
import { updateUserPhone } from '../functions/auth'

// import { getApp } from 'firebase/app'
// import { getAuth } from "firebase/auth"

// const app = getApp()
// const auth = getAuth()


const GetPhone = () => {

    // const recaptchaVerifier = useRef(null)
    const navigation = useNavigation()
    const { colors } = useTheme()
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext)
    const [phone, setPhone] = useState('')
    const [isLoading, setisLoading] = useState(false)
    const [phoneError, setPhoneError] = useState(null)
    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)

    // const firebaseConfig = app ? app.options : undefined;

    const signinWithPhone = () => {
        if (phone.trim().length < 10) {
            setPhoneError("Phone no must have 10 digit ")
        } else {
            // console.log(phone);
            authDispatch({ type: "ADD PHONE NUMBER", payload: phone })
            // navigation.navigate("Stack", { screen: "ValidatePhone" })
            updateUserPhone(phone, setisLoading, navigation,
                authDispatch, setPhoneError)
        }
    }

    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
                setDidFinishInitialAnimation(true)
                setPhone(authState.phoneNo)
            })
            return () => task.cancel()
        }, []))

    if (!didFinishInitialAnimation) { return <Loader /> }

    return (
        <View style={{
            flex: 1,
            padding: 20,
            backgroundColor: "#fff"
        }}>
            <ScrollView keyboardDismissMode="none">
                <Text style={{ textAlign: "center", fontWeight: "700", fontSize: 20 }}>Tell us your phone number</Text>
                <TextInput
                    label="Phone"
                    keyboardType="phone-pad"
                    placeholder='+15143475397'
                    value={phone}
                    error={phoneError ? true : false}
                    onChangeText={text => {
                        setPhone(text)
                        setPhoneError(null)
                    }}
                    activeUnderlineColor="#f59e0b"
                    style={{ backgroundColor: colors.primary, paddingHorizontal: 0 }}
                />
                {phoneError &&
                    <HelperText type="error" visible={true}>
                        {phoneError}
                    </HelperText>
                }
                <View style={{ alignItems: "center" }}>
                    <Button mode="outlined"
                        icon="arrow-right"
                        color={colors.button}
                        loading={isLoading}
                        style={{
                            borderWidth: 1, borderColor: colors.button, marginTop: 20,
                            width: "60%", marginHorizontal: "auto"
                        }}
                        onPress={signinWithPhone}
                    >
                        NEXT
                    </Button>
                </View>
                {/* <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                    attemptInvisibleVerification={false}
                /> */}
            </ScrollView>
        </View>
    )
}

export default GetPhone