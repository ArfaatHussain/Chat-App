import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { GiftedChat, InputToolbar, Send, Message } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../config';
import { ref, set, push, onChildAdded, off } from 'firebase/database';
import uuid from 'react-native-uuid';

function ChatStructure({ chat, navigation, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState('');
  const [roomId, setRoomId] = useState("385207c8-27eb-4602-98a1-8c90920366e3");
  const [allChat, setAllChat] = useState([]);

  useEffect(() => {
    const uniqueChatId = uuid.v4();
    setChatId(uniqueChatId);

    if (chat.messages) {
      setMessages(chat.messages);
    }
  }, [chat]);

  useEffect(() => {
    const msgRef = ref(db, '/messages/' + roomId);
    const onChildAdd = snapshot => {
      const data = snapshot.val();
      if (Array.isArray(data.messages)) {
        const validMessages = data.messages
          .map(msg => ({
            ...msg,
            _id: msg._id?.toString() || uuid.v4(),
            createdAt: new Date(msg.createdAt),
          }))
          .filter(msg => msg.user && msg._id && msg.createdAt);
        setAllChat((state) => GiftedChat.append(state, validMessages));
      }
    };

    onChildAdded(msgRef, onChildAdd);
    return () => {
      off(msgRef, 'child_added', onChildAdd);
    };
  }, [roomId]);

  const onSend = useCallback((messages = []) => {
    const msg = messages[0];
    setAllChat((previousMessages) => GiftedChat.append(previousMessages, messages));
    sndMsg(msg);
  }, []);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      const storage = getStorage();
      const fileRef = storageRef(storage, 'chat_images/' + new Date().toISOString());

      const response = await fetch(imageUri);
      const blob = await response.blob();

      uploadBytes(fileRef, blob).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          const imageMessage = {
            _id: uuid.v4(),
            text: '',
            createdAt: new Date(),
            user: {
              _id: currentUser.id,
              name: currentUser.name,
              avatar: currentUser.image,
            },
            image: downloadURL,
          };
          onSend([imageMessage]);
        });
      });
    } else {
      console.log('User cancelled image picker');
    }
  };

  const sndMsg = async (msg) => {
    try {
      const msgData = {
        roomId: roomId,
        from: currentUser.id,
        to: chat.id,
        messages: [{
          ...msg,
          _id: msg._id?.toString() || uuid.v4(),
          createdAt: msg.createdAt.toString()
        }],
        sendTime: new Date().getTime(),
        messageType: msg.image ? 'image' : 'text',
      };

      const newReference = push(ref(db, 'messages/' + roomId));
      msgData.id = newReference.key;
      await set(newReference, msgData);
      console.log("Message data updated");

      const chatListUpdate = {
        lastMsg: msg.text || 'Photo',
        sendTime: msgData.sendTime,
      };

      await Promise.all([
        set(ref(db, `/chatlist1/${currentUser.id}/${chat.id}`), chatListUpdate),
        set(ref(db, `/chatlist1/${chat.id}/${currentUser.id}`), chatListUpdate),
      ]);
      console.log('Chatlist updated for both users');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <GiftedChat
      messages={allChat}
      onSend={onSend}
      user={{
        _id: currentUser.id,
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
                <Image source={{ uri: imageUri }} style={styles.imageMessage} />
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
