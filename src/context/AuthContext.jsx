import React, { createContext, useReducer } from "react";
import { initialState, reducer } from "../reducer/AuthReducer";

export const AuthContext = createContext();

export default AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
