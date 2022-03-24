import React, { useState, useCallback } from 'react'
import { useFocusEffect } from "@react-navigation/native"
import { View, Platform, ScrollView, StyleSheet, InteractionManager } from 'react-native'
import { useTheme, HelperText, Button, TextInput } from "react-native-paper"
import Loader from '../components/Loader'
import { forgotPassword } from '../functions/auth'
import Header from '../components/Header'

const ForgotPass = () => {

    const { colors } = useTheme()
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState(null)
    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)
    const [isLoading, setisLoading] = useState(false)

    const resetUserPass = () => {
        if (email.trim() === '') {
            setEmailError("Email can't be empty")
        } else {
            forgotPassword(email, setisLoading)
        }
    }

    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
                setDidFinishInitialAnimation(true)
            });

            return () => task.cancel();
        }, [])
    )

    if (!didFinishInitialAnimation) { return <Loader /> }

    return (
        <View style={{ flex: 1 }}>
            {Platform.OS === "ios" &&
                <Header title={"Forgot Password ?"} />
            }
            <ScrollView style={styles.div_1}>
                <TextInput
                    label="Email"
                    value={email}
                    error={emailError ? true : false}
                    onChangeText={text => setEmail(text)}
                    activeUnderlineColor="#f59e0b"
                    style={{ backgroundColor: colors.primary, paddingHorizontal: 0 }}
                />
                {emailError &&
                    <HelperText type="error" visible={true}>
                        {emailError}
                    </HelperText>
                }
                <Button mode="contained"
                    onPress={resetUserPass}
                    loading={isLoading}
                    color={colors.button}
                    style={{ marginTop: 20 }}>
                    RESET PASSWORD
                </Button>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    div_1: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff"
    }
})

export default ForgotPass