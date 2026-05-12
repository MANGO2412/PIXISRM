import {Tabs} from 'expo-router'

import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';



export default function  TabLayout(){
    return(
        <Tabs screenOptions={{headerShown:false,tabBarInactiveTintColor:"white",tabBarActiveTintColor:"#FF6A1A"}}>
            <Tabs.Screen name='index' options={{title:"Inicio",tabBarIcon:({color})=><FontAwesome size={28} name='home' color={color}/>}}/>
            <Tabs.Screen name='library' options={{title:"Libreria",tabBarIcon:({color})=><MaterialIcons name="my-library-music" size={28} color={color} />}}/>
            <Tabs.Screen name='playlist' options={{title:"Pista",tabBarIcon:({color})=><MaterialIcons name="playlist-play" size={28} color={color} />}}/>
        </Tabs>
    )
}