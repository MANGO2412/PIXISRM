import {
  View,
  StyleSheet,
  Alert,
  Pressable
} from "react-native"
import {Text} from "@/components/ui"
import ModalPlaylist from "@/components/custome/ModalPlaylist"

import SongItem from "@/components/custome/SongItem"
import {
  FC, 
  ReactElement,
  useContext,
  useState
} from "react"

import {SongContext} from "@/context/song/song-context"
import {useRouter} from "expo-router"

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons'

import {WEB_REMIX} from "@/constant/clientYoutube"
import {URL_API_YOUTUBE} from "@/constant/initialValue"
import {NextResponse} from "@/interface/next"
import Storage from 'expo-sqlite/kv-store';



import {GlobalContext} from "@/context/reduceContext";
import {getParams,getPlaylist} from "@/utils/playlistExtractor"
import type {PlayList} from "@/interface/playlist"
import type { Song } from "@/interface/song";
import {fetchStreamData,getSourceFromFormats} from '@/utils/fetchStramData'
import {usePlayerContext} from "@/context/player/player-context"

import { usePlaylists } from "@/hooks/usePlaylists"
import {usePlaylistContent} from "@/hooks/usePlaylistContent"


const OptionEleement:FC<{icon:ReactElement,label:string,onclick?:()=>void}>=({icon,label,onclick})=>{
   return(
    <Pressable style={{display:"flex",flexDirection:"row",padding:10}} onPress={onclick}>
       {icon}
       <Text size="xl" className='ml-4 inline-block align-bottom tracking-wide'>{label}</Text>
     </Pressable>
   )
}


export default function songoptions(){
  let navigation=useRouter();
  const [modalVisible,setModalVisible]=useState<boolean>(false)
  const {selectSong}=useContext(SongContext)
  const {dispatch}=useContext(GlobalContext)
  const {player,setSelectSongPlaying}=usePlayerContext()
  const {addSongtoPlaylist}=usePlaylists()
  const {content}=usePlaylistContent({videoid:selectSong?.videoId})
  const [values, setValues] = useState<string[]>([]);

   async function fetchNex({playlistId,params,videoId}:{playlistId?:string,params?:string,videoId?:string}) {
        try {
            const visitorData = await Storage.getItem('visitorData');
            WEB_REMIX.visitorData = visitorData || "";
            const response=await fetch(`${URL_API_YOUTUBE}next`,{
                    method:"POST",
                    headers:{
                      "Content-Type":"application/json",
                      "X-Goog-FieldMask":"contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer.watchNextTabbedResultsRenderer.tabs.tabRenderer.content.musicQueueRenderer.content.playlistPanelRenderer(continuations,contents(automixPreviewVideoRenderer,playlistPanelVideoRenderer(title,navigationEndpoint,longBylineText,shortBylineText,thumbnail,lengthText)))",
                      "X-Goog-Api-Key":"AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
                    },
                    body:JSON.stringify({
                        context:{
                            client:WEB_REMIX
                        },
                       "isAudioOnly": true,
                       "playlistId":playlistId,
                       "tunerSettingValue":"AUTOMIX_SETTING_NORMAL",
                       "index": null,
                       "params":  params,
                       "playlistSetVideoId": null,
                      "watchEndpointMusicSupportedConfigs":{
                         "musicVideoType":"MUSIC_VIDEO_TYPE_ATV"
                      },
                      "videoId":videoId
                    })
            })
           const data:NextResponse=await response.json()
           return data;
       } catch (error) {
           console.error("fatch error response",error)
       }
   }
  
   async function reloadPlaylist(videoId:string){
         const nextPageData =await fetchNex({videoId})
         const {playlistId,params}=getParams({nextResponse:nextPageData})
         const nextPageRaw=await fetchNex({videoId,playlistId,params})
         const playlistData=getPlaylist({nextResponse:nextPageRaw}) 
         let playlist:PlayList[]=[]
         const CONCURRENT_LIMIT = 3
         let currentIndex = 0
         async function worker(){
             if(!playlistData) return;
             while(currentIndex < playlistData?.length ){
                   const index = currentIndex++
                   const elem = playlistData[index]
                   if (!elem?.song?.videoId) continue
                   const responseUrl =await fetchStreamData(
                         elem.song.videoId
                   )
                 playlist[index] = {
                   ...elem,
                   song: {
                       ...elem.song,
                       url:
                           getSourceFromFormats(
                               responseUrl?.streamingData?.adaptiveFormats
                           ) || ""
                   }
                 }
             }
         }
         await Promise.all(
           Array.from(
             {length:CONCURRENT_LIMIT},
             ()=>worker()
           )
         )
         dispatch({ type: "SET_PLAYLIST", payload: playlist.filter(Boolean) });
   }
  
   const playSong=async()=>{ 
       if(selectSong){
           player?.replace(""); 
           dispatch({ type: "SET_PLAYLIST", payload: [] });
           const url=getSourceFromFormats((await fetchStreamData(selectSong.videoId))?.streamingData?.adaptiveFormats) || ""
           console.log("select url",url)
           setSelectSongPlaying({...selectSong,url})  
           navigation.replace("/playedsong");
           reloadPlaylist(selectSong.videoId)  
       }    
   }

   const handleSavePlaylist=async ()=>{
     if(values.length <= 0){
      Alert.alert("Selecciona al menos una lista de reproduccion")
      return;
     }

     const success=await addSongtoPlaylist(selectSong as Song,values)
     setModalVisible(false);
     navigation.back()

     if(success){
       Alert.alert("La cancion se agrego exitosamente a la listas de reproducciones")
     }else{
       Alert.alert("Ocurrio un error al agregar cancion a lista de reproducciones")
     }

   }
  
   return(
    <View style={styles.container}>
      <View style={styles.boxView}></View>
      <View style={styles.thumbnail}>
        {selectSong && <SongItem {...selectSong} />}
      </View>
      <View style={{width:400}}>
          <OptionEleement onclick={playSong} icon={<Ionicons size={30} name="radio" color="white"/>} label="Iniciar radio"/>
          <OptionEleement icon={<MaterialIcons size={30} name="playlist-play" color="white"/>} label="Reproducir a continuacion"/>
          <OptionEleement icon={<MaterialCommunityIcons name="playlist-music" size={30} color="white" />} label="Añadir a la cola"/>
          <OptionEleement onclick={()=>setModalVisible(true)} icon={<MaterialIcons size={30} name="playlist-add" color="white"/>} label="Añadir a una lista"/>
          <OptionEleement onclick={()=>navigation.replace(`/albummodal?browseId=${selectSong?.album?.browseId}`)} icon={<MaterialIcons size={30} name="album" color="white"/>} label="Ver album"/>
          <OptionEleement onclick={()=>navigation.replace(`/artistmodal?browseId=${selectSong?.artist.browseId}`)}  icon={<FontAwesome name="user" size={30} color="white" />} label={`Mas de ${selectSong?.artist.name}`} />
      </View>
      <ModalPlaylist
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        values={values}
        setValues={setValues}
        content={content}
        handleSavePlaylist={handleSavePlaylist}
      />
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