import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, TouchableHighlight } from 'react-native';
import { Search, Trash2, Bell, Plus, LogOut } from 'lucide-react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { API_URL } from '../Constant';
import { useGlobalState } from '../context/GlobalStateContext';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { TextInput } from 'react-native-gesture-handler';
import { get, ref } from 'firebase/database';
import { db } from '../../config';
import Toast from 'react-native-simple-toast'
const Home = ({ navigation, route }) => {
    const [chatData, setChatData] = useState([]);
    const [initialChats, setInitialChats] = useState([]);
    const [search, setSearch] = useState('');
    const { user, setUser } = useGlobalState();

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            getAllUsers();
        }, [])
    );

    useEffect(() => {
        if (search) {
            const filteredChats = chatData.filter(chat => chat.name.toLowerCase().includes(search.toLowerCase()));
            setChatData(filteredChats);
        } else {
            setChatData(initialChats);
        }
    }, [search])

    async function getUser() {
        try {
            const user = await AsyncStorage.getItem('user');
            if (user !== null) {
                setUser(JSON.parse(user));
            }
        } catch (error) {
            console.error("Error retrieving user ID: ", error);
        } finally {
            setLoading(false);
        }
    }

    async function getAllUsers() {
        try {
            const userRef = ref(db, 'users');
            const snapshot = await get(userRef);

            const users = snapshot.val();
            console.log("Users: ", users)

            const filteredUsers = Object.keys(users).filter((key) => {
                const item = users[key];
                if (item.id !== user.id) {
                    return item;
                }
            })
            console.log("Filtered Users: ", filteredUsers)
            setInitialChats(filteredUsers);
            setChatData(filteredUsers);

        } catch (error) {
        Toast.show("Error fetching users"); 
        }
    }


    const deletedChat = async (chatId) => {
        try {

            setChatData(chatData.filter(chat => chat.id !== chatId));
        } catch (error) {
            console.error("Error deleting chat: ", error);
        }
    };

    const renderRightActions = (progress, dragX, itemId) => {
        return (
            <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 10, paddingTop: 15 }}>
                <TouchableOpacity
                    style={{ backgroundColor: 'black', padding: 7, borderRadius: 40 }}
                >
                    <Bell color={'white'} size={22} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.deleteButton, { marginLeft: 5 }]} onPress={() => deletedChat(itemId)}>
                    <Trash2 color={'white'} size={22} />
                </TouchableOpacity>
            </View>
        );
    };

    function convertTimeTo12HourFormat(time) {
        const date = new Date(time);
        const timeString = date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        return timeString;
    }

    async function handleLogout() {
        await AsyncStorage.removeItem('user');
        setUser(null);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    }

    function renderItem({ item }) {
        // Check if the item is valid
        if (!item || !item.id) {
            return null;  // Skip rendering invalid items
        }

        const imageUri = item.image || 'https://www.example.com/default-image.png';  // Fallback image
        const name = item.name || 'Unnamed User';  // Fallback name
        const message = item.message || 'No messages yet';  // Fallback message
        const time = item.time || Date.now();  // Fallback time

        return (
            <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}>
                <TouchableHighlight style={{ marginTop: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={{ uri: imageUri }} style={styles.img} /> {/* Use fallback image */}
                        <View style={{ flex: 1, paddingHorizontal: 10 }}>
                            <Text style={{ color: 'black', fontSize: 16, fontWeight: '600' }}>{name}</Text>
                            <Text style={{ color: 'grey' }}>{message}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ color: 'grey' }}>{convertTimeTo12HourFormat(time)}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            </Swipeable>
        );
    }


    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
                <TouchableOpacity
                    onPress={handleLogout}
                >
                    <LogOut color={'white'} size={30} />
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 25 }}>{user && user.name}</Text>
                <Image source={{ uri: user.image }} style={styles.img} />
            </View>

            <View
                style={{ backgroundColor: 'grey', marginTop: 20, marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', height: 55, paddingHorizontal: 15, borderRadius: 12 }}
            >
                <TextInput
                    style={{ flex: 1, color: 'white' }}
                    placeholder='Search'
                    placeholderTextColor={'white'}
                />

                <Search color={'white'} size={25} />
            </View>


            <View style={styles.chatList}>
                {chatData.length ? (
                    <View style={{ marginLeft: 20, marginRight: 20, marginVertical: 40 }}>
                        <FlatList
                            data={chatData}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                ) : (
                    <Text style={{ textAlign: 'center', fontSize: 18, marginTop: '10%' }} >No Chats Yet</Text>
                )}

                <TouchableOpacity
                    style={{ backgroundColor: 'orange', position: 'absolute', bottom: 30, right: 30, padding: 10, borderRadius: 40 }}
                // onPress={() => navigation.navigate('AddContact')}
                >
                    <Image source={require('../assets/group.png')} style={{ height: 40, width: 40, resizeMode: 'cover' }} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        paddingTop: 10
    },
    img: {
        height: 45,
        width: 45,
        resizeMode: 'contain',
    },
    chatList: {
        backgroundColor: 'white',
        flex: 1,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        marginTop: 30,
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        padding: 7,
        borderRadius: 40,
    },
    deleteText: {
        color: 'white',
        fontWeight: '600',
    },
});
