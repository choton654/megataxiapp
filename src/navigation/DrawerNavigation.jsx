import React, { useContext, Fragment } from 'react'
import { Platform } from "react-native"
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme, Text } from "react-native-paper"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import Signin from '../screens/Signin';
import OrderTaxi from '../screens/OrderTaxi';
import Account from "../screens/Account";
import OrderList from '../screens/OrderList';
import CustomDrawer from '../components/CustomDrawer';
import { drawerOptions } from '../utils/drawerOptions';
import { AuthContext } from '../context/AuthContext';

const Drawer = createDrawerNavigator()

const DrawerNavigation = () => {

    const { colors } = useTheme()
    const { state: authState } = useContext(AuthContext);
    // console.log("phoneNumber", authState.phoneNo);

    return (
        <Drawer.Navigator initialRouteName='Order Taxi'
            screenOptions={{
                headerShown: Platform.OS === "ios" ? false : true,
                headerStyle: { backgroundColor: colors.myOwnColor },
                headerTintColor: "#fff"
            }}
            drawerContent={(props) => <CustomDrawer {...props} />}
            edgeWidth={100}
        >
            <Drawer.Screen name='Order Taxi'
                options={{
                    drawerLabel: ({ focused }) =>
                        <Text style={{
                            color: focused ? colors.myOwnColor : colors.dark,
                            fontSize: focused ? 20 : 15,
                            fontWeight: focused ? "700" : "600",
                        }}>Order Taxi</Text>,
                    drawerIcon: ({ focused }) =>
                        <Ionicons name='location' size={focused ? 25 : 20}
                            color={focused ? colors.myOwnColor : colors.dark} />,
                    ...drawerOptions,
                }}
                component={OrderTaxi} />
            {authState.phoneNo ?
                <Fragment>
                    <Drawer.Screen name='Order List'
                        options={{
                            drawerLabel: ({ focused }) =>
                                <Text style={{
                                    color: focused ? colors.myOwnColor : colors.dark,
                                    fontSize: focused ? 20 : 15,
                                    fontWeight: focused ? "700" : "600",
                                }}>Your Orders</Text>,
                            drawerIcon: ({ focused }) =>
                                <Ionicons name='checkmark-circle' size={focused ? 25 : 20}
                                    color={focused ? colors.myOwnColor : colors.dark} />,
                            ...drawerOptions,
                        }}
                        component={OrderList} />
                    <Drawer.Screen name='Account'
                        options={{ drawerItemStyle: { display: "none" } }}
                        component={Account}
                    />
                </Fragment>
                :
                <Drawer.Screen name='Sign In'
                    options={{
                        headerTitle: "COOP Montreal - Sign in",
                        drawerLabel: ({ focused }) =>
                            <Text style={{
                                color: focused ? colors.myOwnColor : colors.dark,
                                fontSize: focused ? 20 : 15,
                                fontWeight: focused ? "700" : "600",
                            }}>Sign in</Text>,
                        drawerIcon: ({ focused }) =>
                            <MaterialCommunityIcons name='login' size={focused ? 25 : 20}
                                color={focused ? colors.myOwnColor : colors.dark} />,
                        ...drawerOptions
                    }}
                    component={Signin} />
            }
        </Drawer.Navigator>
    )
}

export default DrawerNavigation