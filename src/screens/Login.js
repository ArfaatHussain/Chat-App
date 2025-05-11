import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TextInput, TouchableOpacity } from 'react-native';
import { User, Eye, EyeOff } from 'lucide-react-native';
import Btn from '../components/Btn';

function Login(props) {
  const [hidePassword, setHidePassword] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginIndicator, setLoginIndicator] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // For showing login errors

  // Function to authenticate user using Firebase Authentication
  const authenticateUser = async () => {
    setLoginIndicator(true);
    setErrorMessage(''); // Clear any previous error messages

    try {
      // Sign in with Firebase Authentication
      // await signInWithEmailAndPassword(auth, username, password);
      setLoginIndicator(false);
      // Handle successful login (Navigate to the next screen, etc.)
      console.log('User signed in');
    } catch (error) {
      setLoginIndicator(false);
      setErrorMessage(error.message); // Display error message if authentication fails
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', marginTop: 30 }}>
        <Text style={{ color: 'white', fontSize: 34, fontWeight: '600' }}>Login to Chatbox</Text>
        <Text style={{ color: '#797C7B', marginTop: 20, textAlign: 'center', paddingHorizontal: 26, fontSize: 16 }}>
          Welcome back! Sign in using your social account or email to continue with us
        </Text>
      </View>

      <View style={[styles.inputBox, { marginTop: 25 }]}>
        <TextInput
          placeholder="Enter Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
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

      {/* Display error message if login fails */}
      {errorMessage ? (
        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{errorMessage}</Text>
      ) : null}

      <Btn
        text={'Login'}
        style={{ marginVertical: 20 }}
        loginIndicator={loginIndicator}
        loginIndicatorStyle={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
        onPress={authenticateUser}
      />

      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 28 }}
      >
        <Text style={{ color: 'white', fontSize: 16 }} >Don't have an account?   </Text>
        <TouchableOpacity
        style={{marginLeft:-10}}
        onPress={()=> props.navigation.navigate('Signup')}
        >
          <Text style={{ color: 'orange', fontSize: 18 }} > Sign up </Text>
        </TouchableOpacity>
      </View>



    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingVertical: 10,
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
