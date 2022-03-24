import React, { useEffect } from 'react';
import { StatusBar, View, Platform } from "react-native"
import { getStatusBarHeight } from 'react-native-status-bar-height';
// import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import RootNavigation from './src/navigation/RootNavigation';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import RootProvider from "./src/context"
import { SafeAreaProvider } from 'react-native-safe-area-context'
import colors from "./src/utils/colors"

export default function App() {

  const theme = {
    ...DefaultTheme,
    myOwnProperty: true,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      dark: colors.dark,
      myOwnColor: colors.myOwnColor,
      button: colors.button,
      placeholder: colors.placeholder,
      light: colors.light,
      error: colors.error
    },
  };

  return (
    <RootProvider>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          {Platform.OS === "android" &&
            <StatusBar backgroundColor={colors.myOwnColor} hidden={false} />
          }
          {Platform.OS === "ios" &&
            <View style={{ height: getStatusBarHeight(), backgroundColor: colors.myOwnColor }} />
          }
          {/* <ExpoStatusBar backgroundColor={colors.myOwnColor} hidden={false} /> */}
          <RootNavigation />
        </PaperProvider>
      </SafeAreaProvider>
    </RootProvider>
  );
}

// react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
