import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, TouchableHighlight } from 'react-native';
import { Search, Trash2, Bell, Plus, LogOut } from 'lucide-react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useGlobalState } from '../context/GlobalStateContext';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import { get, ref, remove, onValue } from 'firebase/database';
import { db } from '../../config';
import Toast from 'react-native-simple-toast'
import Indicator from '../components/Indicator';

const Home = ({ navigation, route }) => {
    const [chatData, setChatData] = useState([]);
    const [initialChats, setInitialChats] = useState([]);
    const [search, setSearch] = useState('');
    const { user, setUser } = useGlobalState();
    const [showLoader, setShowLoader] = useState(true);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        getAllUsers();
        if (!user) {

            getUser();
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getChatList();
        }, [])
    );

    useEffect(() => {

        if (search) {
            const filteredChats = chatData.filter(chat => chat.name.toLowerCase().includes(search.toLowerCase()));
            setChatData(filteredChats);
        } else {
            setChatData(initialChats);
        }
    }, [search]);

    async function getUser() {
        try {
            const user = await AsyncStorage.getItem('user');
            if (user !== null) {
                // console.log("Current user ID", user);
                setUser(JSON.parse(user));
            }
        } catch (error) {
            console.error("Error retrieving user ID: ", error);
        } finally {
            setShowLoader(false); // Fix for showLoader
        }
    }

    async function getChatList() {
        try {
            setShowLoader(true);
            const userRef = ref(db, `chatList/${user.id}`);
            onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    const users = Object.values(snapshot.val());
                    setChatData(users); // This updates your chatData with the new chat data from Firebase
                    setInitialChats(users);
                } else {
                    Toast.show("No chat data found");
                    setChatData([]);
                    setInitialChats([]);
                }
            });
        } catch (error) {
            console.error("Error fetching chats: ", error);
            Toast.show("Error fetching chats");
        } finally {
            setShowLoader(false);
        }
    }

    async function getAllUsers() {
        try {
            setShowLoader(true); // Start showing the loader
            const userRef = ref(db, 'users');
            const snapshot = await get(userRef);
            const users = snapshot.val();

            const filteredUsers = Object.values(users).filter((item) => item.id !== user.id);
            setAllUsers(filteredUsers);

        } catch (error) {
            Toast.show("Error fetching users");
        } finally {
            setShowLoader(false); // Hide the loader when fetching is complete
        }
    }

    const deletedChat = async (userIdToBeDeleted) => {
        try {
            const chatListRef = ref(db, `chatList/${user.id}/${userIdToBeDeleted}`);
            await remove(chatListRef);

            setChatData(prevChatData => prevChatData.filter(chat => chat.id !== userIdToBeDeleted));
            Toast.show("User deleted from chat list");

        } catch (error) {
            console.error("Error deleting chat: ", error);
        }
    };

    const renderRightActions = (progress, dragX, itemId) => {
        return (
            <View style={{ alignItems: 'center', flexDirection: 'row', marginLeft: 10, paddingTop: 15 }}>
                <TouchableOpacity style={{ backgroundColor: 'black', padding: 7, borderRadius: 40 }}>
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
        try {
            await AsyncStorage.removeItem('user');
            setUser(null);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
            setChatData([]);
            setInitialChats([]);
        } catch (error) {
            console.error("Error during logout: ", error);
        }
    }

    function handleChatPress(chat) {
        console.log("Chat pressed: ", chat);

        navigation.navigate('Chat', { receiverData: chat, currentUser: user });
    }

    function renderItem({ item }) {
        console.log("Rendering item:", item);
        if (!item || !item.id) {
            return null;
        }

        const imageUri = item.image || 'https://www.example.com/default-image.png';
        const name = item.name || 'Unknown User';
        const message = item.lastMessage || 'last message not received';
        const time = item.time || Date.now();

        return (
            <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}>
                <TouchableOpacity style={{ marginTop: 14 }} onPress={() => handleChatPress(item)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={{ uri: imageUri }} style={styles.img} />
                        <View style={{ flex: 1, paddingHorizontal: 10 }}>
                            <Text style={{ color: 'black', fontSize: 16, fontWeight: '600' }}>{name}</Text>
                            <Text style={{ color: 'grey' }}>{message}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ color: 'grey' }}>{convertTimeTo12HourFormat(time)}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
                <TouchableOpacity onPress={handleLogout}>
                    <LogOut color={'white'} size={30} />
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 25 }}>{user && user.name}</Text>
                <Image source={{ uri: user.image }} style={styles.img} />
            </View>

            <View style={{ backgroundColor: 'grey', marginTop: 20, marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', height: 55, paddingHorizontal: 15, borderRadius: 12 }}>
                <TextInput style={{ flex: 1, color: 'white' }} placeholder='Search' placeholderTextColor={'white'}
                    value={search}
                    onChangeText={setSearch}
                />
                <Search color={'white'} size={25} />
            </View>

            <View style={styles.chatList}>
                {
                    chatData.length === 0 && showLoader ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Indicator />
                            <Text>Getting chats...</Text>
                        </View>
                        : null
                }

                {chatData.length > 0 && !showLoader ? (
                    <View style={{ marginLeft: 20, marginRight: 20, marginVertical: 40 }}>
                        <FlatList
                            data={chatData}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            removeClippedSubviews={false}
                        />
                    </View>
                ) : (
                    <Text style={{ textAlign: 'center', fontSize: 18, marginTop: '10%' }}>{showLoader ? '' : 'No Chats Yet'}</Text>
                )}

                <TouchableOpacity style={{ backgroundColor: 'orange', position: 'absolute', bottom: 30, right: 30, padding: 10, borderRadius: 40 }}
                    onPress={() => navigation.navigate('AllChats', { chatData: allUsers, currentUser: user })}
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
        paddingTop: 10,
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

