import {Image,View,StyleSheet} from 'react-native'
import {Text} from "@/components/ui"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';




export function RightActionHeader({canGoBack,tintColor}:{ tintColor?: string | undefined; canGoBack?: boolean | undefined; }){
 
  return (
      <View style={styles.container}>
        <Link href="/search" push asChild>
         <MaterialIcons size={30} name='search' color={tintColor} />
        </Link>
        <Link href="/setting" push asChild>
        <MaterialIcons size={30} name='settings' color={tintColor} />
        </Link>
    </View>
  )
}


export default function LogoHeader({children,tintColor}:{children: string; tintColor?: string | undefined; }){
    return(
        <View style={styles.container}>
           <Image style={styles.image} source={require("@/assets/logo_without_background.png")} />
           <Text size='2xl' className='inline-block align-bottom tracking-wide' >PIXIS RM</Text>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
      display:"flex",
      flexDirection:"row",
    },
    image:{
        width:42,
        height:38
    }
})

