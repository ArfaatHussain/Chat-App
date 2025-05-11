import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { Search, Trash2, Bell, Plus, LogOut } from 'lucide-react-native';
import { useGlobalState } from '../context/GlobalStateContext';
import { TextInput } from 'react-native-gesture-handler';
import Indicator from '../components/Indicator';
import { get, ref, set } from 'firebase/database';
import { db } from '../../config';
import TransparentLoader from '../components/TransparentLoader';
import Toast from 'react-native-simple-toast'
const AllChats = ({ navigation, route }) => {
    console.log("Chat Data received in All Chats: ", route.params.chatData)
    const [chatData, setChatData] = useState(route.params.chatData);
    const [initialChats, setInitialChats] = useState(route.params.chatData);
    const { currentUser } = route.params;
    const [search, setSearch] = useState('');
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        if (search) {
            const filteredChats = chatData.filter(chat => chat.name.toLowerCase().includes(search.toLowerCase()));
            setChatData(filteredChats);
        } else {
            setChatData(initialChats);
        }
    }, [search]);

   async function handleChatPress(chat) {
        setShowLoader(true);
        console.log("Chat pressed: ", chat);
        const userToBeAdded = {
            id: chat.id,
            name: chat.name,
            about: chat.about,
            email: chat.email,
            image: chat.image,
            time: Date.now()
        }

        try {
            const currentUserId = currentUser.id;
            const chatListRef = ref(db, `chatList/${currentUserId}/${chat.id}`);
            const snapshot = await get(chatListRef);

            if (snapshot.exists()) {
                Toast.show("User is already in your chat list.");
            } else {
                await set(chatListRef, userToBeAdded);
                Toast.show("User added to chat list");
            }
        } catch (error) {
            console.error(error)
        }
        finally {
            setShowLoader(false)
        }

    }

    function renderItem({ item }) {
        if (!item || !item.id) {
            return null;
        }

        const imageUri = item.image || 'https://www.example.com/default-image.png';
        const name = item.name || 'Unknown User';
        const message = item.message || 'Say hello to your friend!';

        return (

            <View style={{ marginTop: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: imageUri }} style={styles.img} />
                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                        <Text style={{ color: 'black', fontSize: 16, fontWeight: '600' }}>{name}</Text>
                        <Text style={{ color: 'grey' }}>{message}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity style={{ backgroundColor: 'black', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 12 }}
                            onPress={() => handleChatPress(item)}
                        >
                            <Text style={{ color: 'white' }} >Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        );
    }

    return (
        <View style={styles.container}>

            <View style={{ backgroundColor: 'grey', marginTop: 20, marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', height: 55, paddingHorizontal: 15, borderRadius: 12 }}>
                <TextInput style={{ flex: 1, color: 'white' }} placeholder='Search' placeholderTextColor={'white'} />
                <Search color={'white'} size={25} />
            </View>

            <View style={styles.chatList}>

                {chatData.length > 0 ? (
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
                    <Text style={{ textAlign: 'center', fontSize: 18, marginTop: '10%' }}>No Accounts for you</Text>
                )}
            </View>
            {
                showLoader ?
                    <TransparentLoader message={'Adding chat to your chat list...'} isVisible={true} />
                    : null
            }
        </View>
    );
};

export default AllChats;

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

