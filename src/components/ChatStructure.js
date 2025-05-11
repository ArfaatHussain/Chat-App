import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { GiftedChat, InputToolbar, Send, Message } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';  // Firebase Storage imports
import { db } from '../../config';  // Firebase DB imports
import uuid from 'react-native-uuid';  // Import UUID to generate unique chatId

function ChatStructure({ chat, navigation,currentUser}) {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState('');
  // const {user,setUser} = useGlobalState();
  useEffect(() => {
    const uniqueChatId = uuid.v4();
    setChatId(uniqueChatId);

    if (chat.messages) {
      setMessages(chat.messages);
    }
  }, [chat]);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
  }, []);

  const handleImagePicker = async () => {
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: false,
    //   quality: 1,
    // });

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,  // Updated to use MediaType enum
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;

      const storage = getStorage();
      const storageRef = ref(storage, 'chat_images/' + new Date().toISOString());

      // Upload the image file
      const response = await fetch(imageUri);
      const blob = await response.blob();
      uploadBytes(storageRef, blob).then((snapshot) => {
        console.log('Image uploaded successfully');
        // Get the download URL of the uploaded image
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          const imageMessage = {
            id: Math.random().toString(),  // Generate a unique ID for the message
            text: '',  // No text, just image
            createdAt: new Date(),
            user: {
              id: chat.id,  // Use chat user ID
              name: chat.name,  // Use chat user name
            },
            image: downloadURL,  // Store the URL of the uploaded image
            chatId: chatId,  // Chat ID to link the message to the chat
          };

          onSend([imageMessage]);  // Send the image message
        });
      });
    } else {
      console.log('User cancelled image picker');
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        id: currentUser.id,
        name: currentUser.name, 
        avatar: currentUser.image,
      }}
      renderInputToolbar={(props) => (
        <InputToolbar
          {...props}
          containerStyle={styles.inputToolbar}
          renderActions={() => (
            <TouchableOpacity onPress={handleImagePicker} style={styles.imagePicker}>
              <Icon name="image" size={28} color="white" />
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
          renderMessageImage={(imageProps) => {
            const imageUri = imageProps.currentMessage.image;
            return (
              <View style={styles.messageImageContainer}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.imageMessage}
                />
              </View>
            );
          }}
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
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 30,
    marginRight: 10,
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
    position: 'relative',
    top: -10,
    left: 5,
  },
  messageImageContainer: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  imageMessage: {
    width: 150,
    height: 150,
    borderRadius: 15,
    marginBottom: 5,
  },
});

export default ChatStructure;
