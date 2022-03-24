import React, { useCallback, useState, useContext, useEffect } from 'react'
import {
    StyleSheet, View, InteractionManager,
    TouchableOpacity
} from 'react-native'
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { Text, useTheme, Portal, Dialog } from 'react-native-paper'
import { MaterialCommunityIcons } from "@expo/vector-icons"
import Loader from '../components/Loader'
import { AuthContext } from '../context/AuthContext'
import { signoutUser } from '../functions/auth'
import PasswordDialog from '../components/Account/PasswordDialog'
import DisplayNameDialog from '../components/Account/DisplayNameDialog'
import UserInfo from '../components/Account/UserInfo'

const Account = () => {

    const navigation = useNavigation()
    const { colors } = useTheme()
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext)

    const { user, displayName, phoneNo } = authState

    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)
    const [visible, setVisible] = useState(false)
    const [editInfo, setEditInfo] = useState(null)

    const openDialog = () => { setVisible(true) }
    const hideDialog = useCallback(() => {
        setVisible(false)
        setEditInfo(null)
    }, [])

    useEffect(() => { if (editInfo) { openDialog() } }, [editInfo]);

    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
                setDidFinishInitialAnimation(true)
            })
            return () => task.cancel()
        }, [])
    )

    if (!didFinishInitialAnimation) { return <Loader /> }

    return (
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
            <Text style={styles.heading}>Account Settings</Text>
            <View style={styles.div_1}>
                <UserInfo info={displayName} infoType={"displayName"} setEditInfo={setEditInfo} />
                <UserInfo info={phoneNo} infoType={"phoneNumber"} setEditInfo={setEditInfo} />
                <UserInfo info={user.email} infoType={"email"} setEditInfo={setEditInfo} />
                <UserInfo info={"change password"} infoType={"changePassword"} setEditInfo={setEditInfo} />
            </View>
            <TouchableOpacity
                style={[styles.signoutButton, { backgroundColor: colors.light, borderBottomColor: colors.placeholder }]}
                onPress={() => signoutUser(navigation, authDispatch)}>
                <Text>Sign Out</Text>
                <MaterialCommunityIcons name='logout' size={25}
                    color={colors.dark} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.div_1}
                onPress={() => navigation.navigate("Stack", { screen: "Privecy Policy" })}>
                <Text>Privacy policy</Text>
            </TouchableOpacity>

            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>{editInfo === "displayName" ? "Change Name" : "Change Password"}</Dialog.Title>
                    {editInfo === "displayName" &&
                        <DisplayNameDialog hideDialog={hideDialog}
                            authDispatch={authDispatch} />
                    }
                    {editInfo === "changePassword" &&
                        <PasswordDialog hideDialog={hideDialog}
                            email={user.email} />
                    }
                </Dialog>
            </Portal>
        </View>
    )
}

export default Account

const styles = StyleSheet.create({
    container: { flex: 1 },
    heading: { fontSize: 17, marginTop: 20, marginLeft: 20 },
    div_1: { marginTop: 30, marginLeft: 20 },
    signoutButton: {
        marginTop: 30, width: "100%",
        height: 50, borderBottomWidth: 0.8,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20, flexDirection: "row"
    }
})