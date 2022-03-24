import React, { useContext, useState, useCallback, useEffect } from 'react'
import { InteractionManager, ScrollView, Alert, Platform, Linking, BackHandler } from 'react-native'
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import * as Location from 'expo-location'
import auth from '@react-native-firebase/auth';
import Loader from '../components/Loader'
import GetAddress from '../components/orderTaxi/GetAddress'
import GetOptions from '../components/orderTaxi/GetOptions'
import OrderButton from '../components/orderTaxi/OrderButton'
import { AuthContext } from '../context/AuthContext'
import { LayoutContext } from '../context/LayoutContext'
import Header from '../components/Header'
import { OrderContext } from '../context/OrderContext'
import { GOOGLE_PLACES_API_KEY } from '../config';
import { getOrder, getOrderConfig } from '../functions/order';

const OrderTaxi = () => {

    const navigation = useNavigation()
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext)
    const { dispatch: layoutDispatch } = useContext(LayoutContext)
    const { state: orderState, dispatch: orderDispatch } = useContext(OrderContext)

    const [estimation, setEstimation] = useState(null)
    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)


    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(async () => {
                try {
                    let location = await Location.getCurrentPositionAsync({});
                    authDispatch({ type: "SET LOCATION", payload: location.coords })
                } catch (error) {
                    console.error(error)
                    Alert.alert(
                        "Allow location",
                        "Location should be enabled in order to order Taxi",
                        [
                            { text: "Cancel", onPress: () => BackHandler.exitApp(), style: "cancel" },
                            { text: "OK", onPress: () => Linking.openSettings() }
                        ]
                    );
                }
                layoutDispatch({ type: "CHANGE DRAWER LAYOUT", payload: false })
                const { user, displayName, phoneNo } = authState
                if (user && displayName === null) {
                    navigation.navigate("Stack", { screen: "GetName" })
                } else if (user && phoneNo === null) {
                    navigation.navigate("Stack", { screen: "GetPhone" })
                }
                setDidFinishInitialAnimation(true)
            })
            return () => task.cancel()
        }, [authState?.phoneNo, authState?.displayName]))

    const measureDistance = useCallback(() => {
        (async () => {
            const { orderConfig } = orderState
            let estimation = null

            if (orderState.addressFrom && orderState.addressTo) {
                const { addressFrom, addressTo } = orderState
                try {
                    const headers = { 'Content-Type': 'application/json' };
                    const config = { method: 'GET', headers };
                    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:${addressFrom.id}&destinations=place_id:${addressTo.id}&key=${GOOGLE_PLACES_API_KEY}`
                    const response = await fetch(url, config)
                    const data = await response.json()
                    const { distance, duration } = data.rows[0].elements[0]

                    const distanceCost = orderConfig.distanceCost * distance.value / orderConfig.distanceMeters
                    const timeCost = orderConfig.timeCost * duration.value * orderConfig.timeCoefficient / orderConfig.timeSeconds
                    const totalEstimatedCost = orderConfig.fixed + distanceCost + timeCost

                    estimation = {
                        distanceCost,
                        fixedCost: orderConfig.fixed,
                        timeCost,
                        totalDistance: distance.value,
                        totalDistanceKm: distance.text,
                        totalDuration: duration.value,
                        totalDurationHumanized: duration.text,
                        totalEstimatedCost,
                        totalEstimatedCostMax: totalEstimatedCost * 0.92,
                        totalEstimatedCostMin: totalEstimatedCost * 1.07
                    }
                } catch (error) {
                    console.error(error);
                }
            } else if (orderState.addressFrom) {

                const distanceCost = orderConfig.distanceCost * 1000 / orderConfig.distanceMeters
                const timeCost = orderConfig.timeCost * 180 * orderConfig.timeCoefficient / orderConfig.timeSeconds
                const totalEstimatedCost = orderConfig.fixed + distanceCost + timeCost

                estimation = {
                    distanceCost,
                    fixedCost: orderConfig.fixed,
                    timeCost,
                    totalDistance: 1000,
                    totalDistanceKm: "1 Km",
                    totalDuration: 180,
                    totalDurationHumanized: "3 Min",
                    totalEstimatedCost,
                    totalEstimatedCostMax: totalEstimatedCost * 0.92,
                    totalEstimatedCostMin: totalEstimatedCost * 1.07
                }
            }
            setEstimation(estimation)
        })()
    }, [orderState?.addressFrom, orderState?.addressTo])

    useEffect(() => {
        measureDistance()
    }, [orderState?.addressFrom, orderState?.addressTo]);

    useEffect(() => {
        (async () => {
            if (auth().currentUser && auth().currentUser.phoneNumber) {
                let { orderArr, addressArr } = await getOrder()
                const orderConfig = await getOrderConfig()
                orderDispatch({ type: "SET ORDER LIST", payload: { orderArr, addressArr } })
                orderDispatch({ type: "SET ORDER CONFIG", payload: orderConfig })
            }
        })()
    }, [auth().currentUser])


    if (!didFinishInitialAnimation) { return <Loader /> }

    return (
        <ScrollView keyboardDismissMode='none' contentContainerStyle={{ flex: 1 }}>
            {Platform.OS === "ios" && <Header title={"Order Taxi"} />}
            <GetAddress />
            <GetOptions />
            <OrderButton estimation={estimation} />
        </ScrollView>
    )
}

export default OrderTaxi