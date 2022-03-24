import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth';
import { GOOGLE_PLACES_API_KEY } from '../config';
import { decode } from "@googlemaps/polyline-codec"

export const createOrder = async (orderObj, setIsLoading,
    setVisible, ToastAndroid,
    orderDispatch, navigation) => {
    try {
        setIsLoading(true)
        await database().ref('orders')
            .child(`${orderObj.callbackId}`).set(orderObj,
                (err) => {
                    if (err) {
                        console.error("order creation failed", err)
                        setIsLoading(false)
                        setVisible(false)
                        ToastAndroid.showWithGravity(
                            `Opps!! Can't create order`,
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER
                        )
                    }
                })
        setIsLoading(false)
        setVisible(false)
        orderDispatch({ type: "CLEAR ADDRESSES" })
        ToastAndroid.showWithGravity(
            `Your order has successfully placed`,
            ToastAndroid.LONG,
            ToastAndroid.CENTER
        )
        navigation.navigate("Stack", {
            screen: "Track Order",
            params: { id: orderObj.callbackId }
        })
    } catch (error) {
        console.log("error", error);
        setIsLoading(false)
        setVisible(false)
    }
}

export const getSingleOrder = (orderId, setSingleOrder, setPolyLine) => {
    database().ref(`orders/${orderId}`)
        .on('value', snapshot => {
            setSingleOrder(snapshot.val())
            // Decode poly path
            if (snapshot.val().poly !== undefined) {
                const decodePoly = decode(snapshot.val().poly, 5)
                    .map((coords) => ({ latitude: coords[0], longitude: coords[1] }))
                setPolyLine(decodePoly)
            }
        })
}

export const cancelOrder = (orderId) => {
    database().ref(`orders/${orderId}`).off('value', snapshot => {
        console.log("stop listing event", snapshot);
    })
}

export const getOrder = async () => {
    const uid = auth().currentUser.uid
    const snapshot = await database().ref('orders').once('value')
    const dataObj = snapshot.val()
    let orderArr = []
    let addressArr = []
    for (const key in dataObj) {
        if (Object.hasOwnProperty.call(dataObj, key)) {
            const element = dataObj[key]
            if (element.uid === uid) {
                const newObj = { [key]: element }
                orderArr.push(newObj)
                const addressFrom = {
                    address: element.addressFrom.address,
                    locationName: element.addressFrom.name,
                    place_id: element.addressFrom.id
                }
                if (element.addressTo) {
                    const addressTo = {
                        address: element.addressTo.address,
                        locationName: element.addressTo.name,
                        place_id: element.addressTo.id
                    }
                    addressArr.push(addressTo)
                }
                addressArr.push(addressFrom)
            }
        }
    }
    orderArr = orderArr.map((order) => Object.values(order))
    return { orderArr, addressArr }
}

export const getOrderConfig = async () => {
    const snapshot = await database().ref('config/taxiFare').once('value')
    const configObj = snapshot.val()
    return configObj
}

export const getLocationFromPlaceId = async (
    id,
    item,
    route,
    orderDispatch,
    setIsSearchPopUp,
    setNewCoords,
    setisMapmovementFix
) => {
    try {
        const headers = { 'Content-Type': 'application/json' };
        const config = { method: 'GET', headers };
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&fields=address_component,formatted_address,place_id,geometry,name,type,vicinity,plus_code&region=in&key=${GOOGLE_PLACES_API_KEY}`;
        const response = await fetch(url, config)
        const data = await response.json()

        const { place_id, geometry: { location: { lat, lng } },
            address_components, formatted_address } = data.result

        const streetName = address_components.find(address => address.types.includes("route"))
        const countryCode = address_components.find(address => address.types.includes("country"))
        const city1 = address_components.find(address => address.types.includes("locality"))
        const city2 = address_components.find(address => address.types.includes("sublocality"))
        const postalCode = address_components.find(address => address.types.includes("postal_code"))
        const streetNumber = address_components.find(address => address.types.includes("street_number"))
        const provinceCode = address_components.find(address => address.types.includes("administrative_area_level_1"))
        const subcity = address_components.find(address => address.types.includes("administrative_area_level_2"))

        const address = {
            city: city1?.long_name || city2?.long_name,
            countryCode: countryCode?.short_name,
            id: place_id,
            lat,
            lng,
            name: item.locationName,
            postalCode: postalCode?.long_name || null,
            streetName: streetName?.long_name,
            provinceCode: provinceCode?.short_name,
            streetNumber: streetNumber?.long_name || null,
            subcity: subcity?.long_name,
            title: formatted_address,
            address: item.address
        }
        if (route.name === "Address From") {
            orderDispatch({ type: "SET ADDRESS FROM", payload: address })
        } else if (route.name === "Address To") {
            orderDispatch({ type: "SET ADDRESS TO", payload: address })
        }
        setIsSearchPopUp !== undefined && setIsSearchPopUp(false)
        setNewCoords(data.result.geometry.location)
        if (setisMapmovementFix !== undefined) {
            setTimeout(() => {
                setisMapmovementFix(true)
            }, 500)
        }
    } catch (error) {
        console.error(error);
    }
}

// firebase database rules
// root.child('userRoles').child(auth.uid).child('role').val() === 'admin'