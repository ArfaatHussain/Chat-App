import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, TouchableHighlight } from 'react-native';
import { Search, Trash2, Bell } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const data = [
    {
        id: 1,
        name: "Adil",
        image: require('../assets/profile.png')
    },
    {
        id: 2,
        name: "Marina",
        image: require('../assets/profile.png')
    },
    {
        id: 3,
        name: "Dean",
        image: require('../assets/profile.png')
    },
    {
        id: 4,
        name: "Max",
        image: require('../assets/profile.png')
    },
    {
        id: 5,
        name: "Hassan",
        image: require('../assets/profile.png')
    },
    {
        id: 6,
        name: "Shahzaib",
        image: require('../assets/profile.png')
    },
    {
        id: 7,
        name: "Uzair",
        image: require('../assets/profile.png')
    }
];

const initialChats = [
    {
        id: 1,
        name: "Alex",
        message: "How are you today?",
        time: "7:00 AM",
        image: require('../assets/alex.png'),
        totalMessage: 3
    },
    {
        id: 2,
        name: "Sabila Sayma",
        message: "Don't miss to attend the meeting",
        time: "8:00 AM",
        image: require('../assets/sabila.png'),
        totalMessage: 4
    },
    {
        id: 3,
        name: "John Borino",
        message: "Hello",
        time: "4:00 AM",
        image: require('../assets/john.png'),
        totalMessage: 3
    },
    {
        id: 4,
        name: "Alex",
        message: "Hello",
        time: "1:00 PM",
        image: require('../assets/alex.png'),
        totalMessage: 3
    },
    // ... additional items
];

const Home = () => {

    const [chatData,setChatData] = useState(initialChats);

    function deletedChat(chatId){
        let filteredChats = chatData.filter( chat => chat.id != chatId );
        setChatData(filteredChats);
    }
    // Function to render the delete button when swiping left
    const renderRightActions = (progress, dragX, itemId) => {
        return (
            <View
                style={{ alignItems: 'center', flexDirection: 'row',marginLeft:10,paddingTop:15 }}
            >
                <TouchableOpacity
                    style={{ backgroundColor: 'black', padding: 7, borderRadius: 40 }}
                >
                    <Bell color={'white'} size={22} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.deleteButton,{marginLeft:5}]}
                onPress={()=>deletedChat(itemId)}
                >
                    <Trash2 color={'white'} size={22} />
                </TouchableOpacity>

            </View>
        );
    };

    function renderItem({ item }) {
        return (
            <Swipeable
                renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}
            >
                <TouchableHighlight style={{ marginTop: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={item.image} style={styles.img} />

                        <View style={{ flex: 1, paddingHorizontal: 10 }}>
                            <Text style={{ color: 'black', fontSize: 18, fontWeight: '600' }}>{item.name}</Text>
                            <Text style={{ color: 'grey' }}>{item.message}</Text>
                        </View>

                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ color: 'grey' }}>{item.time}</Text>
                            <View
                                style={{
                                    backgroundColor: '#F04A4C',
                                    paddingHorizontal: 5,
                                    width: 20,
                                    marginLeft: 25,
                                    borderRadius: 15,
                                    height: 20,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 3,
                                }}
                            >
                                <Text style={{ color: 'white', fontSize: 12 }}>{item.totalMessage}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            </Swipeable>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
                <Search color={'white'} size={25} />
                <Text style={{ color: 'white', fontSize: 25 }}>Home</Text>
                <Image source={require('../assets/profile.png')} style={styles.img} />
            </View>

            {/* Status List */}
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 20, marginRight: 15, maxHeight: 60, marginHorizontal: 20 }}
            >
                {
                    data.map((item) =>
                        <TouchableOpacity key={item.id} style={{ marginRight: 20 }}>
                            <Image source={item.image} style={styles.img} />
                            <Text style={{ color: 'white', textAlign: 'center' }}>{item.name}</Text>
                        </TouchableOpacity>
                    )
                }
            </ScrollView>

            <View style={styles.chatList}>
                {
                    chatData.length ? (
                        <View style={{ marginLeft: 20, marginRight: 20, marginVertical: 40 }}>
                            <FlatList
                                data={chatData}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id.toString()}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    ) : (
                        <Text>No Chats Yet</Text>
                    )
                }
            </View>
        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    img: {
        height: 45,
        width: 45,
        resizeMode: 'contain'
    },
    chatList: {
        backgroundColor: 'white',
        flex: 1,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        marginTop: 30
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        padding: 7,
        borderRadius: 40
    },
    deleteText: {
        color: 'white',
        fontWeight: '600'
    }
});
