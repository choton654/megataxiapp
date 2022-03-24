import { View, Platform, StyleSheet, InteractionManager } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from "react-native-paper"
import RadioGroup from 'react-native-radio-buttons-group'
import Loader from '../components/Loader'
import { OrderContext } from '../context/OrderContext'
import Header from '../components/Header'

const paymentMethods = ['Cash', 'Debit Card', 'Visa', 'Master Card', 'Ameriad Express']

const SelectPayment = () => {

    const navigation = useNavigation()
    const { colors } = useTheme()
    const { state: orderState, dispatch: orderDispatch } = useContext(OrderContext)
    const radioButtonsData = paymentMethods.map((item, idx) =>
    ({
        id: idx,
        label: item,
        value: item,
        containerStyle: {
            ...styles.radioButtonsStyle,
            borderBottomWidth: idx === paymentMethods.length - 1 ? 0 : 1
        },
        labelStyle: styles.labelStyle,
        borderColor: colors.myOwnColor,
        color: colors.myOwnColor,
        size: 15,
        selected: item === orderState.paymentMethod
    }))

    const [radioButtons, setRadioButtons] = useState(radioButtonsData)
    const onPressRadioButton = (radioButtonsArray) => {
        setRadioButtons(radioButtonsArray)
        const selectedPayment = radioButtonsArray.find((item) => item.selected)
        orderDispatch({ type: "SET PAYMENT METHOD", payload: selectedPayment.value })
        setTimeout(() => {
            navigation.goBack()
        }, 100)
    }

    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            setDidFinishInitialAnimation(true)
        })
    }, [])

    if (!didFinishInitialAnimation) { return <Loader /> }

    return (
        <View style={{ flex: 1, backgroundColor: colors.primary }}>
            {Platform.OS === "ios" &&
                <Header title={"Preferred payment tmethod"} />
            }
            <RadioGroup
                radioButtons={radioButtons}
                containerStyle={{ padding: 10 }}
                onPress={onPressRadioButton}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    radioButtonsStyle: {
        alignItems: "center",
        width: '100%',
        height: 40,
        paddingLeft: 5,
        marginTop: 0,
        borderBottomColor: "#bdbdbd",
        flexDirection: "row-reverse",
        justifyContent: "space-between"
    },
    labelStyle: {
        fontSize: 15,
    }
})

export default SelectPayment