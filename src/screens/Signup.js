import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TextInput, TouchableOpacity } from 'react-native';
import { User, Eye, EyeOff } from 'lucide-react-native';
import Btn from '../components/Btn';
// import { auth } from '../../firebaseConfig';
// import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import Firebase signup method

function Signup() {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupIndicator, setSignupIndicator] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // For showing signup errors

  // Function to authenticate user via Firebase Authentication (Signup)
  const authenticateUser = async () => {
    setSignupIndicator(true);
    setErrorMessage(''); // Clear any previous error messages

    // Check if passwords match
    if (password !== confirmPassword) {
      setSignupIndicator(false);
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      // Create a new user with Firebase Authentication
      // await createUserWithEmailAndPassword(auth, email, password);
      setSignupIndicator(false);
      // Handle successful signup (Navigate to the next screen, etc.)
      console.log('User signed up successfully');
    } catch (error) {
      setSignupIndicator(false);
      setErrorMessage(error.message); // Display error message if signup fails
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: 'center', marginTop: 30 }}>
        <Text style={{ color: 'white', fontSize: 34, fontWeight: '600' }}>Create Account</Text>
        <Text style={{ color: '#797C7B', marginTop: 20, textAlign: 'center', paddingHorizontal: 26, fontSize: 16 }}>
          Join us today! Sign up with your email and password to get started
        </Text>
      </View>

      <View style={[styles.inputBox, { marginTop: 25 }]}>
        <TextInput
          placeholder="Enter Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
          placeholderTextColor={'grey'}
        />
        <User size={24} color={'grey'} />
      </View>

      <View style={[styles.inputBox, { marginTop: 10 }]}>
        <TextInput
          placeholder="Enter Password"
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

      <View style={[styles.inputBox, { marginTop: 10 }]}>
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          secureTextEntry={hideConfirmPassword}
          style={styles.input}
          placeholderTextColor={'grey'}
        />
        <TouchableOpacity onPress={() => setHideConfirmPassword(!hideConfirmPassword)} style={{ justifyContent: 'center' }}>
          {!hideConfirmPassword ? <Eye size={24} color={'grey'} /> : <EyeOff size={24} color={'grey'} />}
        </TouchableOpacity>
      </View>

      {/* Display error message if signup fails */}
      {errorMessage ? (
        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{errorMessage}</Text>
      ) : null}

      <Btn
        text={'Sign Up'}
        style={{ marginVertical: 20 }}
        loginIndicator={signupIndicator}
        loginIndicatorStyle={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
        onPress={authenticateUser}
      />

      {/* Social Media Accounts Signup Buttons */}
      <View style={styles.loginBtnContainer}>
        <View
          style={{
            borderColor: 'white',
            borderWidth: 1,
            borderRadius: 40,
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}
        >
          <Image source={require('../assets/AppleLogo.png')} style={[styles.logoImg, { tintColor: 'white' }]} />
        </View>

        <View
          style={{
            borderColor: 'white',
            borderWidth: 1,
            borderRadius: 40,
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}
        >
          <Image source={require('../assets/FacebookLogo.png')} style={styles.logoImg} />
        </View>

        <View
          style={{
            borderColor: 'white',
            borderWidth: 1,
            borderRadius: 40,
            padding: 10,
          }}
        >
          <Image source={require('../assets/GoogleLogo.png')} style={styles.logoImg} />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Signup;

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
    fontSize: 17,
  },
  logoImg: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
});
