import { View, TouchableOpacity, StyleSheet, Alert, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useContext, useCallback, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTheme, Text, Portal, Dialog, Button } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import { OrderContext } from '../../context/OrderContext'
// import { AuthContext } from '../../context/AuthContext'
import auth from '@react-native-firebase/auth';
import { createOrder } from '../../functions/order'

const OrderButton = ({ estimation }) => {

    const navigation = useNavigation()
    const { colors } = useTheme()
    // const { state: authState } = useContext(AuthContext)
    const { state: orderState, dispatch: orderDispatch } = useContext(OrderContext)
    const { isCardoorOpen, isCarBoost } = orderState.moreOptions
    const { addressFrom, addressTo } = orderState

    const [isLoading, setIsLoading] = useState(false)
    const [visible, setVisible] = useState(false)
    const [orderObj, setOrderObj] = useState(null)

    const orderTaxi = useCallback(
        () => {
            if (auth().currentUser && auth().currentUser.phoneNumber) {
                if (addressFrom && estimation) {
                    const orderObj = {
                        addressFrom,
                        addressTo,
                        callbackId: Date.now(),
                        carOnSiteSms: false,
                        createdAt: Date.now(),
                        discount: 0.1,
                        estimation,
                        driverInfo: {
                            _key: "368",
                            email: "osman.mihab@gmail.com",
                            firstName: "Mihab",
                            gst: "126555382RT0001",
                            id: "368",
                            imagePath: "drv/368",
                            imageUrl: "https://firebasestorage.googleapis.com/v0/b/firebase-mtapi.appspot.com/o/drv%2F368?alt=media&token=7eac66fc-b3ea-4c53-9f6d-5f26e50c3235",
                            lastName: "Osman",
                            name: "Mihab Osman",
                            photo: "http://taxicoopmtl.ddns.fraxion.com:8081/Webservice_Repartition/Service_Repartition//v1/chauffeur/368/photo",
                            pocketNumber: "433497",
                            qst: "1013097085TQ0001"
                        },
                        lang: "en",
                        numPassengers: 1,
                        passengerInfo: {
                            email: auth().currentUser.email,
                            name: auth().currentUser.displayName,
                            phone: auth().currentUser.phoneNumber
                        },
                        poly: "savtGzpz`MMTQ\\S^OXINCB@@?@OZOZWb@[f@]p@_@r@a@v@c@v@a@v@c@v@c@t@c@v@_@t@Ur@Qr@Un@Yp@]n@[l@Ub@ORKNCF@AIRO\\Ub@Yf@_@n@a@t@e@v@a@v@c@t@a@t@c@t@a@t@c@v@c@v@c@v@c@t@c@r@_@t@a@t@a@v@a@r@c@p@eAnBa@t@a@t@a@t@a@p@i@l@o@`@s@Ts@Hu@Du@Dw@Dy@Dw@Bw@Ds@Lo@Tg@\\e@f@a@n@[h@SXKNIBC?QF[K][e@e@i@i@m@k@m@k@o@m@m@m@o@q@o@s@o@w@q@{@cBgCo@eAq@eAm@cAm@aAk@}@i@}@a@eA_@oA_@mAa@mAa@kAe@iAi@iAi@cAi@cAi@eAg@gAk@gAi@iAg@gAc@cAc@eAe@eAc@gAa@gAa@}@[s@Wm@[w@Yy@]s@So@Q[UAIJc@n@_@j@a@t@i@z@g@x@c@|@a@t@Yh@S`@Sd@Wh@]j@]l@_@n@]f@WZGNA??@EJKPSb@Wd@Wb@Yj@[r@]p@]n@_@n@_@p@_@l@Yh@k@z@SZOLGAIGIO@?A?",
                        status: "CAR_ON_ROAD",
                        statusLog: {
                            1647925651894: "NEW",
                            1647925658170: "CAR_SUBMITTED",
                            1647925695692: "CAR_ON_ROAD",
                            1647924826275: "PROCESSING",
                            1647925340553: "CLIENT_ON_BOARD",
                            1647925885652: "COMPLETED"
                        },
                        vehicle: {
                            id: "2535",
                            lat: 45.51555,
                            lng: -73.57622
                        },
                        vehicleInfo: {
                            category: "Auto",
                            color: "GRISE",
                            id: 2535,
                            model: "Sonata",
                            numberPlate: "FRC7518-4",
                            vehicleNumber: "2535",
                            year: "2015"
                        },
                        rateOrderSms: false,
                        review: {
                            rateRideQuestion: 5
                        },
                        status: "NEW",
                        uid: auth().currentUser.uid
                    }
                    setOrderObj(orderObj)
                    setVisible(true)
                } else if (!addressFrom) {
                    ToastAndroid.showWithGravity(
                        `Opps!! 'Address From' is missing`,
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER
                    )
                }
            } else {
                Alert.alert(
                    "Sign In",
                    "Sign in to order taxi",
                    [
                        {
                            text: "No",
                            onPress: () => console.log("Ask me later pressed"),
                            style: "destructive"
                        },
                        {
                            text: "Yes",
                            onPress: () => navigation.navigate("Drawer", { screen: "Sign In" }),
                            style: "cancel"
                        },
                    ]
                )
            }
        },
        [addressFrom, addressTo, estimation],
    )


    return (
        <View>
            <TouchableOpacity style={[styles.button,
            { backgroundColor: colors.button, opacity: isLoading ? 0.7 : 1 }]}
                onPress={orderTaxi}
                disabled={isLoading}
            >
                {isLoading ?
                    <ActivityIndicator size={30} color={"#FFF"} style={{ marginLeft: 10 }} />
                    :
                    <Text style={{ fontSize: 22, fontWeight: "700", color: colors.primary }}>
                        Order Taxi
                    </Text>
                }
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View>
                        <Text style={{ color: colors.primary, fontSize: 12 }}>Starting from:</Text>
                        <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 17 }}>
                            {/* ${isCardoorOpen && isCarBoost ?
                                `${orderState.orderConfig?.fixed || 4.55 + 35 + 25}` :
                                isCardoorOpen ? `${orderState.orderConfig?.fixed || 4.55 + 35}` :
                                    isCarBoost ? `${orderState.orderConfig?.fixed || 4.55 + 25}` :
                                        orderState.orderConfig?.fixed || 4.55}** */}
                            $4.55**
                        </Text>
                    </View>
                    <Ionicons name="arrow-forward" size={25} color={colors.primary} style={{ marginLeft: 5 }} />
                </View>
            </TouchableOpacity>
            <Portal>
                <Dialog visible={visible} dismissable={false} onDismiss={() => setVisible(false)}>
                    <Dialog.Title>Order Taxi</Dialog.Title>
                    <Dialog.Content>
                        <View>
                            <Text style={{ fontWeight: "700", fontSize: 18 }}>From:</Text>
                            <Text>{orderObj?.addressFrom.title}</Text>
                            {orderObj?.addressTo &&
                                <View>
                                    <Text style={{ fontWeight: "700", fontSize: 18, marginTop: 10 }}>To:</Text>
                                    <Text>{orderObj?.addressTo.title}</Text>
                                </View>
                            }
                        </View>
                        <Dialog.Actions style={{ paddingBottom: 0 }}>
                            <Button mode='text' color={colors.myOwnColor}
                                loading={isLoading}
                                onPress={() => setVisible(false)}>
                                CANCEL
                            </Button>
                            <Button mode='text' color={colors.myOwnColor}
                                loading={isLoading}
                                onPress={() =>
                                    createOrder(orderObj, setIsLoading,
                                        setVisible, ToastAndroid,
                                        orderDispatch, navigation)}>
                                OK
                            </Button>
                        </Dialog.Actions>
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 5, alignItems: "center",
        height: 55, width: "90%", marginTop: 30,
        flexDirection: "row", paddingHorizontal: 15,
        marginLeft: "auto", marginRight: "auto",
        justifyContent: "space-between",
        elevation: 3
    }
})

export default OrderButton