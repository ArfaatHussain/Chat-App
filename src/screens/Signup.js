import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TextInput, TouchableOpacity } from 'react-native';
import { User, Eye, EyeOff } from 'lucide-react-native';
import Btn from '../components/Btn';
import { API_URL } from '../Constant';
import Toast from 'react-native-simple-toast';
function Signup(props) {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  // Function to authenticate user via Firebase Authentication (Signup)
  const authenticateUser = async () => {
    setShowLoader(true);

    // Check if passwords match
    if (password !== confirmPassword) {
      setShowLoader(false);
      return;
    }

    try {
      setShowLoader(false);
      console.log('User signed up successfully');
    } catch (error) {
      setShowLoader(false);
      Toast.show("Error: ", error.message);
    }
  };

  return (
    <View style={styles.container}>
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

      <Btn
        text={'Sign Up'}
        style={{ marginVertical: 20 }}
        onPress={authenticateUser}
      />

      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 28 }}
      >
        <Text style={{ color: 'white', fontSize: 16 }} >Already have a account?   </Text>
        <TouchableOpacity
          style={{ marginLeft: -10 }}
          onPress={() => props.navigation.navigate('Login')}
        >
          <Text style={{ color: 'orange', fontSize: 18 }} > Login</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    fontSize: 16,
    height: 60
  },
  logoImg: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
  },
});
