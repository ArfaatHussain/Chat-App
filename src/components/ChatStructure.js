import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'

export function ChatStructure() {
    const [messages, setMessages] = useState([{
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
            _id: 2,
            name: 'React Native',
            avatar: require('../assets/alex.png'),
        },
    },])

    useEffect(() => {
        console.log(messages);
        setMessages([
            {
                _id: 2,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 3,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ])
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        )
    }, [])

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
            }}
            //   messageContainerRef={}
            placeholder="Type a message..."
        />
    )
}