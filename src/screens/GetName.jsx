import React, { useState, useContext, useCallback } from 'react'
import { ScrollView, View, InteractionManager } from 'react-native'
import { TextInput, Text, Button, useTheme, HelperText } from "react-native-paper"
import Loader from '../components/Loader'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { updateUser } from '../functions/auth'
import { AuthContext } from '../context/AuthContext'

const GetName = () => {

    const navigation = useNavigation()
    const { colors } = useTheme()
    const { dispatch: authDispatch } = useContext(AuthContext)
    const [displayName, setDisplayName] = useState('')
    const [displayNameError, setDisplayNameError] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)

    const updateDisplayName = async () => {
        if (displayName.trim() === '') {
            setDisplayNameError("Display name can't be empty")
        } else if (displayName.trim() < 3) {
            setDisplayNameError("Display name too sort")
        } else {
            updateUser(displayName, setisLoading, navigation, authDispatch)
        }
    }

    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(async () => {
                setDidFinishInitialAnimation(true)
            })
            return () => task.cancel()
        }, []))

    if (!didFinishInitialAnimation) { return <Loader /> }

    return (
        <ScrollView style={{
            flex: 1,
            padding: 20,
            backgroundColor: "#fff"
        }} keyboardDismissMode='none'>
            <Text style={{ textAlign: "center", fontWeight: "700", fontSize: 20 }}>Tell us your name</Text>
            <TextInput
                label="Name"
                value={displayName}
                error={displayNameError ? true : false}
                onChangeText={text => {
                    setDisplayName(text)
                    setDisplayNameError(null)
                }}
                activeUnderlineColor="#f59e0b"
                style={{ backgroundColor: colors.primary, paddingHorizontal: 0 }}
            />
            {displayNameError &&
                <HelperText type="error" visible={true}>
                    {displayNameError}
                </HelperText>
            }
            <View style={{ alignItems: "center" }}>
                <Button mode="outlined"
                    icon="arrow-right"
                    loading={isLoading}
                    color={colors.button}
                    style={{
                        borderWidth: 1, borderColor: colors.button, marginTop: 20,
                        width: "60%", marginHorizontal: "auto"
                    }}
                    onPress={updateDisplayName}
                >
                    NEXT
                </Button>
            </View>
        </ScrollView>
    )
}

export default GetName