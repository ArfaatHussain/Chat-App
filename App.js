import React from "react";
import Login from "./src/screens/Login";
import Home from "./src/screens/Home";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App (){
  return (

    <SafeAreaProvider style={{flex:1}} >
      <GestureHandlerRootView style={{flex:1}} >
      <Home />
      </GestureHandlerRootView>
    </SafeAreaProvider>
   
  );
}

export default App;