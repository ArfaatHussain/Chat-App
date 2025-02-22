import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TextInput, TouchableOpacity } from 'react-native';
import {User} from 'lucide-react-native';
const FacebookLogo = require("../assets/FacebookLogo.png");
const GoogleLogo = require("../assets/GoogleLogo.png");
const AppleLogo = require("../assets/AppleLogo.png");

function Login() {

    const logoArray = [FacebookLogo, GoogleLogo, AppleLogo]
    const [hidePassword,setHidePassword] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <SafeAreaView style={styles.container} >
            <View style={{ alignItems: 'center', marginTop: 30 }} >
                <Text style={{ color: '#000E08', fontSize: 18, fontWeight: '600' }} >Login to Chatbox</Text>

                <Text style={{ color: '#797C7B', marginTop: 10, textAlign: 'center', paddingHorizontal: 26 }} >Welcome back! Sign in using your social account or email to continue with us </Text>
            </View>

            <View style={styles.inputBox} >
                <TextInput
                    placeholder='Enter Username'
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                // style={styles.input}            
                />

                <User size={24} color={'grey'} />

            </View>

            <View style={styles.inputBox} >
                <TextInput
                    placeholder='Enter password'
                    value={username}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={hidePassword}
                // style={styles.input}            
                />

            <TouchableOpacity 
            onPress={()=>setHidePassword(!hidePassword)}
            >
                <User size={24} color={'grey'} />
            </TouchableOpacity>

            </View>

            {/* Social Media Accounts Login Buttons  */}

            <View style={styles.loginBtnContainer} >

                <View style={{
                    borderColor: 'black',
                    borderWidth: 1,
                    borderRadius: 40,
                    paddingVertical:10,
                    paddingHorizontal:10
                }} >
                    <Image source={require('../assets/AppleLogo.png')} style={styles.logoImg} />
                </View>

                <View style={{
                    borderColor: 'black',
                    borderWidth: 1,
                    borderRadius: 40,
                    paddingVertical:10,
                    paddingHorizontal:10
                }} >
                    <Image source={require('../assets/FacebookLogo.png')} style={styles.logoImg} />
                </View>

                <View style={{
                    borderColor: 'black',
                    borderWidth: 1,
                    borderRadius: 40,
                   padding:10
                }} >
                    <Image source={require('../assets/GoogleLogo.png')} style={styles.logoImg} />
                </View>

            </View>

        </SafeAreaView>
    )
}

export default Login;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        // justifyContent:'center',
        // alignItems:'center'
    },
    inputBox: {
        // backgroundColor:'#f2f2f2',
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
        marginHorizontal: 20,
        marginTop: 30,
        paddingVertical: 5,
        flexDirection: 'row',
    },
    loginBtnContainer: {
        display: 'flex',
        flexDirection:'row',
        justifyContent:'space-around'
    },
    logoImg: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
        // marginHorizontal:10,
        // // backgroundColor:'red',
        // // padding:10,

    }


})