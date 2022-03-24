export const initialState = {
    addressFrom: null,
    addressTo: null,
    searchBarText: '',
    noteToDriver: '',
    paymentMethod: null,
    vehicle: null,
    moreOptions: {
        isCat: false,
        isDog: false,
        isCardoorOpen: false,
        isCarBoost: false
    },
    orderStatus: '',
    orderList: [],
    addressList: [],
    orderConfig: null,
    isRegionChange: false
};

export const reducer = (state, action) => {

    const { type, payload } = action

    switch (type) {
        case "ORDER":
            return {
                ...state,
                orderStatus: payload
            }

        case "SET ORDER LIST":
            return {
                ...state,
                orderList: payload.orderArr,
                addressList: payload.addressArr,
            }

        case "SET REGIONCHANGE":
            return {
                ...state,
                isRegionChange: true
            }

        case "SET ORDER CONFIG":
            return {
                ...state,
                orderConfig: payload
            }
        case "SET VEHICLE":
            return {
                ...state,
                vehicle: payload
            }

        case "SET PAYMENT METHOD":
            return {
                ...state,
                paymentMethod: payload
            }

        case "SET CAR OPTIONS":
            return {
                ...state,
                moreOptions: {
                    ...state.moreOptions,
                    [payload]: !state.moreOptions[payload]
                }
            }

        case "CLEAR PAYMENT METHOD":
            return {
                ...state,
                paymentMethod: null
            }

        case "CLEAR VEHICLE":
            return {
                ...state,
                vehicle: null
            }

        case "CLEAR CAR OPTIONS":
            return {
                ...state,
                moreOptions: {
                    isCat: false,
                    isDog: false,
                    isCardoorOpen: false,
                    isCarBoost: false
                }
            }
        case "SET SEARCHBAR TEXT":
            return {
                ...state,
                searchBarText: payload
            }

        case "SET ADDRESS FROM":
            return {
                ...state,
                addressFrom: payload
            }

        case "SET ADDRESS TO":
            return {
                ...state,
                addressTo: payload
            }

        case "CLEAR ADDRESSES":
            return {
                ...state,
                addressFrom: null,
                addressTo: null
            }

        default:
            break;
    }
}