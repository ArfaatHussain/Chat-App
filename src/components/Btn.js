import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Indicator from './Indicator';
import { useState } from 'react';

const Btn = (props) => {

    const loginIndicatorStyle = props.loginIndicatorStyle


    return (
        <TouchableOpacity style={[props.style, styles.btn,loginIndicatorStyle]}
            activeOpacity={0.7}
            onPress={props.onPress }
            >
                {
                    props.loginIndicator?
                    <Indicator style={{paddingRight:40}} />
                    :null
                }
            <Text style={[styles.btnText]}>{props.text}</Text>
        </TouchableOpacity>
    )
}

export default Btn;

const styles = StyleSheet.create({
    btn: {
        backgroundColor: 'orange', borderRadius: 14, paddingVertical: 10, marginHorizontal: 30,
        paddingVertical:15
    },
    btnText: {
        color: 'white', fontWeight: '700', textAlign: 'center',
        fontSize:18,
        
    }

})