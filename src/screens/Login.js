import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TextInput, TouchableOpacity } from 'react-native';
import { User, Eye, EyeOff } from 'lucide-react-native';
import Btn from '../components/Btn';
import { API_URL } from '../Constant';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import TransparentLoader from '../components/TransparentLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, get } from 'firebase/database';
import { db } from '../../config'
function Login(props) {
  const [hidePassword, setHidePassword] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  const isValidInput = () => {
    if (!email) {
      Toast.show("Email is required");
      return false;
    }
    if (!password) {
      Toast.show("Password is required");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!isValidInput()) {
      return;
    }
    try {
      setShowLoader(true);
      const userRef = ref(db, 'users');
      const snapshot = await get(userRef);
      console.log("Snapshot: ", snapshot);
      if (snapshot.exists()) {
        const users = snapshot.val();
        let matchedUser = null;

        for (const key in users) {
          if (users[key].email.toLowerCase() === email.toLowerCase()) {
            matchedUser = users[key];
            break;
          }
        }

        if (matchedUser == null) {
          Toast.show("User not found");
          setShowLoader(false);
          return;
        }

        if (matchedUser.password === password) {
          setShowLoader(false);
          await AsyncStorage.setItem('user', JSON.stringify(matchedUser));
          Toast.show("Login successful");
          props.navigation.navigate('Home');
        } else {
          Toast.show("Invalid email or password");
          setShowLoader(false);
        }
      }
      else {
        Toast.show("No user found");
        setShowLoader(false);
      }

    } catch (error) {
      console.error("Error occurred during login: ", error);
      setShowLoader(false);
      Toast.show("Error: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', marginTop: 30 }}>
        <Text style={{ color: 'white', fontSize: 34, fontWeight: '600' }}>Login to Chatbox</Text>
        <Text style={{ color: '#797C7B', marginTop: 20, textAlign: 'center', paddingHorizontal: 26, fontSize: 16 }}>
          Welcome back! Sign in using your email to continue with us
        </Text>
      </View>

      <View style={[styles.inputBox, { marginTop: 25 }]}>
        <TextInput
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor={'grey'}
        />
        <User size={24} color={'grey'} />
      </View>

      <View style={[styles.inputBox, { marginTop: 10 }]}>
        <TextInput
          placeholder="Enter password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={hidePassword}
          style={styles.input}
          placeholderTextColor={'grey'}
        />

        <TouchableOpacity onPress={() => setHidePassword(!hidePassword)} style={{ justifyContent: 'center' }}>
          {!hidePassword ? <Eye size={24} color={'grey'} /> : <EyeOff size={24} color={'grey'} />}
        </TouchableOpacity>
      </View>

      <Btn
        text={'Login'}
        style={{ marginVertical: 20 }}
        loginIndicatorStyle={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
        onPress={handleLogin}
      />

      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 28 }}
      >
        <Text style={{ color: 'white', fontSize: 16 }} >Don't have an account?   </Text>
        <TouchableOpacity
          style={{ marginLeft: -10 }}
          onPress={() => props.navigation.navigate('Signup')}
        >
          <Text style={{ color: 'orange', fontSize: 18 }} > Sign up </Text>
        </TouchableOpacity>
      </View>

      {
        showLoader ?
          <TransparentLoader isVisible={true} message={"Creating Account..."} />
          : null
      }

    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingVertical: 30,
  },
  inputBox: {
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    marginHorizontal: 25,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginBtnContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    height: 60
  },
  logoImg: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
});
