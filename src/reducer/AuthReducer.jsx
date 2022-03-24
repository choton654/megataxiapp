export const initialState = {
    user: null,
    uid: null,
    token: null,
    refreshToken: null,
    displayName: null,
    phoneNo: null,
    location: null,
    formattedAddressList: [],
    phoneConfirmationObj: null
};

export const reducer = (state, action) => {

    const { type, payload } = action

    switch (type) {
        case "SIGN UP":
            return {
                ...state,
                // user: payload.providerData[0],
                // token: payload.stsTokenManager.accessToken,
                // refreshToken: payload.stsTokenManager.refreshToken,
                // uid: payload.stsTokenManager.uid
                user: payload,
                phoneNo: payload.phoneNumber,
                displayName: payload.displayName,
                uid: payload.uid
            }
        case "ADD DISPLAY NAME":
            return {
                ...state,
                displayName: payload
            }
        case "ADD PHONE NUMBER":
            return {
                ...state,
                phoneNo: payload
            }
        case "SET LOCATION":
            return {
                ...state,
                location: payload
            }
        case "CHANGE LOCATION COORDS":
            return {
                ...state,
                location: { ...state.location, latitude: payload.lat, longitude: payload.lng }
            }
        case "SET FORMATTED ADDRESS":
            return {
                ...state,
                formattedAddressList: payload
            }
        case "SET PHONEVERIFY CONFIRMATION":
            return {
                ...state,
                phoneConfirmationObj: payload
            }
        case "LOG OUT":
            return {
                ...state,
                user: null,
                uid: null,
                token: null,
                refreshToken: null,
                phoneNo: null,
                displayName: null,
            }
    }
}