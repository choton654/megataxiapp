import { View, StyleSheet, Platform, InteractionManager, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { Checkbox, useTheme, Text, Divider, Button } from 'react-native-paper'
import { AntDesign } from "@expo/vector-icons"
import Loader from '../components/Loader'
import { useNavigation } from '@react-navigation/native'
import { OrderContext } from '../context/OrderContext'
import Header from '../components/Header'

const MoreOptions = () => {

    const navigation = useNavigation()
    const { colors } = useTheme()
    const { state: orderState, dispatch: orderDispatch } = useContext(OrderContext)
    const { isCat, isDog, isCardoorOpen, isCarBoost } = orderState.moreOptions

    const setCarOptions = (key) => {
        orderDispatch({ type: "SET CAR OPTIONS", payload: key })
    }

    const [didFinishInitialAnimation, setDidFinishInitialAnimation] = useState(false)

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            setDidFinishInitialAnimation(true)
        })
    }, [])

    if (!didFinishInitialAnimation) { return <Loader /> }

    return (
        <View style={styles.container}>
            {Platform.OS === "ios" &&
                <Header title={"More Options"} />
            }
            <View>
                <Text style={{ marginHorizontal: 15, marginVertical: 10, color: colors.dark }}>
                    Travelling with a pet ?
                </Text>
                <Divider style={[styles.divider, { borderColor: colors.placeholder }]} />
                <TouchableOpacity style={styles.div_1}
                    onPress={() => {
                        setCarOptions('isCat')
                    }}>
                    {Platform.OS === "android" ?
                        <Checkbox
                            status={isCat ? 'checked' : 'unchecked'}
                            uncheckedColor="#BDBDBD"
                            onPress={() => {
                                setCarOptions('isCat')
                            }}
                            color={colors.myOwnColor}
                        />
                        :
                        <TouchableOpacity onPress={() => {
                            setCarOptions('isCat')
                        }} style={{ marginLeft: 10 }}>
                            {isCat ?
                                <AntDesign name='checksquare' size={20} color={colors.myOwnColor} />
                                :
                                <View style={{
                                    width: 18, height: 18,
                                    borderWidth: 2,
                                    borderColor: colors.placeholder,
                                    borderRadius: 2
                                }}
                                />
                            }
                        </TouchableOpacity>
                    }
                    <Text style={styles.text_1}>Cat</Text>
                </TouchableOpacity>
                <Divider inset style={{
                    borderWidth: 0.7,
                    borderColor: colors.placeholder
                }} />
                <TouchableOpacity style={styles.div_1}
                    onPress={() => {
                        setCarOptions('isDog')
                    }}>
                    {Platform.OS === "android" ?
                        <Checkbox
                            status={isDog ? 'checked' : 'unchecked'}
                            uncheckedColor="#BDBDBD"
                            onPress={() => {
                                setCarOptions('isDog')
                            }}
                            color={colors.myOwnColor}
                        />
                        :
                        <TouchableOpacity onPress={() => {
                            setCarOptions('isDog')
                        }} style={{ marginLeft: 10 }}>
                            {isDog ?
                                <AntDesign name='checksquare' size={20} color={colors.myOwnColor} />
                                :
                                <View style={{
                                    width: 18, height: 18,
                                    borderWidth: 2,
                                    borderColor: colors.placeholder,
                                    borderRadius: 2
                                }}
                                />
                            }
                        </TouchableOpacity>
                    }
                    <Text style={styles.text_1}>Dog</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 15 }}>
                <Text style={{ marginHorizontal: 15, marginVertical: 10, color: colors.dark }}>
                    Need Help ?
                </Text>
                <Divider style={[styles.divider, { borderColor: colors.placeholder }]} />
                <TouchableOpacity style={styles.div_1}
                    onPress={() => {
                        setCarOptions('isCardoorOpen')
                    }}>
                    {Platform.OS === "android" ?
                        <Checkbox
                            status={isCardoorOpen ? 'checked' : 'unchecked'}
                            uncheckedColor="#BDBDBD"
                            onPress={() => {
                                setCarOptions('isCardoorOpen')
                            }}
                            color={colors.myOwnColor}
                        />
                        :
                        <TouchableOpacity onPress={() => {
                            setCarOptions('isCardoorOpen')
                        }} style={{ marginLeft: 10 }}>
                            {isCardoorOpen ?
                                <AntDesign name='checksquare' size={20} color={colors.myOwnColor} />
                                :
                                <View style={{
                                    width: 18, height: 18,
                                    borderWidth: 2,
                                    borderColor: colors.placeholder,
                                    borderRadius: 2
                                }}
                                />
                            }
                        </TouchableOpacity>
                    }
                    <View style={styles.div_2}>
                        <Text style={styles.text_1}>Car door open</Text>
                        <Text style={{ color: colors.placeholder }}>$35.00*</Text>
                    </View>
                </TouchableOpacity>
                <Divider inset style={{
                    borderWidth: 0.6,
                    borderColor: colors.placeholder
                }} />
                <TouchableOpacity style={styles.div_1}
                    onPress={() => {
                        setCarOptions('isCarBoost')
                    }}>
                    {Platform.OS === "android" ?
                        <Checkbox
                            status={isCarBoost ? 'checked' : 'unchecked'}
                            uncheckedColor="#BDBDBD"
                            onPress={() => {
                                setCarOptions('isCarBoost')

                            }}
                            color={colors.myOwnColor}
                        />
                        :
                        <TouchableOpacity onPress={() => {
                            setCarOptions('isCarBoost')
                        }} style={{ marginLeft: 10 }}>
                            {isCarBoost ?
                                <AntDesign name='checksquare' size={20} color={colors.myOwnColor} />
                                :
                                <View style={{
                                    width: 18, height: 18,
                                    borderWidth: 2,
                                    borderColor: colors.placeholder,
                                    borderRadius: 2
                                }}
                                />
                            }
                        </TouchableOpacity>
                    }
                    <View style={styles.div_2}>
                        <Text style={styles.text_1}>Car Boost</Text>
                        <Text style={{ color: colors.placeholder }}>$25.00*</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <Button mode="contained"
                color={colors.button}
                style={styles.button}
                onPress={() => navigation.goBack()}
            >
                Set Options
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: "#fff",
    },
    divider: {
        width: "100%", marginTop: 5,
        borderWidth: 0.4
    },
    text_1: { marginLeft: Platform.OS === "ios" ? 30 : 25, fontSize: 15 },
    div_1: {
        flexDirection: "row", alignItems: "center", height: 50,
        paddingHorizontal: 15
    },
    div_2: {
        flexDirection: "row", justifyContent: "space-between",
        width: "90%"
    },
    button: { marginTop: 25, width: "90%", marginLeft: "auto", marginRight: "auto" }
})

export default MoreOptions