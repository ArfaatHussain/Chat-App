import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { GiftedChat, InputToolbar, Send, Bubble } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../config';
import { ref, set, push, onChildAdded, off, update, get } from 'firebase/database';
import uuid from 'react-native-uuid';
import { useFocusEffect } from '@react-navigation/native'; // navigation-aware effect

function ChatStructure({ receiverData, currentUser }) {
  const { id: receiverId } = receiverData;
  const [allChat, setAllChat] = useState([]);

  const getRoomId = (senderId, receiverId) => {
    const [firstUser, secondUser] = senderId < receiverId
      ? [senderId, receiverId]
      : [receiverId, senderId];
    return `${firstUser}-${secondUser}`;
  };

  const onSend = useCallback((messages = []) => {
    const msg = messages[0];

    const msgData = {
      _id: uuid.v4(),
      text: msg.text || '',
      createdAt: new Date().toISOString(),
      user: {
        _id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.image,
      },
      image: msg.image || null,
      from: currentUser.id,
      to: receiverId,
      sendTime: new Date().getTime(),
      messageType: msg.image ? 'image' : 'text',
      roomId: getRoomId(currentUser.id, receiverId),
    };

    setAllChat((previousMessages) => GiftedChat.append(previousMessages, [msgData]));
    sndMsg(msgData);
  }, [currentUser, receiverId]);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
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
            createdAt: new Date().toISOString(),
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

  const sndMsg = async (msgData) => {
    try {
      const roomId = getRoomId(currentUser.id, receiverId);
      const messageId = uuid.v4();
      const msgRef = ref(db, `/messages/${roomId}/${messageId}`);
      await set(msgRef, msgData);

      const chatRef = ref(db, `chatList/${receiverId}/${currentUser.id}`);
      const chatData = {
        id: currentUser.id,
        name: currentUser.name,
        time: msgData.sendTime,
        image: currentUser.image,
        about: currentUser.about,
        email: currentUser.email,
        time: Date.now(),
        lastMessage: msgData.text,
      };
      const chatSnapshot = await get(chatRef);
      if (chatSnapshot.exists()) {
        await update(chatRef, chatData);
      }
      else {
        await set(chatRef, chatData);
      }
      const chatListRef = ref(db, `chatList/${currentUser.id}/${receiverId}`);
      const userToBeAdded = {
        about: receiverData.about,
        email: receiverData.email,
        id: receiverData.id,
        image: receiverData.image,
        name: receiverData.name,
        time: Date.now(),
        lastMessage: msgData.text,
      };
      await update(chatListRef, userToBeAdded);

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const roomId = getRoomId(currentUser.id, receiverId);
      const messagesRef = ref(db, `/messages/${roomId}`);

      const handleNewMessage = (snapshot) => {
        const message = snapshot.val();
        if (message.createdAt && typeof message.createdAt === 'string') {
          message.createdAt = new Date(message.createdAt);
        }
        setAllChat((previousMessages) => {
          const exists = previousMessages.some((m) => m._id === message._id);
          if (exists) return previousMessages;

          const updatedMessages = GiftedChat.append(previousMessages, [message]);
          return [...updatedMessages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        });
      };

      onChildAdded(messagesRef, handleNewMessage);

      return () => {
        off(messagesRef, 'child_added', handleNewMessage);
        setAllChat([]); // cleanup state
      };
    }, [currentUser.id, receiverId])
  );

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#0078FF',
        },
        left: {
          backgroundColor: '#e5e5ea',
        },
      }}
      textStyle={{
        right: { color: 'white' },
        left: { color: 'black' },
      }}
      renderTime={(timeProps) => (
        <Text style={styles.timeText}>
          {new Date(timeProps.currentMessage.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      )}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <GiftedChat
        messages={allChat}
        listViewProps={{ removeClippedSubviews: false }}
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
        renderBubble={renderBubble}
        textInputProps={{
          placeholder: 'Type message here...',
          placeholderTextColor: 'lightgrey',
        }}
        textInputStyle={styles.textInput}
      />
    </View>
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
  imagePicker: {
    marginLeft: 10,
    position: 'relative',
    top: -10,
    left: 5,
  },
  timeText: {
    fontSize: 10,
    color: '#eee',
    alignSelf: 'flex-end',
    marginTop: 2,
    paddingRight: 4,
    marginBottom: 5,
    marginRight: 5,
  },
});

export default ChatStructure;
