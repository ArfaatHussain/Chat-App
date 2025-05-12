import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import Chat from '../screens/Chat';
import Home from '../screens/Home';
import { useGlobalState } from '../context/GlobalStateContext';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AllChats from '../screens/AllChats';
import { View,Text } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

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
                initialRouteName={user && user.id ? 'Home' : 'Login'}
                 screenOptions={({ route, navigation }) => {
                let title;

                if (route.name == "Home")
                    title = "Login"
                else if(route.name == "Chat"){
                    title = "Chat"
                }
                else if (route.name == "AllChats"){
                    title="Add Chat"
                }

                return {
                    header: () => (
                        <View style={{
                            padding: 15,
                            elevation: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'black',
                            borderBottomWidth:1,
                            borderBottomColor:'white'
                        }}>
                            <ArrowLeft size={30} color={'white'} onPress={() => navigation.goBack()} />
                            <Text style={{
                                color: 'white',
                                fontWeight: '500',
                                fontSize: 26,
                                textAlign: 'center',
                                flex: 1,
                                marginRight: '3%'
                            }}>
                                {title}
                            </Text>
                        </View>
                    ),
                };
            }}
            >
                <Stack.Screen name='Login' component={Login} options={{headerShown:false}} />
                <Stack.Screen name='Signup' component={Signup} options={{headerShown:false}} />
                <Stack.Screen name='Home' component={Home} options={{headerShown:false}} />
                <Stack.Screen name='Chat' component={Chat} options={{headerShown:false}} />
                <Stack.Screen name='AllChats' component={AllChats}/>


            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation;