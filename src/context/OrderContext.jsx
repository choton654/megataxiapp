import React, { createContext, useReducer } from "react"
import { initialState, reducer } from "../reducer/OrderReducer"

export const OrderContext = createContext()

export default OrderContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <OrderContext.Provider value={{ state, dispatch }}>
            {children}
        </OrderContext.Provider>
    )
}