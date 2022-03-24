import {
    View, InteractionManager, Image,
    StyleSheet, TouchableOpacity, Dimensions,
    Platform
} from 'react-native'
import React, { useRef, useCallback, useState, useContext, useEffect } from 'react'
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useTheme, Text } from 'react-native-paper';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import Loader from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import marker from "../../assets/img/user-pointer.png"
import carMarker from "../../assets/img/taxi-pointer2.png"
import { getSingleOrder, cancelOrder } from '../functions/order';

const { width } = Dimensions.get('window')

const Header = ({ orderStatus }) => {
    const { colors } = useTheme()
    const navigation = useNavigation()
    return (
        <View style={{
            ...styles.headerContainer,
            backgroundColor: colors.myOwnColor
        }}>
            <View style={styles.div_1}>
                <Text style={{ color: colors.primary, ...styles.text }}>
                    {orderStatus}
                </Text>
            </View>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                <Text style={{
                    color: colors.primary,
                    fontWeight: "700", fontSize: 17,
                    letterSpacing: 1, marginRight: 10
                }}>Cancel</Text>
                <FontAwesome name="minus-circle" size={20} color={colors.primary} />
            </TouchableOpacity>
        </View>
    )
}

const TrackOrder = () => {

    const { colors } = useTheme()
    const { params: { id } } = useRoute()
    const mapRef = useRef(null)
    const markerRef = useRef(null)
    const { state: authState } = useContext(AuthContext)
    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)
    const [camera, setCamera] = useState(null)
    const [singleOrder, setSingleOrder] = useState(null)
    const [polyLine, setPolyLine] = useState([])

    const goTomyLocation = useCallback(() => {
        mapRef.current.animateCamera(camera, { duration: 3000 })
    }, [camera])

    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(() => {
                getSingleOrder(id, setSingleOrder, setPolyLine)
                setDidFinishInitialAnimation(true)
            })
            return () => task.cancel()
        }, [])
    )

    useEffect(() => {
        if (singleOrder) {
            const { accuracy, altitude, altitudeAccuracy,
                heading, speed } = authState.location
            setCamera({
                center: {
                    latitude: singleOrder.addressFrom.lat,
                    longitude: singleOrder.addressFrom.lng
                },
                zoom: 15,
                heading,
                pitch: 10,
                altitude,
                accuracy,
                altitudeAccuracy,
                speed
            })
        }
    }, [singleOrder])

    useEffect(() => {
        getSingleOrder(id, setSingleOrder, setPolyLine)
        // return () => cancelOrder(id)
    }, [id])

    if (!didFinishInitialAnimation) { return <Loader /> }

    return (
        <View style={styles.container}>
            {singleOrder &&
                <Header orderId={id} orderStatus={singleOrder.status} />
            }
            {camera && camera.center.latitude && camera.center.longitude &&
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
                    >
                        <Marker
                            ref={markerRef}
                            coordinate={{
                                latitude: camera.center.latitude,
                                longitude: camera.center.longitude,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            draggable={false}
                        >
                            <Image source={marker} style={{ width: 30, height: 30 }} />
                        </Marker>
                        <Marker
                            coordinate={{
                                latitude: singleOrder.vehicle.lat,
                                longitude: singleOrder.vehicle.lng,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            draggable={false}
                        >
                            <Image source={carMarker} style={{ width: 30, height: 30 }} />
                        </Marker>
                        {polyLine.length > 0 &&
                            <Polyline
                                coordinates={polyLine}
                                strokeColor={colors.myOwnColor}
                                strokeColors={[colors.myOwnColor, '#7F0000']}
                                strokeWidth={10}
                                geodesic={true}
                            />
                        }
                    </MapView>
                    <TouchableOpacity style={styles.setmyLocation}
                        onPress={goTomyLocation}>
                        <Ionicons name='locate' color="#424242" size={25} />
                    </TouchableOpacity>
                </View>
            }
            {singleOrder &&
                <View style={[styles.bottomView, { backgroundColor: colors.primary }]}>
                    <Image source={{
                        uri: singleOrder.driverInfo.imageUrl
                    }} style={{ width: 50, height: 50, borderRadius: 10 }} />
                    <View style={{ marginLeft: 10 }}>
                        <Text>{singleOrder.driverInfo.name}</Text>
                        <Text>{singleOrder.driverInfo.email}</Text>
                    </View>
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
    container: { flex: 1 },
    headerContainer: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        height: 60,
        width: "100%"
    },
    text: {
        fontSize: 22,
        fontWeight: "600"
    },
    div_1: {
        marginLeft: 10, flexDirection: 'row',
        alignItems: 'center'
    },
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
    bottomView: {
        flexDirection: "row",
        position: "relative",
        width,
        height: 80,
        paddingHorizontal: 20,
        alignItems: "flex-start",
        elevation: 5,
        paddingVertical: 10,
    },
})

export default TrackOrder