import React, { useContext } from 'react'
import { View, Platform, Linking } from "react-native"
import { useTheme, Text } from "react-native-paper"
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from "@expo/vector-icons"
import { AuthContext } from '../context/AuthContext'
import { LayoutContext } from "../context/LayoutContext"


const CustomDrawer = (props) => {

    const navigation = useNavigation()
    const { colors } = useTheme()
    const { state: authState } = useContext(AuthContext)
    const { state: layoutState, dispatch: layoutDispatch } = useContext(LayoutContext)

    return (
        <DrawerContentScrollView {...props}
            contentContainerStyle={{ paddingTop: 0, flex: 1, justifyContent: "space-between" }}
        >
            <View>
                <View style={{
                    backgroundColor: colors.myOwnColor,
                    height: Platform.OS === 'android' ? 55 : 60, alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>COOP Montreal</Text>
                </View>
                <DrawerItemList {...props} />
                {authState.phoneNo &&
                    <DrawerItem
                        onPress={() => {
                            Linking.openURL(`tel:${authState.phoneNo}`)
                        }}
                        label={({ focused }) =>
                            <View>
                                <Text style={{
                                    color: focused ? colors.myOwnColor : colors.dark,
                                    fontSize: focused ? 20 : 15,
                                    fontWeight: focused ? "700" : "600",
                                }}>Call us
                                </Text>
                                <Text>+15143475397</Text>
                            </View>}
                        icon={({ focused }) =>
                            <Ionicons name='call' size={focused ? 25 : 20}
                                color={focused ? colors.myOwnColor : colors.dark} />}
                        activeBackgroundColor={"#eeeeee"}
                        activeTintColor={colors.myOwnColor}
                        labelStyle={{ fontSize: 18, fontWeight: "700", letterSpacing: 1 }}
                        // focused={layoutState.isAccountFocused}
                        style={{
                            marginHorizontal: 0,
                            paddingHorizontal: 10,
                            borderRadius: 0
                        }}
                    />}
            </View>
            {authState.phoneNo &&
                <View style={{ borderTopWidth: 1, borderColor: colors.placeholder }}>
                    <Text style={{
                        marginBottom: 20,
                        marginLeft: 20,
                        paddingVertical: 10,
                        fontSize: 17
                    }}>{authState.user?.email || "dev@megataxi.com"}</Text>
                    <DrawerItem
                        onPress={() => {
                            navigation.navigate("Account")
                            layoutDispatch({ type: "CHANGE DRAWER LAYOUT", payload: true })
                        }}
                        label={({ focused }) =>
                            <Text style={{
                                color: focused ? colors.myOwnColor : colors.dark,
                                fontSize: focused ? 20 : 15,
                                fontWeight: focused ? "700" : "600",
                            }}>Account</Text>}
                        icon={({ focused }) =>
                            <Ionicons name='person-circle-outline' size={focused ? 25 : 20}
                                color={focused ? colors.myOwnColor : colors.dark} />}
                        activeBackgroundColor={"#eeeeee"}
                        activeTintColor={colors.myOwnColor}
                        labelStyle={{ fontSize: 18, fontWeight: "700", letterSpacing: 1 }}
                        focused={layoutState.isAccountFocused}
                        style={{
                            marginHorizontal: 0,
                            paddingHorizontal: 10,
                            borderRadius: 0
                        }}
                    />
                </View>}
        </DrawerContentScrollView>
    )
}

export default CustomDrawer