import { View, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { Text, Searchbar, useTheme } from 'react-native-paper'
import { AntDesign } from "@expo/vector-icons"
import { AuthContext } from '../../context/AuthContext';
import { OrderContext } from '../../context/OrderContext';
import { GOOGLE_PLACES_API_KEY } from '../../config';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

const MapHeader = ({ setIsSearchPopUp }) => {

    const navigation = useNavigation()
    const route = useRoute()
    const { colors } = useTheme()

    const { state: authState, dispatch: authDispatch } = useContext(AuthContext)
    const { state: orderState, dispatch: orderDispatch } = useContext(OrderContext)
    const [isFetching, setIsFetching] = useState(false)

    // const { latitude, longitude } = authState.location

    const onChangeSearch = async query => {
        const headers = { 'Content-Type': 'application/json' };
        const config = { method: 'GET', headers };
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&components=country:in&location=${authState.location?.latitude},${authState.location?.longitude}&radius=10000&types=address&key=${GOOGLE_PLACES_API_KEY}`
        orderDispatch({ type: "SET SEARCHBAR TEXT", payload: query })
        if (query.trim().length > 3) {
            try {
                setIsFetching(true)
                const response = await fetch(url, config)
                const data = await response.json()
                // console.log("data", data.predictions[0]);
                if (data.predictions.length > 0) {
                    const formattedAddress = data.predictions.map(d => ({
                        address: d.description,
                        locationName: d.structured_formatting.main_text,
                        place_id: d.place_id,
                    }))
                    authDispatch({ type: "SET FORMATTED ADDRESS", payload: formattedAddress })
                }
                setIsFetching(false)
            } catch (error) {
                console.log(error)
                setIsFetching(false)
            }
        }
    };

    return (
        <View style={{
            ...styles.container,
            backgroundColor: colors.myOwnColor
        }}>
            {authState.phoneNo && authState.location ?
                <Searchbar
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={orderState.searchBarText}
                    icon={orderState.searchBarText.trim() === '' ?
                        "arrow-left" : isFetching ? "reload" : "map-search-outline"}
                    selectionColor={colors.myOwnColor}
                    onFocus={() => setIsSearchPopUp(true)}
                    onIconPress={() => {
                        if (orderState.searchBarText.trim() === '') {
                            orderDispatch({ type: "SET SEARCHBAR TEXT", payload: '' })
                            authDispatch({ type: "SET FORMATTED ADDRESS", payload: [] })
                            setIsSearchPopUp(false)
                            navigation.goBack()
                        }
                    }}
                />
                :
                <View style={styles.div_1}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name='arrowleft' color={colors.primary} size={25} />
                    </TouchableOpacity>
                    <Text style={{ color: colors.primary, ...styles.text }}>
                        {route.name === "Address From" ? "Search 'from' address" : "Search 'to' address"}
                    </Text>
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        justifyContent: "center",
        height: 60,
        width: "100%"
    },
    text: {
        fontSize: 22, marginLeft: 25,
        fontWeight: "600"
    },
    div_1: {
        marginLeft: 10, flexDirection: 'row',
        alignItems: 'center'
    }
})

export default MapHeader

        // textSearch
        // const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${authState.location?.latitude},${authState.location?.longitude}&radius=10000&region=in&key=${GOOGLE_PLACES_API_KEY}`;


   // if (data.results.length > 0) {
                //     const formattedAddress = data.results.map(d => ({
                //         address: d.formatted_address,
                //         locationName: d.name,
                //         place_id: d.place_id,
                //         coords: d.geometry.location
                //     }))
                //     authDispatch({ type: "SET FORMATTED ADDRESS", payload: formattedAddress })
                // }

  // if (authState.phoneNo) {
    //     return (
    //         <View style={{
    //             padding: 10,
    //             position: "absolute",
    //             top: 0,
    //             left: 0,
    //             width: "100%",
    //         }}>
    //             <GooglePlacesAutocomplete
    //                 placeholder="Search"
    //                 query={{
    //                     key: GOOGLE_PLACES_API_KEY,
    //                     language: 'en', // language of the results
    //                 }}
    //                 onPress={(data, details = null) => console.log(data)}
    //                 onFail={(error) => console.error(error)}
    //             />
    //         </View>
    //     )
    // }