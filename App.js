import React from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ChatStructure from './src/components/ChatStructure';
import { KeyboardProvider } from "react-native-keyboard-controller";
import Chat from "./src/screens/Chat";
function App() {
  return (

    <SafeAreaProvider style={{ flex: 1 }} >
      <KeyboardProvider>
        <GestureHandlerRootView style={{ flex: 1 }} >
          <ChatStructure />
        </GestureHandlerRootView>
      </KeyboardProvider>
    </SafeAreaProvider>

  );
}

export default App;