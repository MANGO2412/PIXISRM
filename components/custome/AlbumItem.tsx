import {View,Image,StyleSheet,StyleProp,ViewStyle,Pressable} from "react-native"
import {Text} from  "@/components/ui"
import {FC} from "react"
import type {Album} from "@/interface/album"
import {useRouter} from "expo-router"


const AlbumItem:FC<Album&{style?:StyleProp<ViewStyle>}>=({thumbnail,browseId,title,artist,year,style})=>{
     let navigation=useRouter()
    
    return(
    <Pressable onPress={()=>navigation.navigate(`/albummodal?browseId=${browseId}`)}>
    <View style={style}>
        <Image source={{uri:thumbnail}} style={styles.image} />
        <Text size="lg" className="color-typography-950">{title.length>12?title.substring(0,12)+"...":title}</Text>
        <Text size="sm">{year}</Text>
     </View>
    </Pressable>
    )
}


const styles=StyleSheet.create({
    image:{
        width:120,
        height:120,
        borderRadius:9
    }

})

export default AlbumItem;
