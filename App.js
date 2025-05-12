import { enableScreens } from 'react-native-screens';
enableScreens();
import React from "react";
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from "react-native-keyboard-controller";
import AppNavigation from "./src/navigation/AppNavigation";
import { StatusBar } from 'expo-status-bar';
import { View, Text } from "react-native";
import { GlobalStateContext } from './src/context/GlobalStateContext';


function App() {
  const [user, setUser] = React.useState(null);
  return (

    <SafeAreaProvider style={{ flex: 1 }} >
      <KeyboardProvider>
        <GestureHandlerRootView style={{ flex: 1 }} >
          <SafeAreaView
          style={{flex:1}}
          >
            <GlobalStateContext.Provider value={{user,setUser}} >
          <StatusBar backgroundColor='black'  />
          <AppNavigation />
            </GlobalStateContext.Provider>
          </SafeAreaView>

        </GestureHandlerRootView>
      </KeyboardProvider>
    </SafeAreaProvider>

    

  );
}

export default App;