import React, { useContext, useState, useCallback } from 'react'
import { View, Text, InteractionManager, StyleSheet, FlatList } from 'react-native'
import { useFocusEffect } from "@react-navigation/native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { List, useTheme } from "react-native-paper"
import Loader from '../components/Loader'
import { LayoutContext } from '../context/LayoutContext'
import { getOrder } from '../functions/order'
import { OrderContext } from '../context/OrderContext'

// import { ref, onValue } from "firebase/database"
// import { secondaryApp } from '../firebase/config'

const OrderList = () => {

    const { colors } = useTheme()
    const { dispatch: layoutDispatch } = useContext(LayoutContext)
    const { state: orderState, dispatch: orderDispatch } = useContext(OrderContext)
    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)
    const renderItem = useCallback(({ item }) => {

        let hours = new Date(item[0].createdAt).getHours()
        let minutes = new Date(item[0].createdAt).getMinutes()
        const suffix = hours >= 12 ? "PM" : "AM";
        minutes = minutes < 10 ? `0${minutes}` : minutes
        const orderTime = `${new Date(item[0].createdAt).toDateString()} ${((hours + 11) % 12 + 1)}:${minutes}${suffix}`

        return (
            <List.Accordion
                style={{
                    backgroundColor: colors.primary,
                    borderBottomWidth: 1, borderColor: colors.placeholder
                }}
                title={orderTime}
                description={item[0].addressFrom.title}
                titleStyle={{ color: colors.dark, fontWeight: "700" }}
                right={({ isExpanded }) =>
                    isExpanded ? <MaterialCommunityIcons
                        name="arrow-down-bold-outline" size={20}
                        style={{}} color={colors.dark}
                    /> : <MaterialCommunityIcons
                        name="arrow-right-bold-outline" size={20}
                        style={{}} color={colors.dark}
                    />}
            >
                <List.Item title="From"
                    description={item[0].addressFrom.title}
                    titleStyle={{ color: colors.dark, fontWeight: "700" }}
                    descriptionStyle={{ color: colors.dark }}
                    style={{ backgroundColor: colors.light }} />
                <List.Item title="To"
                    description={item[0].addressTo.title}
                    titleStyle={{ color: colors.dark, fontWeight: "700" }}
                    descriptionStyle={{ color: colors.dark }}
                    style={{ backgroundColor: colors.light }} />
                <List.Item title="Total Distance"
                    description={item[0].estimation.totalDistanceKm}
                    titleStyle={{ color: colors.dark, fontWeight: "700" }}
                    descriptionStyle={{ color: colors.dark }}
                    style={{ backgroundColor: colors.light }} />
                <List.Item title="Time Duration"
                    description={item[0].estimation.totalDurationHumanized}
                    titleStyle={{ color: colors.dark, fontWeight: "700" }}
                    descriptionStyle={{ color: colors.dark }}
                    style={{ backgroundColor: colors.light }} />
            </List.Accordion>
        )
    }, [])

    useFocusEffect(
        useCallback(() => {
            const task = InteractionManager.runAfterInteractions(async () => {
                layoutDispatch({ type: "CHANGE DRAWER LAYOUT", payload: false })
                try {
                    let { orderArr, addressArr } = await getOrder()
                    orderDispatch({ type: "SET ORDER LIST", payload: { orderArr, addressArr } })
                    setDidFinishInitialAnimation(true)
                } catch (error) {
                    console.log(error);
                    setDidFinishInitialAnimation(true)
                }
            })
            return () => task.cancel()
        }, []))

    if (!didFinishInitialAnimation) { return <Loader /> }

    return (
        <View style={styles.container}>
            {orderState.orderList.length > 0 ?
                <FlatList
                    data={orderState.orderList}
                    renderItem={renderItem}
                    keyExtractor={(_, idx) => idx}
                    showsVerticalScrollIndicator={false}
                />
                :
                <View style={{
                    flex: 1, justifyContent: "center",
                    alignItems: "center",
                    width: "100%"
                }}>
                    <Text style={{ fontSize: 20, fontWeight: "700", color: colors.placeholder }}>You haven't orderd any taxi yet</Text>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",

    }
})

export default OrderList

   // const orderRef = ref(database, 'config/options/');
   // onValue(orderRef, (snapshot) => {
   //     const data = snapshot.val();
   //     console.log("data", data);
   // });
   // const secondApp = await secondaryApp()