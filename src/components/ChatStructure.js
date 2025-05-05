import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import {
  GiftedChat,
  InputToolbar,
  Send,
  Message,
} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker'; // Import image picker

function ChatStructure() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'I have visited this place',
        createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
        user: {
          _id: 2,
          name: 'React Native',
          avatar:
            'https://img.freepik.com/free-photo/portrait-smiling-young-man-rubbing-his-hands_171337-10297.jpg',
        },
        image:
          'https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=1024x1024&w=0&k=20&c=z8_rWaI8x4zApNEEG9DnWlGXyDIXe-OmsAyQ5fGPVV8=',
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const handleImagePicker = () => {
    // Open the gallery to pick an image
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const { uri } = response.assets[0];
        const imageMessage = {
          _id: Math.random(),
          text: '',
          createdAt: new Date(),
          user: {
            _id: 1,
          },
          image: uri, // Add the image URI here
        };
        onSend([imageMessage]); // Send the image as a message
      }
    });
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
      renderInputToolbar={(props) => (
        <InputToolbar {...props} containerStyle={styles.inputToolbar} 


        renderActions={()=>(
          <TouchableOpacity onPress={handleImagePicker} style={styles.imagePicker}>
              <Icon name="image" size={25} color="white" />
            </TouchableOpacity>
        )}
        
        />
      )}
      renderSend={(props) => (
        <Send {...props}>
          <View style={styles.sendButton}>
            <Icon name="send" size={25} color="white" />
          </View>
        </Send>
      )}
      renderMessage={(props) => (
        <Message
          {...props}
          containerStyle={styles.messageContainer}
          bubbleStyle={styles.messageBubble}
          textStyle={styles.textMessage}
        />
      )}

      
        textInputProps={{
        placeholder: 'Type message here...',
        placeholderTextColor: 'lightgrey',
      }}

      textInputStyle={styles.textInput}
      
      
      
    />
  );
}

const styles = StyleSheet.create({
  inputToolbar: {
    backgroundColor: 'grey',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    marginTop: 10,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center', 
  },
  sendButton: {
    // marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 30,  
    marginRight:10
  },
  textInput: {
    color: 'white',
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  messageBubble: {
    maxWidth: '50%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: '#0078FF',
    marginBottom: 5,
  },
  textMessage: {
    color: 'white',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  imagePicker: {
    marginLeft: 10,
    position:'relative',
    top:-10,
    left:5
  }
});

export default ChatStructure;