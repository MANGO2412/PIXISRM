import {View,StyleSheet,Pressable} from "react-native"
import {useEffect, useState,useContext,useRef} from "react"
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import {Icon} from "@/components/ui/"
import {
  Play,
  Pause,
  X
} from "lucide-react-native"

import SongItem from "@/components/custome/SongItem"
import RadioItem from "@/components/custome/RadioItem"
import {usePlayerContext,usePlayerStatus} from "@/context/player/player-context"
import {GlobalContext} from "@/context/reduceContext/"

import {fetchStreamData,getSourceFromFormats} from "@/utils/fetchStramData";



const FooterPlayer=({notViewWithMenu}:{notViewWithMenu?:boolean})=>{
 const [updateLockScreen,setUpdateLockScreen]=useState<boolean>(false);
 const {player,selectSongPlaying,setSelectSongPlaying,selectRadioStation,setSelectRadioStation}=usePlayerContext()
 const {status}=usePlayerStatus()
 const {state,dispatch}=useContext(GlobalContext)
 
 const playlistRef = useRef(state.playlist);
 const progressRef = useRef(0);

  
  useEffect(() => {
     if (status?.isLoaded  && status.duration > 0) {
        const value = (status.currentTime / status.duration) * 100
        progressRef.current=value
    }
    
     return () => {
            progressRef.current=0;
     };
   },[status?.currentTime, status?.duration, status?.isLoaded])

   useEffect(()=>{
    playlistRef.current = state.playlist;
   },[state.playlist]);

    useEffect(()=>{
        if (!player || !selectSongPlaying || player.isLoaded) return  
    
        console.log("url from  the footerplayer",selectSongPlaying.url)   
      
        player.replace(selectSongPlaying?.url || "")
        player.play();
        

        let subscription=player.addListener("playbackStatusUpdate",async(status)=>{
            if(status.didJustFinish){
                console.log('Audio has finished playing! in footerplayer');
                await nextPlaylist()
            }
        });


        let subciption2=player.addListener("trackManager",async (status)=>{
            console.log("se esta ejecuntando")
            if(status.isPressedNext){
                console.log("Avanza al siguiente elemento de la lista")
                 await nextPlaylist();
            }

            if(status.isPressedPrevious){
                console.log("regresa al siguiente elemento")
                await backPlaylist();
            }
        })


  
        if(updateLockScreen){
            player.updateLockScreenMetadata({
               title: selectSongPlaying.title || "Unknown Title",
               artist:selectSongPlaying?.artist.map(elem=>elem.name).join(" & ") || "Unknown Artist",
               artworkUrl:
                selectSongPlaying.thumbnail?.replace("w60-h60", "w400-h400") || "https://via.placeholder.com/150",      
            });
            setUpdateLockScreen(false);
        }else{
          player.setActiveForLockScreen(true, {
           title: selectSongPlaying.title || "Unknown Title",
           artist:selectSongPlaying?.artist.map(elem=>elem.name).join(" & "),
           artworkUrl:
             selectSongPlaying.thumbnail?.replace("w60-h60", "w400-h400") ||
             "https://via.placeholder.com/150",
           
         },{
            showSeekBackward:true,
            showSeekForward:true
         })
        }

        return () => {
            subscription?.remove()
            subciption2?.remove()
        };
    },[selectSongPlaying])

    useEffect(()=>{
        if (!player || !selectRadioStation || player.isLoaded) return

        player.replace(selectRadioStation?.url || "")
        player.play();
        player.setActiveForLockScreen(true, {
           title: selectRadioStation.name || "Unknown Name radio",
           artist: selectRadioStation?.country || "Unknown Country radio",
           artworkUrl:selectRadioStation?.favicon?selectRadioStation?.favicon != "" ? selectRadioStation.favicon: undefined:undefined
         })
    },[selectRadioStation])

    const nextPlaylist=async ()=>{
        const playlist = playlistRef.current;
        if(playlist){
            const currentSong=playlistRef.current?.find(item=>item.song.videoId==selectSongPlaying?.videoId)
            

            if((currentSong?.index|| 0)+1<playlist.length){
                const nextSong=playlist.sort((a, b) => a.index - b.index)[(currentSong?.index|| 0)+1]
               
                setUpdateLockScreen(true);
                console.log(nextSong)
                player?.replace("");

                if(!nextSong.song.url){
                    const responseUrl= await fetchStreamData(nextSong.song.videoId);
                    const url = getSourceFromFormats(responseUrl?.streamingData?.adaptiveFormats) || "";
                    dispatch({
                      type: "UPDATE_PLAYLIST",
                      payload: {
                        videoId: nextSong.song.videoId,
                        song: { url: url }
                      }
                    });
                    setSelectSongPlaying({ ...nextSong.song, url:url  })
                }else{
                    setSelectSongPlaying(nextSong.song)
                }       
            }
        }
    }

   const backPlaylist=async()=>{
        const playlist = playlistRef.current;
         if(playlist){
            const currentSong=state.playlist?.find(item=>item.song.videoId==selectSongPlaying?.videoId)
            if((currentSong?.index|| 0)-1>=0){
                const backSong=playlist.sort((a, b) => a.index - b.index)[(currentSong?.index|| 0)-1]
                player?.replace("")
                setUpdateLockScreen(true)
                if(!backSong.song.url){
                    const responseUrl= await fetchStreamData(backSong.song.videoId);
                    const url = getSourceFromFormats(responseUrl?.streamingData?.adaptiveFormats) || "";
                    dispatch({
                      type: "UPDATE_PLAYLIST",
                      payload: {
                        videoId: backSong.song.videoId,
                        song: { url: url }
                      }
                    });
                    setSelectSongPlaying({ ...backSong.song, url:url  })

                }else{
                  setSelectSongPlaying(backSong?.song)
                }
            }
        }
    }

    const playAudio =  () => {
        if (status?.playing) {
            player?.pause()
        } else {
            player?.play()
        }  
    }


  if(selectRadioStation){
    return(
         <View style={[{ bottom:notViewWithMenu?50:0},style.container ]}>
             <View style={[style.subContainer,{ justifyContent:"space-between",padding:5}]}>
                <RadioItem style={style.songItem} radio={selectRadioStation}  typeView="footer" />
               <View style={style.containerControles}>
                  <Pressable style={style.playBtn} onPress={() => {playAudio()}}>
                     <Icon as={status?.playing ? Pause : Play} className="color-white" size="xl" />
                  </Pressable>
                  <Pressable onPress={() => {player?.replace(""); setSelectRadioStation(undefined)}}>
                      <Icon as={X} className="color-white" size="xl" />
                  </Pressable>
               </View>
             </View>
            <Progress value={100} size="md" orientation="horizontal">
                <ProgressFilledTrack />
             </Progress>
        </View>
    )
  }


   if(selectSongPlaying){
      return(
         <View style={[{ bottom:notViewWithMenu?50:0},style.container ]}>
             <View style={style.subContainer}>
               <SongItem style={style.songItem} videoId={selectSongPlaying?.videoId||""} artist={selectSongPlaying?.artist || {browseId:"",name:""}} title={selectSongPlaying?.title || ""} thumbnail={selectSongPlaying?.thumbnail || ""}  showDetail/>
               <View style={style.containerControles}>
                  <Pressable style={style.playBtn} onPress={() => {playAudio()}}>
                     <Icon as={status?.playing ? Pause : Play} className="color-white" size="xl" />
                  </Pressable>
                  <Pressable onPress={() => {player?.replace(""); setSelectSongPlaying(undefined)}}>
                      <Icon as={X} className="color-white" size="xl" />
                  </Pressable>
               </View>
             </View>
              <Progress value={progressRef.current} size="md" orientation="horizontal">
                <ProgressFilledTrack />
             </Progress>
        </View>
       )
   }

   return null;

  
}


const style=StyleSheet.create({
    container:{
        borderTopStartRadius:30,
        borderTopEndRadius:30,
        position:"absolute",
        paddingTop:9,
        left:0,
        right:0,
        height:90,
        zIndex:100,
        backgroundColor:"#343738"
    },
    subContainer:{
        display:"flex",
        flexDirection:"row",
    },
    songItem:{
        marginStart:20,
        marginBottom:10,
    },
    containerControles:{
        display:"flex", 
        flexDirection:"row",
        width:80,
        alignItems:'center',
        gap:6
    },
    playBtn: {
        width: 50,
        height: 50,
        borderRadius: 32,
        backgroundColor: "#FF6A1A",
        alignItems: "center",
        justifyContent: "center",
    },

})

export default FooterPlayer;