import React, { createContext, useReducer } from "react"
import { initialState, reducer } from "../reducer/LayoutReducer"

export const LayoutContext = createContext()

export default LayoutContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <LayoutContext.Provider value={{ state, dispatch }}>
            {children}
        </LayoutContext.Provider>
    )
}