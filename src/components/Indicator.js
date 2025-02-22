import { TouchableOpacity, Text, StyleSheet,ActivityIndicator } from 'react-native';

const Indicator = (props)=>{
    return (
        <ActivityIndicator color={'white'} size={25} animating={true} style={props.style}/>
    )
}

export default Indicator;