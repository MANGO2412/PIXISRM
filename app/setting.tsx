import {View,StyleSheet} from 'react-native'
import {Text} from "@/components/ui"

export default function setting (){
 return(
    <View style={styles.container}>
      <Text>AUn esta en desarrollo, estara listo muy pronto</Text>
    </View>
 )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    }
})