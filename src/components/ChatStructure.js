import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { GiftedChat, InputToolbar, Send, Message } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';

function ChatStructure() {
  const [messages, setMessages] = useState([]);

  // useEffect(() => {
  //   const unsubscribe = db.collection('messages')
  //     .orderBy('createdAt', 'desc')
  //     .onSnapshot(snapshot => {
  //       const fetchedMessages = snapshot.docs.map(doc => {
  //         const data = doc.data();
  //         return {
  //           _id: doc.id,
  //           text: data.text,
  //           createdAt: data.createdAt.toDate(),
  //           user: {
  //             _id: data.userId,
  //             name: data.userName,
  //             avatar: data.userAvatar,
  //           },
  //           image: data.image || null,
  //         };
  //       });
  //       setMessages(fetchedMessages.reverse());
  //     });

  //   return () => unsubscribe();
  // }, []);

  const onSend = useCallback((messages = []) => {
    // Add message to Firestore
    const message = messages[0];
    db.collection('messages').add({
      text: message.text || '',
      createdAt: new Date(),
      userId: message.user._id,
      userName: message.user.name,
      userAvatar: message.user.avatar,
      image: message.image || null,
    });
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageMessage = {
        _id: Math.random(),
        text: '',
        createdAt: new Date(),
        user: {
          _id: 1,
        },
        image: result.assets[0].uri,
      };

      onSend([imageMessage]); // Send the image as a message
    } else {
      console.log('User cancelled image picker');
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
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
