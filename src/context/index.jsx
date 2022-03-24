import React from "react"
import AuthContextProvider from "./AuthContext"
import OrderContextProvider from "./OrderContext"
import LayoutContextProvider from "./LayoutContext"

const RootProvider = ({ children }) => {
    return (
        <LayoutContextProvider>
            <OrderContextProvider>
                <AuthContextProvider>
                    {children}
                </AuthContextProvider>
            </OrderContextProvider>
        </LayoutContextProvider>
    )
}

export default RootProvider