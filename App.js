import { enableScreens } from 'react-native-screens';
enableScreens();
import React from "react";
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from "react-native-keyboard-controller";
import AppNavigation from "./src/navigation/AppNavigation";
import { StatusBar } from 'expo-status-bar';
import { View, Text } from "react-native";
function App() {
  return (

    <SafeAreaProvider style={{ flex: 1 }} >
      <KeyboardProvider>
        <GestureHandlerRootView style={{ flex: 1 }} >
          <SafeAreaView
          style={{flex:1}}
          >
          <StatusBar backgroundColor='white'  />
          <AppNavigation />
          </SafeAreaView>

        </GestureHandlerRootView>
      </KeyboardProvider>
    </SafeAreaProvider>

  );
}

export default App;