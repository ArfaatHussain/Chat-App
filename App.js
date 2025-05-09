import { enableScreens } from 'react-native-screens';
enableScreens();
import React from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from "react-native-keyboard-controller";
import AppNavigation from "./src/navigation/AppNavigation";
function App() {
  return (

    <SafeAreaProvider style={{ flex: 1 }} >
      <KeyboardProvider>
        <GestureHandlerRootView style={{ flex: 1 }} >
          <AppNavigation />
        </GestureHandlerRootView>
      </KeyboardProvider>
    </SafeAreaProvider>

  );
}

export default App;