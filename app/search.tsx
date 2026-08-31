
import {View,StyleSheet,ScrollView} from "react-native"
import {Text} from "@/components/ui"
import {GlobalContext} from "@/context/reduceContext"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useContext} from "react"
import { useRouter, } from 'expo-router';


export default function search(){
   const {state,dispatch}=useContext(GlobalContext)
   let navigation=useRouter()
   

   return(
    <View style={styles.container}>
      <ScrollView >
         {state.results.map((query,index)=>
           <View key={index} style={styles.listItem} onTouchStart={()=>{navigation.replace("/searchresults"); dispatch({ type: "SET_QUERY", payload: query });}}>
              <View style={styles.sublistitem}>
                 <MaterialIcons size={30} name='search' color="#fff" />
                 <Text size="xl" bold>{query}</Text>
              </View>
              <MaterialIcons size={30} name='arrow-outward' color="#fff"  />
           </View>
          )}
      </ScrollView>
    </View> 
   )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        paddingStart:20,
        paddingEnd:20,
        paddingTop:10
    },
    listItem:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        marginBottom:10,
    },
    sublistitem:{
       display:"flex",
       flexDirection:"row",
       alignItems:"center",
       gap:10
    }
})