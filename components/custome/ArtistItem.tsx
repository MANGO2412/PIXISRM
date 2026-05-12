import {View,Image,StyleProp,ViewStyle,Pressable} from "react-native"
import {useRouter} from "expo-router"
import {FC} from "react"
import {Text} from "@/components/ui"
import type {Artist} from "@/interface/artist"


const  ArtistItem:FC<Artist&{style:StyleProp<ViewStyle>}>=({browseId,name,thumbnail,style})=>{
    let navigation=useRouter()
        
    return (
        <Pressable   onPress={()=>navigation.navigate(`/artistmodal?browseId=${browseId}`)}>
           <View style={style}>
              <Image source={{uri:thumbnail}} style={{borderRadius:70,width:118,height:118}}/>
              <Text size="lg" className="color-typography-950 text-center">{name.length>12?name.substring(0,12)+"...":name}</Text>
           </View>
        </Pressable>
    )
}


export default ArtistItem