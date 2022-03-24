import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons"
import { useTheme } from "react-native-paper"
import { useRoute, useNavigation, DrawerActions } from '@react-navigation/native'


const Header = ({ title }) => {

    const { colors } = useTheme()
    const navigation = useNavigation()
    const { name } = useRoute()

    return (
        <View style={{
            backgroundColor: colors.myOwnColor,
            ...styles.container
        }}>
            <View style={styles.div_1}>
                {name === "Order Taxi" || name === "Sign In" ?
                    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                        <MaterialCommunityIcons name='menu' color={colors.primary} size={25} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name='arrowleft' color={colors.primary} size={25} />
                    </TouchableOpacity>
                }
                <Text style={{ color: colors.primary, ...styles.text }}>
                    {title}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        justifyContent: "center",
        height: 60,
    },
    text: {
        fontSize: 20, marginLeft: 25,
        fontWeight: "700"
    },
    div_1: {
        marginLeft: 10, flexDirection: 'row',
        alignItems: 'center'
    }
})

export default Header