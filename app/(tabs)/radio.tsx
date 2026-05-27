import {View,StyleSheet} from "react-native"
import {
Text,
} from '@/components/ui'


export default function Radio(){
    return (
        <View style={styles.container}>
            <Text>Aun esta en desarrollo, muy pronto estara listo</Text>
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