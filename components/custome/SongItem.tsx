import {
  View,
  Image,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable
} from "react-native"
import {FC,useContext} from "react"
import {Text,Button,ButtonIcon} from "@/components/ui"
import {EllipsisVertical} from "lucide-react-native"
import { useRouter } from 'expo-router';
import {SongContext} from "@/context/song/song-context"
import {type Song} from "@/interface/song"

import {WEB_REMIX} from "@/constant/clientYoutube"
import {URL_API_YOUTUBE} from "@/constant/initialValue"
import {NextResponse} from "@/interface/next"
import Storage from 'expo-sqlite/kv-store';

import {GlobalContext} from "@/context/reduceContext";
import {getParams,getPlaylist} from "@/utils/playlistExtractor"
import type {PlayList} from "@/interface/playlist"

import {fetchStreamData,getSourceFromFormats} from '@/utils/fetchStramData'
import {usePlayerContext} from "@/context/player/player-context"




const  SongItem:FC<Song & {style?:StyleProp<ViewStyle>,options?:boolean,showDetail?:boolean,customPlay?:() => Promise<void>}>=({thumbnail,videoId,artist,album,title,style,options,showDetail,customPlay})=>{
    let navigation=useRouter()
    const {updateSong}=useContext(SongContext)
    const {dispatch,state}=useContext(GlobalContext)
    const {setSelectSongPlaying,player}=usePlayerContext()

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

    async function reloadPlaylist(){
          const nextPageData =await fetchNex({videoId})
          const {playlistId,params}=getParams({nextResponse:nextPageData})
          const nextPageRaw=await fetchNex({videoId,playlistId,params})
          const playlistData=getPlaylist({nextResponse:nextPageRaw}) 
     
          
          const CONCURRENT_LIMIT = 3
          let currentIndex = 0


          async function worker(){
              if(!playlistData) return;

              while(currentIndex < playlistData?.length ){
                  let playlist:PlayList[]=state.playlist || []

                  const index = currentIndex++
                  const elem = playlistData[index]
                  if (!elem?.song?.videoId) continue  
                  const responseUrl =await fetchStreamData(
                          elem.song.videoId
                  )
                  const url = getSourceFromFormats(responseUrl?.streamingData?.adaptiveFormats) || "";
                  dispatch({ type: "PUSH_PLAYLIST", payload: {
                    ...elem,
                    song: {
                        ...elem.song,
                        url:url
                          
                    }
                  }});

              }
          }
          
        await Promise.all(
            Array.from(
              {length:CONCURRENT_LIMIT},
              ()=>worker()
            )
        )

      
       
    }

    const playSong=async()=>{
        navigation.navigate("/playedsong");
        if(!showDetail){
          player?.replace(""); 
          dispatch({ type: "SET_PLAYLIST", payload: [] });

          const url=getSourceFromFormats((await fetchStreamData(videoId || ""))?.streamingData?.adaptiveFormats) || ""
          console.log("url from songitem",url)
          setSelectSongPlaying({thumbnail,videoId,artist,album,title,url,index:0})  
          reloadPlaylist()
        }           
    }


    return(
      <View style={[styles.container,style]}>
        <Pressable style={styles.container} onPress={customPlay?customPlay:playSong}>
          <Image style={styles.image}  source={{uri:thumbnail}}/>
          <View style={styles.info} >
              <Text   size="lg" className="color-typography-950" > {title.length>20?title.substring(0,20)+"...":title}</Text>
              <Text size="sm">{artist.length>0?artist.map(elem=>elem.name).join(" & "):"Artista desconocido"}</Text>
          </View>
        </Pressable>
        {options && (
          <Button variant="link"  className="rounded-full p-3.5 " size="lg" onPress={()=>{navigation.navigate("/songoptions"); updateSong({thumbnail,videoId,artist,title,album})}} >
            <ButtonIcon size="lg"   as={EllipsisVertical} className="color-typography-800 "     />
          </Button>
        )}
      </View>
    )
}


export default SongItem;
const styles=StyleSheet.create({
    container:{
      display:"flex",
      flexDirection:"row",
      justifyContent:"space-between",
    },
    image:{
        borderRadius:9,
        width:60,
        height:60
    },
    info:{
        width:260,
        padding:10
    }
})


