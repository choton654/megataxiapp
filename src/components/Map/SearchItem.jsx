import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Ionicons } from "@expo/vector-icons"
import { OrderContext } from '../../context/OrderContext';
import { useRoute } from '@react-navigation/native';
import { getLocationFromPlaceId } from '../../functions/order';

const SearchItem = ({ item, colors, setNewCoords, setIsSearchPopUp, setisMapmovementFix }) => {
    const route = useRoute()
    const { dispatch: authDispatch } = useContext(AuthContext)
    const { dispatch: orderDispatch } = useContext(OrderContext)

    const locationFrom = useCallback(() => {
        getLocationFromPlaceId(
            item.place_id,
            item,
            route,
            orderDispatch,
            setIsSearchPopUp,
            setNewCoords,
            setisMapmovementFix)
        authDispatch({ type: "SET FORMATTED ADDRESS", payload: [] })
    }, [])

    return (
        <TouchableOpacity style={styles.address} onPress={locationFrom}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "95%" }}>
                <Ionicons name='location-outline' size={20} color={colors.myOwnColor} />
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 17 }}>{item.locationName}</Text>
                    <Text>{item.address}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    address: {
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingBottom: 10,
        borderBottomWidth: 0.8,
        borderBottomColor: "#bdbdbd"
    }
})


export default SearchItem