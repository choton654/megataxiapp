import { View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { useNavigation } from "@react-navigation/native"
import { Ionicons, FontAwesome } from "@expo/vector-icons"
import { useTheme, Text, Divider, TextInput } from 'react-native-paper'
import { OrderContext } from '../../context/OrderContext'

const GetAddress = () => {

    const { colors } = useTheme()
    const navigation = useNavigation()
    const [driverNote, setDriverNote] = useState('')
    const [isEdit, setisEdit] = useState(false)
    const { state: orderState, dispatch: orderDispatch } = useContext(OrderContext)
    const { addressFrom, addressTo } = orderState

    useEffect(() => {
        if (driverNote.trim() !== '') {
            setisEdit(true)
        } else {
            setisEdit(false)
        }
    }, [driverNote])

    return (
        <View>
            <View style={{ paddingHorizontal: 15, backgroundColor: colors.primary }}>
                <TouchableOpacity style={{
                    flexDirection: "row", justifyContent: "space-between",
                    alignItems: "center", width: "100%",
                    backgroundColor: colors.primary, paddingTop: 10
                }}
                    onPress={() => navigation.navigate("Stack", { screen: "Address From" })}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="location" size={25} color={colors.dark} />
                        <View style={{ width: "88%" }}>
                            <Text style={{ marginLeft: 30, fontSize: 18, fontWeight: "600" }}>Address from</Text>
                            {addressFrom &&
                                <Text style={{
                                    marginLeft: 30, fontSize: 15,
                                    fontWeight: "600", color: colors.placeholder,
                                    marginTop: 5
                                }}>
                                    {addressFrom.title}
                                    {/* {addressFrom.title.length > 50 && "..."} */}
                                </Text>
                            }
                        </View>
                    </View>
                    {addressFrom ?
                        <TouchableOpacity onPress={() => orderDispatch({ type: "SET ADDRESS FROM", payload: null })}>
                            <FontAwesome name="close" size={25} color={colors.placeholder} />
                        </TouchableOpacity>
                        :
                        <FontAwesome name="angle-right" size={25} color={colors.placeholder} />
                    }
                </TouchableOpacity>
                <Divider style={{
                    width: "90%", marginTop: 10,
                    marginLeft: 55, borderWidth: 0.4,
                    borderColor: colors.placeholder
                }} />
                <View style={{
                    flexDirection: "row", alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <Ionicons name="arrow-down" size={25} color={colors.dark} />
                    <TextInput
                        placeholder='Note to driver'
                        value={driverNote}
                        onChangeText={text => setDriverNote(text)}
                        activeUnderlineColor="#f59e0b"
                        right={<TextInput.Icon name={isEdit ? "close-circle" : "pencil"}
                            color={colors.placeholder}
                            style={{ marginRight: 20 }}
                            size={20}
                            forceTextInputFocus={false}
                            onPress={() => { if (isEdit) setDriverNote('') }}
                        />}
                        style={{
                            height: 50,
                            backgroundColor: colors.primary, paddingHorizontal: 0,
                            width: "90%", marginLeft: 30, paddingRight: 20
                        }}
                    />
                </View>
                <TouchableOpacity style={{
                    flexDirection: "row", justifyContent: "space-between",
                    alignItems: "center", width: "100%",
                    backgroundColor: colors.primary, paddingVertical: 10
                }}
                    onPress={() => navigation.navigate("Stack", { screen: "Address To" })}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="location-outline" size={25} color={colors.dark} />
                        <View style={{ width: "88%" }}>
                            <Text style={{ marginLeft: 30, fontSize: 18, fontWeight: "600" }}>Address to</Text>
                            {addressTo &&
                                <Text style={{
                                    marginLeft: 30, fontSize: 15,
                                    fontWeight: "600", color: colors.placeholder,
                                    marginTop: 5
                                }}>
                                    {addressTo.title}
                                    {/* {addressTo.title.length > 50 && "..."} */}
                                </Text>
                            }
                        </View>
                    </View>
                    {addressTo ?
                        <TouchableOpacity onPress={() => orderDispatch({ type: "SET ADDRESS TO", payload: null })}>
                            <FontAwesome name="close" size={25} color={colors.placeholder} />
                        </TouchableOpacity>
                        :
                        <FontAwesome name="angle-right" size={25} color={colors.placeholder} />
                    }
                </TouchableOpacity>
            </View>
            <Divider style={{
                width: "100%", borderWidth: 0.4,
                borderColor: colors.placeholder
            }} />
        </View>
    )
}

export default GetAddress