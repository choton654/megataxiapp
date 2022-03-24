import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { Divider, Text, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'


const UserInfo = ({ info, infoType, setEditInfo }) => {

    const navigation = useNavigation()
    const { colors } = useTheme()

    const userInfoPress = () => {
        if (infoType === "phoneNumber") {
            navigation.navigate("Stack", { screen: "GetPhone" })
        } else if (infoType === "displayName") {
            setEditInfo("displayName")
        } else if (infoType === "changePassword") {
            setEditInfo("changePassword")
        }
    }

    return (
        <TouchableOpacity style={styles.div_2}
            onPress={userInfoPress}
        >
            <Text style={styles.subheading}>
                {infoType === "displayName" ? "Name" :
                    infoType === "phoneNumber" ? "Phone" :
                        infoType === "email" ? "Email" :
                            "Password"}
            </Text>
            <Text style={styles.infoText}>{info}</Text>
            {infoType !== "changePassword" &&
                <Divider style={[styles.divider, { borderColor: colors.placeholder }]} />
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    subheading: { fontWeight: "600", marginBottom: 3, fontSize: 16 },
    infoText: { fontSize: 15 },
    divider: {
        width: "100%", marginTop: 15,
        borderWidth: 0.5
    },
    div_2: { marginTop: 10 }
})

export default UserInfo