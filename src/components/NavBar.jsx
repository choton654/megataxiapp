import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { useNavigation, DrawerActions } from "@react-navigation/native"

const { width } = Dimensions.get('window')

const NavBar = () => {

    const navigation = useNavigation()

    return (
        <View style={{ height: 40, width, backgroundColor: "#f59e0b" }}>
            <Text
                style={{ fontWeight: "600", color: "#fff" }}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>NavBar</Text>
        </View>
    )
}

export default NavBar