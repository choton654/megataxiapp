import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { useTheme } from "react-native-paper"

const Loader = () => {

    const { colors } = useTheme()

    return (
        <View style={{
            flex: 1, justifyContent: "center",
            alignItems: "center", backgroundColor: colors.primary
        }}>
            <ActivityIndicator size="large" color={colors.button} />
        </View>
    )
}

export default Loader