import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Chat from '../screens/Chat';

const Stack = createNativeStackNavigator();


const AppNavigation = ()=>{
    return(
        <NavigationContainer>
            <Stack.Navigator
            screenOptions={{
                headerShown:false
            }}
            >
                <Stack.Screen name='Login' component={Login} />
                <Stack.Screen name='Signup' component={Signup} />
                <Stack.Screen name='Chat' component={Chat} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation;