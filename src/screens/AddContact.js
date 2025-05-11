import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import Btn from '../components/Btn';
import Toast from 'react-native-simple-toast';
import { API_URL } from '../Constant';
import axios from 'axios';
import TransparentLoader from '../components/TransparentLoader';
import uuid from 'react-native-uuid';
import { useGlobalState } from '../context/GlobalStateContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AddContact = (props) => {
    const [contactName, setContactName] = useState('');
    const [email, setEmail] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const { user, setUser } = useGlobalState();

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, [])
    function generateUserId() {
        return uuid.v4();
    }

    async function getUser() {
        try {
            const user = await AsyncStorage.getItem('user');
            if (user !== null) {
                setUser(user);
            }
        } catch (error) {
            console.error("Error retrieving user ID: ", error);
        } finally {
            setLoading(false);
        }
    }

    const handleAdd = async () => {
        if (!contactName || !email) {
            Toast.show("Please fill all the fields")
            return;
        }
        try {
            setShowLoader(true)
            const response = await axios.get(`${API_URL}/users.json`);
            const users = response.data;

            let isUserFound = false;
            let userToBeAdded;
            for (const key in users) {
                if (users[key].email.toLowerCase() === email.toLowerCase()) {
                    isUserFound = true;
                    userToBeAdded = users[key];
                    break;
                }
            }
            console.log("User to be added: ", userToBeAdded)
            if (isUserFound) {
                setShowLoader(false);
                const requestBody = {
                    userId: user.id,
                    contacts: [{
                        name: contactName,
                        userId: userToBeAdded.id,
                        lastMessage: 'Say Hello to your friend ' + contactName + "!",
                        time: new Date().toISOString(),
                        email: email,
                    }]
                }
                const newResponse = await axios.post(`${API_URL}/chats.json`, requestBody);

                if (newResponse.status == 200 || newResponse.status == 201) {
                    Toast.show("Contact added successfully");
                    props.navigation.goBack();
                }
                else {
                    Toast.show("Error adding contact", response.data);
                }
            }
            else {
                Toast.show("User not found.")
            }
        } catch (error) {
            console.error("Error: ", error)
        }
        finally {
            setShowLoader(false)
        }
    }
    return (

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
            <View
                style={{ justifyContent: 'center', alignItems: 'center', width: '80%', backgroundColor: 'black', borderRadius: 20, height: '45%' }}
            >
                <TextInput
                    placeholder='Enter Contact Name'
                    style={{
                        borderWidth: 1,
                        borderColor: 'white',
                        padding: 10,
                        margin: 10,
                        borderRadius: 12,
                        height: 60,
                        width: '80%',
                        color: 'white'
                    }}
                    placeholderTextColor={'white'}
                    value={contactName}
                    onChangeText={setContactName}
                />

                <TextInput
                    placeholder='Enter email'
                    style={{
                        borderWidth: 1,
                        borderColor: 'white',
                        padding: 10,
                        margin: 10,
                        borderRadius: 12,
                        height: 60,
                        width: '80%',
                        color: 'white'
                    }}
                    placeholderTextColor={'white'}
                    value={email}
                    onChangeText={setEmail}
                />

                <Btn style={{ width: '80%', marginTop: 20 }} text="Add"
                    onPress={handleAdd}
                />
            </View>


            {
                showLoader ?
                    <TransparentLoader isVisible={true} message={"Adding account..."} />
                    : null
            }
        </View>
    )
}
export default AddContact;