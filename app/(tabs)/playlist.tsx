import {View,StyleSheet} from "react-native"
import {
Text,
} from '@/components/ui'



export default function Playlist(){
    return (
        <View style={styles.container}>
            <Text>Es una pagina de busqueda</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    }
})