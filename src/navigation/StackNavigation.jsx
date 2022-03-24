import React, { useContext } from 'react'
import { TouchableOpacity, Platform } from "react-native"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from "@react-navigation/native"
import { useTheme, Text } from "react-native-paper"
import Signup from '../screens/Signup';
import ForgotPass from '../screens/ForgotPass';
import PrivecyPolicy from '../screens/PrivecyPolicy';
import GetName from '../screens/GetName';
import GetPhone from '../screens/GetPhone';
import ValidatePhone from '../screens/ValidatePhone';
import Map from '../screens/Map';
import SelectPayment from '../screens/SelectPayment';
import SelectVehicle from '../screens/SelectVehicle';
import MoreOptions from '../screens/MoreOptions';
import { signoutUser } from "../functions/auth"
import { AuthContext } from '../context/AuthContext'
import TrackOrder from '../screens/TrackOrder';


const Stack = createNativeStackNavigator()

const StackNavigation = () => {

    const { colors } = useTheme()
    const navigation = useNavigation()
    const { dispatch: authDispatch } = useContext(AuthContext)

    return (
        <Stack.Navigator screenOptions={{
            headerShown: Platform.OS === "ios" ? false : true,
            headerStyle: { backgroundColor: colors.myOwnColor },
            headerTintColor: colors.primary
        }}>
            <Stack.Screen name='Sign up' component={Signup} />
            <Stack.Screen name="GetName" component={GetName}
                options={{
                    title: "Account Configuration",
                    headerShown: true,
                    headerBackVisible: false,
                    headerRight: () =>
                        <TouchableOpacity onPress={() => signoutUser(navigation, authDispatch)}>
                            <Text style={{
                                color: colors.primary,
                                fontWeight: "700", fontSize: 17,
                                letterSpacing: 1
                            }}>Sign Out</Text>
                        </TouchableOpacity>
                }} />
            <Stack.Screen name="GetPhone" component={GetPhone}
                options={{
                    title: "Account Configuration",
                    headerShown: true,
                    // headerRight: () =>
                    //     <TouchableOpacity onPress={() => signoutUser(navigation, authDispatch)}>
                    //         <Text style={{
                    //             color: colors.primary,
                    //             fontWeight: "700", fontSize: 17,
                    //             letterSpacing: 1
                    //         }}>Sign Out</Text>
                    //     </TouchableOpacity>
                }} />
            <Stack.Screen name="ValidatePhone" component={ValidatePhone}
                options={{
                    title: "Account Configuration",
                    headerShown: true,
                }} />
            <Stack.Screen name='Forgot Password' options={{ title: "Forgot Password ?" }} component={ForgotPass} />
            <Stack.Screen name="Address From" options={{
                title: "Search 'from' address",
                headerShown: false
            }} component={Map} />
            <Stack.Screen name="Address To" options={{
                title: "Search 'to' address",
                headerShown: false
            }} component={Map} />
            <Stack.Screen name="Track Order" options={{ headerShown: false }}
                component={TrackOrder} />
            <Stack.Screen name="Payment" options={{ title: "Preferred payment tmethod" }} component={SelectPayment} />
            <Stack.Screen name="Vehicle" options={{ title: "Select Vehicle" }} component={SelectVehicle} />
            <Stack.Screen name="More Options" component={MoreOptions} />
            <Stack.Screen name='Privecy Policy'
                options={{ title: "COOP Monteral - Privecy policy" }}
                component={PrivecyPolicy} />
        </Stack.Navigator>
    )
}

export default StackNavigation