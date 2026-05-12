import {View,StyleSheet} from "react-native"
import {Text} from "@/components/ui"
import SongItem from "@/components/custome/SongItem"
import {FC, ReactElement,useContext} from "react"
import {SongContext} from "@/context/song/song-context"
import {useRouter} from "expo-router"

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons'


const OptionEleement:FC<{icon:ReactElement,label:string,onclick?:()=>void}>=({icon,label,onclick})=>{
   return(
    <View style={{display:"flex",flexDirection:"row",padding:10}} onTouchStart={onclick}>
       {icon}
       <Text size="xl" className='ml-4 inline-block align-bottom tracking-wide'>{label}</Text>
     </View>
   )
}

export default function songoptions(){
  const {selectSong}=useContext(SongContext)
  let navigation=useRouter()



   return(
    <View style={styles.container}>
      <View style={styles.boxView}></View>
      <View style={styles.thumbnail}>
        {selectSong && <SongItem {...selectSong} />}
      </View>
      <View style={{width:400}}>
          <OptionEleement icon={<Ionicons size={30} name="radio" color="white"/>} label="Iniciar radio"/>
          <OptionEleement icon={<MaterialIcons size={30} name="playlist-play" color="white"/>} label="Reproducir a continuacion"/>
          <OptionEleement icon={<MaterialCommunityIcons name="playlist-music" size={30} color="white" />} label="Añadir a la cola"/>
          <OptionEleement icon={<MaterialIcons size={30} name="playlist-add" color="white"/>} label="Añadir a una lista"/>
          <OptionEleement icon={<MaterialIcons size={30} name="album" color="white"/>} label="Ver album"/>
          <OptionEleement onclick={()=>navigation.replace(`/artistmodal?browseId=${selectSong?.artist.browseId}`)}  icon={<FontAwesome name="user" size={30} color="white" />} label={`Mas de ${selectSong?.artist.name}`} />
      </View>
    </View>
   )
}


const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
    },
    thumbnail:{
      paddingHorizontal:60,
      paddingVertical:20,
      borderBottomColor:"white",
      borderBottomWidth:2,
      width:500
    },
    boxView:{
      height:5,
      width:50,
      borderRadius:2,
      marginBottom:3,
      backgroundColor:"white"    
    }
})