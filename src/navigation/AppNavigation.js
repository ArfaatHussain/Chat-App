import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Chat from '../screens/Chat';
import Home from '../screens/Home';
import { useGlobalState } from '../context/GlobalStateContext';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddContact from '../screens/AddContact';
const Stack = createNativeStackNavigator();


const AppNavigation = () => {

    const { user, setUser } = useGlobalState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, [])

    async function getUser() {
        try {
            const user = await AsyncStorage.getItem('user');
            if (user !== null) {
                console.log("User: ", user)
                setUser(JSON.parse(user));
            }
        } catch (error) {
            console.error("Error retrieving user ID: ", error);
        } finally {
            setLoading(false);
        }
    }


    if (loading) return null;
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName={user && user.id ? 'Home' : 'Login'}
            >
                <Stack.Screen name='Login' component={Login} />
                <Stack.Screen name='Signup' component={Signup} />
                <Stack.Screen name='Home' component={Home} />
                <Stack.Screen name='Chat' component={Chat} />
                <Stack.Screen name='AddContact' component={AddContact}
                    options={{
                        headerShown: true,
                        title: 'Add Contact',
                        headerStyle: {
                            backgroundColor: 'black',
                            elevation: 0,
                            shadowOpacity: 0,
                            borderBottomWidth: 0,
                        },
                        headerTintColor: 'white',
                        headerTitleStyle: {
                            borderBottomWidth: 2,
                            borderBottomColor: 'white',
                        },
                    }}

                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation;