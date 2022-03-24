import React, { useState, useEffect, useContext, useCallback } from 'react'
import { View, InteractionManager } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { TextInput, Text, Button, useTheme, HelperText } from "react-native-paper"
import Loader from '../components/Loader'
import { AuthContext } from '../context/AuthContext'
import { confirmCode, updateUserPhone } from '../functions/auth'

const ValidatePhone = () => {

    const navigation = useNavigation()
    const { colors } = useTheme()
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext)
    const [code, setCode] = useState('')
    const [isLoading, setisLoading] = useState(false)
    const [isVerifyCodeLoading, setisVerifyCodeLoading] = useState(false)
    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)
    const [codeError, setCodeError] = useState(null)

    const { phoneNo, phoneConfirmationObj } = authState

    const verifyPhoneNo = () => {
        if (code.trim().length < 6) {
            setCodeError("Verification code must be 6 digit long")
        } else {
            confirmCode(code, phoneConfirmationObj,
                setisLoading, navigation, authDispatch, setCodeError)
        }
    }

    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
                setDidFinishInitialAnimation(true)
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
            <Text style={{ textAlign: "center", fontWeight: "700", fontSize: 20 }}>
                Validate your phone number</Text>
            <Text style={{
                textAlign: "center", fontWeight: "600", fontSize: 15,
                marginTop: 20
            }}>
                {phoneNo}</Text>
            <View style={{ alignItems: "center" }}>
                <Button mode="outlined"
                    color={colors.myOwnColor}
                    loading={isVerifyCodeLoading}
                    onPress={() =>
                        updateUserPhone(phoneNo,
                            undefined, undefined,
                            authDispatch, undefined,
                            setisVerifyCodeLoading)}
                    style={{
                        borderWidth: 1,
                        borderColor: colors.myOwnColor,
                        marginTop: 20,
                        width: "90%"
                    }}
                >
                    GET VALIDATION CODE IN SMS
                </Button>
            </View>
            <TextInput
                label="Code"
                keyboardType="phone-pad"
                error={codeError ? true : false}
                value={code}
                onChangeText={text => {
                    setCode(text)
                    setCodeError(null)
                }}
                activeUnderlineColor="#f59e0b"
                style={{
                    backgroundColor: colors.primary, paddingHorizontal: 0,
                    marginTop: 20
                }}
            />
            {codeError &&
                <HelperText type="error" visible={true}>
                    {codeError}
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
                    onPress={verifyPhoneNo}
                >
                    NEXT
                </Button>
            </View>
        </View>
    )
}

export default ValidatePhone