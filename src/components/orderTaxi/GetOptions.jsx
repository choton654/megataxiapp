import { View, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { Divider, useTheme, Text } from 'react-native-paper'
import { FontAwesome, Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { OrderContext } from '../../context/OrderContext'

const GetOptions = () => {

    const { colors } = useTheme()
    const navigation = useNavigation()
    const { state: orderState, dispatch: orderDispatch } = useContext(OrderContext)

    const { paymentMethod, vehicle, moreOptions } = orderState

    return (
        <View>
            <Text style={{ fontSize: 17, padding: 15 }}>Options</Text>
            <Divider style={{
                width: "100%", borderWidth: 0.4,
                borderColor: colors.placeholder
            }} />
            <View style={{ paddingHorizontal: 15 }}>
                <TouchableOpacity style={{
                    flexDirection: "row", justifyContent: "space-between",
                    alignItems: "center", width: "100%", paddingTop: 10
                }}
                    onPress={() => navigation.navigate("Stack", { screen: "Payment" })}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <MaterialIcons name="payment" size={25} color={colors.dark} />
                        <View style={{ marginLeft: 30, }}>
                            <Text style={{ fontSize: 18, fontWeight: "600" }}>
                                Preferred payment method
                            </Text>
                            {paymentMethod &&
                                <Text style={{ fontSize: 15, fontWeight: "700" }}>
                                    Pay in car by {paymentMethod}
                                </Text>
                            }
                        </View>
                    </View>
                    {paymentMethod ?
                        <TouchableOpacity onPress={() => orderDispatch({ type: "CLEAR PAYMENT METHOD" })}>
                            <FontAwesome name="close" size={22} color={colors.placeholder} />
                        </TouchableOpacity>
                        :
                        <FontAwesome name="angle-right" size={25} color={colors.placeholder} />
                    }
                </TouchableOpacity>
                <Divider style={{
                    width: "90%", marginTop: 15,
                    marginLeft: 52, borderWidth: 0.6,
                    borderColor: colors.placeholder
                }} />
                <TouchableOpacity style={{
                    flexDirection: "row", justifyContent: "space-between",
                    alignItems: "center", width: "100%", paddingTop: 10
                }}
                    onPress={() => navigation.navigate("Stack", { screen: "Vehicle" })}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="car-sport-outline" size={25} color={colors.dark} />
                        <View style={{ marginLeft: 30, }}>
                            <Text style={{ fontSize: 18, fontWeight: "600" }}>
                                Preferred vehicle
                            </Text>
                            {vehicle &&
                                <Text style={{ fontSize: 15, fontWeight: "700" }}>
                                    {vehicle}
                                </Text>
                            }
                        </View>
                    </View>
                    {vehicle ?
                        <TouchableOpacity onPress={() => orderDispatch({ type: "CLEAR VEHICLE" })}>
                            <FontAwesome name="close" size={22} color={colors.placeholder} />
                        </TouchableOpacity>
                        :
                        <FontAwesome name="angle-right" size={25} color={colors.placeholder} />
                    }
                </TouchableOpacity>
                <Divider style={{
                    width: "90%", marginTop: 15,
                    marginLeft: 52, borderWidth: 0.4,
                    borderColor: colors.placeholder
                }} />
                <TouchableOpacity style={{
                    flexDirection: "row", justifyContent: "space-between",
                    alignItems: "center", width: "100%", paddingTop: 10
                }}
                    onPress={() => navigation.navigate("Stack", { screen: "More Options" })}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <AntDesign name="menuunfold" size={25} color={colors.dark} />
                        <View>
                            <Text style={{ marginLeft: 30, fontSize: 18, fontWeight: "600" }}>
                                More options
                            </Text>
                            {Object.values(moreOptions).includes(true) &&
                                <View style={{ marginLeft: 30 }}>
                                    {moreOptions.isCat &&
                                        <Text style={{ fontSize: 15, fontWeight: "700" }}>
                                            Cat
                                        </Text>
                                    }
                                    {moreOptions.isDog &&
                                        <Text style={{ fontSize: 15, fontWeight: "700" }}>
                                            Dog
                                        </Text>
                                    }
                                    {moreOptions.isCardoorOpen &&
                                        <Text style={{ fontSize: 15, fontWeight: "700" }}>
                                            Car door open
                                        </Text>
                                    }
                                    {moreOptions.isCarBoost &&
                                        <Text style={{ fontSize: 15, fontWeight: "700" }}>
                                            Car Boost
                                        </Text>
                                    }
                                </View>
                            }
                        </View>
                    </View>
                    {Object.values(moreOptions).includes(true) ?
                        <TouchableOpacity onPress={() => orderDispatch({ type: "CLEAR CAR OPTIONS" })}>
                            <FontAwesome name="close" size={22} color={colors.placeholder} />
                        </TouchableOpacity>
                        :
                        <FontAwesome name="angle-right" size={25} color={colors.placeholder} />
                    }
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default GetOptions