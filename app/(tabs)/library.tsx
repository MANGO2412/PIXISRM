import {View,StyleSheet} from "react-native"
import {
Text,
} from '@/components/ui'


export default function Library(){
    return (
        <View style={styles.container}>
            <Text>Esto es una pruba 1,2,3,4,5,6,7,8</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },

    button:{
        fontSize:20,
        textDecorationLine:"underline",
        color:"#fff"
    }
})