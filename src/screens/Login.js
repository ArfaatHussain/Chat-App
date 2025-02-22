import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TextInput, TouchableOpacity } from 'react-native';
import {User,Eye,EyeOff} from 'lucide-react-native';
import Btn from '../components/Btn';

function Login() {

    const [hidePassword,setHidePassword] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginIndicator, setLoginIndicator] = useState(false);

    function authenticateUser(){
        setLoginIndicator(true);
        setTimeout(() => {
            setLoginIndicator(false);
        }, 1000);
    }
    return (
        <SafeAreaView style={styles.container} >
            <View style={{ alignItems: 'center', marginTop: 30 }} >
                <Text style={{ color: 'white', fontSize: 34, fontWeight: '600' }} >Login to Chatbox</Text>

                <Text style={{ color: '#797C7B', marginTop: 20, textAlign: 'center', paddingHorizontal: 26,fontSize:16 }} >Welcome back! Sign in using your social account or email to continue with us </Text>
            </View>

            <View style={[styles.inputBox,{marginTop:25}]} >
                <TextInput
                    placeholder='Enter Username'
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                style={styles.input}   
                placeholderTextColor={'grey'}         
                />

                <User size={24} color={'grey'} />

            </View>

            <View style={[styles.inputBox,{marginTop:10}]} >
                <TextInput
                    placeholder='Enter password'
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={hidePassword}
                style={styles.input}    
                placeholderTextColor={'grey'}        
                />

            <TouchableOpacity 
            onPress={()=>setHidePassword(!hidePassword)}
            style={{justifyContent:'center'}}
            >
                {
                    !hidePassword?
                    <Eye size={24} color={'grey'} />
                    : <EyeOff size={24} color={'grey'}  />
                }
            </TouchableOpacity>

            </View>

            <Btn 
            text={"Login"}
            style={{marginVertical: 20}}
            loginIndicator={loginIndicator}
            loginIndicatorStyle={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent: 'center'}}
            onPress={authenticateUser}
            />

            {/* Social Media Accounts Login Buttons  */}

            <View style={styles.loginBtnContainer} >

                <View style={{
                    borderColor: 'white',
                    borderWidth: 1,
                    borderRadius: 40,
                    paddingVertical:10,
                    paddingHorizontal:10
                }} >
                    <Image source={require('../assets/AppleLogo.png')} style={[styles.logoImg,{tintColor:'white'}]} />
                </View>

                <View style={{
                    borderColor: 'white',
                    borderWidth: 1,
                    borderRadius: 40,
                    paddingVertical:10,
                    paddingHorizontal:10
                }} >
                    <Image source={require('../assets/FacebookLogo.png')} style={styles.logoImg} />
                </View>

                <View style={{
                    borderColor: 'white',
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
        backgroundColor:'black',
        paddingVertical:30
    },
    inputBox: {
        // backgroundColor:'#f2f2f2',
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white',
        marginHorizontal: 25,
        // marginTop: 30,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems:'center'
    },
    loginBtnContainer: {
        display: 'flex',
        flexDirection:'row',
        justifyContent:'space-around'
    },
    input:{
        flex:1,
        color:'white',
        fontSize:17
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