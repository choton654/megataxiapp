export const initialState = {
    isAccountFocused: false,

};

export const reducer = (state, action) => {

    const { type, payload } = action

    switch (type) {
        case "CHANGE DRAWER LAYOUT":
            return {
                ...state,
                isAccountFocused: payload
            }
    }
}