import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, TouchableHighlight } from 'react-native';
import { Search, Trash2, Bell, ArrowLeft, Phone, Video } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Swipeable from 'react-native-gesture-handler/Swipeable';
import ChatStructure from '../components/ChatStructure';
const Chat = ({ navigation, route }) => {

    const { receiverData, currentUser } = route.params;


    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>

            <View
                style={styles.header}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft size={30} color='white' />
                </TouchableOpacity>


                <View
                    style={styles.middleHeader}
                >
                    <Image source={{ uri: receiverData.image }} style={styles.headerImg} />
                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 18, marginLeft:10 }} >{receiverData.name}</Text>

                </View>
            </View>

            {/* Chat Structure  */}

            <ChatStructure receiverData={receiverData} navigation={navigation} currentUser={currentUser} />

        </View>
    )
}

export default Chat;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomColor: 'grey',
        borderBottomWidth: 1
    },
    headerImg: {
        height: 40,
        width: 40,
        borderRadius: 25,
        resizeMode: 'contain',
        // marginLeft:10
        // borderColor:'white',
        // borderWidth:2
    },
    middleHeader: {
        marginLeft: 10,
        flex: 1,
        // borderColor:'red',
        // borderWidth:1,
        flexDirection: 'row',
        alignItems:'center'
        // alignItems:'center'
    }

})