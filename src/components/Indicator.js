import { TouchableOpacity, Text, StyleSheet,ActivityIndicator } from 'react-native';

const Indicator = (props)=>{
    return (
        <ActivityIndicator color={'orange'} size={65} animating={true} style={props.style}/>
    )
}

export default Indicator;