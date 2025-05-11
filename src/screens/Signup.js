import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { User, Eye, EyeOff } from 'lucide-react-native';
import Btn from '../components/Btn';
import { API_URL } from '../Constant';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import uuid from 'react-native-uuid';
import TransparentLoader from '../components/TransparentLoader';
import { getDatabase, ref, get, set } from 'firebase/database';  // Import necessary Firebase functions
import { db } from '../../config';

function Signup(props) {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');

  const generateUserId = () => {
    return uuid.v4();
  };

  const isValidInput = () => {
    if (!email) {
      Toast.show("Email is required");
      return false;
    }
    if (!password) {
      Toast.show("Password is required");
      return false;
    }
    if (!confirmPassword) {
      Toast.show("Confirm password is required");
      return false;
    }
    if (password !== confirmPassword) {
      Toast.show("Password does not match with confirm password");
      return false;
    }
    if (!about) {
      Toast.show("About is required");
      return false;
    }
    return true;
  };

  const checkEmailExists = async () => {
    try {
      const userRef = ref(db, 'users');
      const snapshot = await get(userRef);
      const users = snapshot.val();
      for (const key in users) {
        if (users[key].email === email) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking email: ", error);
      return false;
    }
  };
  const handleSignup = async () => {
    if (!isValidInput()) {
      return;
    }
    try {
      setShowLoader(true);

      const emailExists = await checkEmailExists();
      if (emailExists) {
        Toast.show("Email already exists");
        setShowLoader(false);
        return;
      }

      // Create user object
      const requestBody = {
        id: generateUserId(),
        name: name,
        email: email,
        password: password,
        chats: [],
        image: 'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png',
        about: about,
      };

      // Save the new user to Firebase Realtime Database
      const newUserRef = ref(db, 'users/' + requestBody.id);
      await set(newUserRef, requestBody);

      setShowLoader(false);
      Toast.show("Account created successfully");
      props.navigation.navigate('Login');
    } catch (error) {
      console.error("Error creating account: ", error);
      setShowLoader(false);
      Toast.show("Error: " + error.message);
    }
  };

  return (
    <View
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Create Account</Text>
          <Text style={styles.subHeaderText}>
            Join us today! Sign up with your email and password to get started
          </Text>
        </View>

        <View style={[styles.inputBox, { marginTop: 25 }]}>
          <TextInput
            placeholder="Enter name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor={'grey'}
          />
        </View>

        <View style={[styles.inputBox, { marginTop: 25 }]}>
          <TextInput
            placeholder="Enter email"
            value={email}
            onChangeText={(text) => setEmail(text)}
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
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)} style={styles.eyeIcon}>
            {!hidePassword ? <Eye size={24} color={'grey'} /> : <EyeOff size={24} color={'grey'} />}
          </TouchableOpacity>
        </View>

        <View style={[styles.inputBox, { marginTop: 10 }]}>
          <TextInput
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            secureTextEntry={hideConfirmPassword}
            style={styles.input}
            placeholderTextColor={'grey'}
          />
          <TouchableOpacity onPress={() => setHideConfirmPassword(!hideConfirmPassword)} style={styles.eyeIcon}>
            {!hideConfirmPassword ? <Eye size={24} color={'grey'} /> : <EyeOff size={24} color={'grey'} />}
          </TouchableOpacity>
        </View>

        <View style={[styles.inputBox, { marginTop: 25 }]}>
          <TextInput
            placeholder="Enter about"
            value={about}
            onChangeText={setAbout}
            style={styles.input}
            placeholderTextColor={'grey'}
          />
        </View>

        <Btn text={'Sign Up'} style={styles.button} onPress={handleSignup} />

        <View style={styles.loginLink}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
            <Text style={styles.loginLinkText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {
        showLoader ?
          <TransparentLoader isVisible={true} message={"Creating Account..."} />
          : null
      }
    </View>
  );
}

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    color: 'white',
    fontSize: 34,
    fontWeight: '600',
  },
  subHeaderText: {
    color: '#797C7B',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  inputBox: {
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    height: 60,
  },
  eyeIcon: {
    justifyContent: 'center',
  },
  button: {
    marginVertical: 20,
  },
  loginLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: 'white',
    fontSize: 16,
  },
  loginLinkText: {
    color: 'orange',
    fontSize: 18,
  },
});
