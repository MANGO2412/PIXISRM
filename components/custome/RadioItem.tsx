import {View,Image,StyleSheet,StyleProp,ViewStyle,Pressable} from "react-native";
import {useState} from "react"
import {Text} from  "@/components/ui"
import {FC,useContext} from "react"
import type {RadioStation} from "@/interface/radio"
import {usePlayerContext} from "@/context/player/player-context"
import {GlobalContext} from "@/context/reduceContext";
import { useRouter } from 'expo-router';


const RadioItem:FC<{radio:RadioStation,style?:StyleProp<ViewStyle>,typeView?:"default"|"footer"}>=({radio,style,typeView="default"})=>{
    let navigation=useRouter()
    const [error, setError] = useState<boolean>(false);
    const {dispatch}=useContext(GlobalContext)
    const {setSelectRadioStation,setSelectSongPlaying,player}=usePlayerContext()

    const formatVotes = (votes:number) => {
        if (votes >= 1000000) return `${(votes/1000000).toFixed(1)}M`;
        if (votes >= 1000) return `${(votes/1000).toFixed(1)}K`;
        return `${votes}`;
    }

    const playSong=()=>{
      if(typeView=="default"){
        player?.replace("");
        setSelectSongPlaying(undefined)
        dispatch({ type: "SET_PLAYLIST", payload: [] });
        setSelectRadioStation(radio);
      }
      navigation.navigate("/playedradio");
    }

    if(typeView==="footer"){
        return(
            <Pressable onPress={playSong}>
            <View style={[style,styles.containerFooter]}>
                <Image 
                  source={radio.favicon?error?require("@/assets/notUrlImage.png"):{uri:radio.favicon}:require("@/assets/notUrlImage.png")} 
                  style={styles.imageFooter} defaultSource={require("@/assets/notUrlImage.png")}   
                  onError={() => {
                    setError(true)
                  }}
                />
                  <Text size="lg" className="color-typography-950">{radio.name.length>27?radio.name.substring(0,27)+"...":radio.name}</Text>
             </View>
            </Pressable>
            )
    }

    return(
    <Pressable onPress={playSong}>
    <View style={style}>
        <Image 
          source={radio.favicon?error?require("@/assets/notUrlImage.png"):{uri:radio.favicon}:require("@/assets/notUrlImage.png")} 
          style={styles.image} defaultSource={require("@/assets/notUrlImage.png")}   
          onError={() => {
            setError(true)
          }} 

        />
        <Text size="lg" className="color-typography-950">{radio.name.length>12?radio.name.substring(0,12)+"...":radio.name}</Text>
        <Text size="sm">{radio.country.length>15?radio.country.substring(0,15)+"...":radio.country}</Text>
        <Text size="sm" className="color-orange-500">{formatVotes(radio.votes)} votos</Text>
     </View>
    </Pressable>
    )
}


const styles=StyleSheet.create({
    containerFooter:{
      display:"flex",
      flexDirection:"row",
      alignItems:"center",
      gap:10,
      width:300
    },
    image:{
        width:120,
        height:120,
        borderRadius:9
    },
    imageFooter:{
        width:50,
        height:50,
        borderRadius:9
    }

})

export default RadioItem;
