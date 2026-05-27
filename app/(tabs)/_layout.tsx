import {Tabs} from 'expo-router'

import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';



export default function  TabLayout(){
    return(
        <Tabs screenOptions={{headerShown:false,tabBarInactiveTintColor:"white",tabBarActiveTintColor:"#FF6A1A"}}>
            <Tabs.Screen name='index' options={{title:"Musica",tabBarIcon:({color})=><FontAwesome size={28} name='music' color={color}/>}}/>
            <Tabs.Screen name='radio' options={{title:"Radio",tabBarIcon:({color})=><MaterialIcons name="radio" size={28} color={color} />}}/>
            <Tabs.Screen name='playlist' options={{title:"Biblioteca",tabBarIcon:({color})=><MaterialIcons name="my-library-music" size={28} color={color} />}}/>
        </Tabs>
    )
}