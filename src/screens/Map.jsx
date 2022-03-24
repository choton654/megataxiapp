import {
    View, StyleSheet, InteractionManager, FlatList,
    TouchableOpacity, Dimensions, Image, Platform,
    ToastAndroid
} from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useFocusEffect } from "@react-navigation/native"
import { Text, useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import Loader from '../components/Loader';
import marker from "../../assets/img/map-pin-icon.png"
import MapView, { Marker } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import MapHeader from '../components/Map/MapHeader';
import SearchItem from '../components/Map/SearchItem'
import { GOOGLE_PLACES_API_KEY } from '../config'
import { getLocationFromPlaceId } from '../functions/order'

const { width, height } = Dimensions.get('window')


const Map = () => {

    const { colors } = useTheme()
    const route = useRoute()
    const navigation = useNavigation()
    const mapRef = useRef(null)
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext)
    const { state: orderState, dispatch: orderDispatch } = useContext(OrderContext)
    const [camera, setCamera] = useState(null)
    const [newCoords, setNewCoords] = useState(null)
    const [isDisabled, setisDisabled] = useState(true)
    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)
    const [isSearchPopUp, setIsSearchPopUp] = useState(false)
    const [isMapmovementFix, setisMapmovementFix] = useState(true)

    const renderItem = useCallback(({ item }) =>
        <SearchItem
            item={item}
            colors={colors}
            setNewCoords={setNewCoords}
            setIsSearchPopUp={setIsSearchPopUp}
            setisMapmovementFix={setisMapmovementFix} />,
        [])

    const renderItem2 = useCallback(({ item }) =>
        <SearchItem
            item={item}
            colors={colors}
            setNewCoords={setNewCoords}
            setIsSearchPopUp={setIsSearchPopUp}
            setisMapmovementFix={setisMapmovementFix} />,
        [])

    const goTomyLocation = useCallback(() => {
        const camera = {
            ...camera, center: {
                latitude: authState.location.latitude,
                longitude: authState.location.longitude
            }
        }
        mapRef.current.animateCamera(camera, { duration: 3000 })
    }, [camera])

    const getGeoCodeData = async (region, isGesture) => {
        const { latitude, longitude } = region
        const headers = { 'Content-Type': 'application/json' };
        const config = { method: 'GET', headers };
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_PLACES_API_KEY}`
        const response = await fetch(url, config)
        const data = await response.json()
        // console.log("geoCoding result", data.results[0].address_components)
        const { place_id, formatted_address, address_components } = data.results[0]
        const locationName = address_components.find(address => address.types.includes("locality")).long_name
        const item = { address: formatted_address, locationName }
        setisMapmovementFix(false)
        getLocationFromPlaceId(
            place_id,
            item,
            route,
            orderDispatch,
            undefined,
            setNewCoords,
            undefined
        )
    }

    const changeRegion = useCallback((region, { isGesture }) => {
        if (isGesture && authState.phoneNo) {
            getGeoCodeData(region, isGesture)
        }
    }, [orderState.isRegionChange])

    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {

                if (authState.phoneNo && authState.location) { setisDisabled(false) }

                // getting location data
                const { accuracy, altitude, altitudeAccuracy,
                    heading, latitude, longitude, speed } = authState.location

                if (route.name === "Address From" && orderState.addressFrom) {
                    setCamera({
                        center: {
                            latitude: orderState.addressFrom.lat,
                            longitude: orderState.addressFrom.lng
                        },
                        zoom: 15,
                        heading,
                        pitch: 10,
                        altitude,
                        accuracy,
                        altitudeAccuracy,
                        speed
                    })
                } else if (route.name === "Address To" && orderState.addressTo) {
                    setCamera({
                        center: {
                            latitude: orderState.addressTo.lat,
                            longitude: orderState.addressTo.lng
                        },
                        zoom: 15,
                        heading,
                        pitch: 10,
                        altitude,
                        accuracy,
                        altitudeAccuracy,
                        speed
                    })
                } else {
                    setCamera({
                        center: { latitude, longitude },
                        zoom: 15,
                        heading,
                        pitch: 10,
                        altitude,
                        accuracy,
                        altitudeAccuracy,
                        speed
                    })
                }
                setDidFinishInitialAnimation(true)
            })
            return () => task.cancel()
        }, [])
    )

    useEffect(() => {
        if (orderState.searchBarText.trim().length <= 3) {
            authDispatch({ type: "SET FORMATTED ADDRESS", payload: [] })
        } else if (orderState.addressList.length > 0) {
            setIsSearchPopUp(true)
        }
    }, [orderState.searchBarText, authState.formattedAddressList.length])

    useEffect(() => {
        if (newCoords && mapRef && isMapmovementFix) {
            const locObj = {
                ...camera,
                center: { latitude: newCoords.lat, longitude: newCoords.lng },
            }
            mapRef.current.animateCamera(locObj, { duration: 3000 })
        }
    }, [newCoords, isMapmovementFix])

    if (!didFinishInitialAnimation) { return <Loader /> }

    return (
        <View style={styles.container}>
            <MapHeader setIsSearchPopUp={setIsSearchPopUp} />
            {authState.location ?
                <View style={{ flex: 1 }}>
                    <MapView
                        ref={mapRef}
                        style={{ flex: 1 }}
                        provider='google'
                        initialRegion={{
                            latitude: camera.center.latitude,
                            longitude: camera.center.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        showsUserLocation={true}
                        onRegionChangeComplete={changeRegion}
                    />
                    <TouchableOpacity style={styles.setmyLocation}
                        onPress={goTomyLocation}>
                        <Ionicons name='locate' color="#424242" size={25} />
                    </TouchableOpacity>
                    <Image source={marker} style={{
                        width: 30, height: 30,
                        position: "absolute", top: "45%", right: "45%"
                    }} />
                </View>
                :
                <MapView
                    ref={mapRef}
                    style={{ flex: 1 }}
                    provider='google' />
            }
            <View style={[styles.bottomView, { backgroundColor: colors.primary }]}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#424242" }}>
                    {route.name === "Address From" ? "Is this your location?" : "Where are you going?"}
                </Text>
                {authState.phoneNo && authState.location ?
                    route.name === "Address From" ?
                        <Text style={{ marginTop: 5 }}>{orderState.addressFrom?.title || "Drag your marker to select location"}</Text> :
                        <Text style={{ marginTop: 5 }}>{orderState.addressTo?.title || "Drag your marker to select location"}</Text> :
                    <Text>Sign in to select your search location</Text>
                }
                <TouchableOpacity style={[styles.button, {
                    opacity: isDisabled ? 0.7 : 1,
                    backgroundColor: isDisabled ? "#fca5a5" : colors.button,
                }]}
                    disabled={isDisabled}
                    onPress={() => {
                        if (!isDisabled && (orderState.addressFrom || orderState.addressTo)) {
                            navigation.goBack()
                        } else {
                            ToastAndroid.showWithGravity(
                                `Opps!! You need to select address`,
                                ToastAndroid.LONG,
                                ToastAndroid.CENTER
                            )
                        }
                    }}>
                    <Ionicons name='checkmark' color={colors.primary} size={30} />
                </TouchableOpacity>
            </View>
            {
                isSearchPopUp &&
                <View style={styles.searchBox}>
                    {authState.formattedAddressList.length > 0 &&
                        <View>
                            <View style={{
                                paddingHorizontal: 10, height: 40,
                                backgroundColor: colors.light,
                                borderBottomWidth: 1, borderBottomColor: colors.placeholder
                            }}>
                                <Text style={{ marginTop: 10 }}>Search Results</Text>
                            </View>
                            <FlatList
                                data={authState.formattedAddressList}
                                renderItem={renderItem}
                                keyExtractor={(_, idx) => idx}
                                showsVerticalScrollIndicator={false}
                                style={{ height: height * 0.3 }}
                            />
                        </View>
                    }
                    {orderState.addressList.length > 0 &&
                        <View>
                            <View style={{
                                paddingHorizontal: 10, height: 40,
                                backgroundColor: colors.light,
                                borderBottomWidth: 1, borderBottomColor: colors.placeholder
                            }}>
                                <Text style={{ marginTop: 10 }}>Recent</Text>
                            </View>
                            <FlatList
                                data={orderState.addressList}
                                renderItem={renderItem2}
                                keyExtractor={(_, idx) => idx}
                                showsVerticalScrollIndicator={false}
                                style={{ height: height * 0.3 }}
                            />
                        </View>
                    }
                </View>
            }
            {
                Platform.OS === 'ios' &&
                <View style={{ height: 30, backgroundColor: "#fff" }} />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, position: "relative" },
    setmyLocation: {
        position: "absolute",
        top: 15, right: 15,
        width: 32, height: 32,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
        backgroundColor: "#fff",
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: "#bdbdbd",
    },
    searchBox: {
        position: "absolute",
        top: 60,
        left: 10,
        width: "95%",
        elevation: 3,
        borderRadius: 5,
        backgroundColor: colors.primary
    },
    bottomView: {
        position: "relative",
        width,
        height: 80,
        paddingHorizontal: 20,
        alignItems: "flex-start",
        justifyContent: "space-evenly",
        elevation: 5,
        paddingVertical: 10,
    },
    button: {
        width: 50, height: 50,
        position: "absolute", right: 20, top: -20, borderRadius: 25,
        elevation: 3, alignItems: "center", justifyContent: "center"
    },
})

export default Map


// marker unused code 
// const markerRef = useRef(null)
{/* <Marker
                            ref={markerRef}
                            coordinate={{
                                latitude: camera.center.latitude,
                                longitude: camera.center.longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            draggable
                            onDragStart={({ nativeEvent: { coordinate: { latitude, longitude } } }) => {
                                ToastAndroid.showWithGravity(
                                    `You are moving from ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
                                    ToastAndroid.SHORT,
                                    ToastAndroid.CENTER
                                );
                            }}
                            onDragEnd={({ nativeEvent: { coordinate: { latitude, longitude } } }) => {
                                ToastAndroid.showWithGravity(
                                    `You have landed in ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
                                    ToastAndroid.SHORT,
                                    ToastAndroid.CENTER
                                );
                            }}
                        >
                            <Image source={marker} style={{ width: 30, height: 30 }} />
                        </Marker>
                        {newCoords &&
                            <Marker
                                coordinate={{
                                    latitude: newCoords.lat,
                                    longitude: newCoords.lng,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                                draggable
                            />
                        } */}