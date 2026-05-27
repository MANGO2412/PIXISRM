import {View,StyleSheet,Pressable} from "react-native"
import {useEffect, useState,useContext} from "react"
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import {Icon} from "@/components/ui/"
import {
  Play,
  Pause,
  X
} from "lucide-react-native"
import SongItem from "@/components/custome/SongItem"
import {usePlayerContext} from "@/context/player/player-context"
import {GlobalContext} from "@/context/reduceContext/"

const FooterPlayer=({notViewWithMenu}:{notViewWithMenu?:boolean})=>{
 const [updateLockScreen,setUpdateLockScreen]=useState<boolean>(false);
 const {player,selectSongPlaying,setSelectSongPlaying,status}=usePlayerContext()
 const {state}=useContext(GlobalContext)
 const [progress,setProgress]=useState(0)
  
    useEffect(() => {
     if (status?.isLoaded  && status.duration > 0) {
        const value = (status.currentTime / status.duration) * 100
        setProgress(value)
    } 
    
    return()=>{
        setProgress(0);
    }
   },[status?.currentTime, status?.duration, status?.isLoaded])


   useEffect(()=>{
       if (!status?.didJustFinish) return;
   
       console.log('Audio has finished playing! in footerplayer');
       nextPlaylist()
       
    },[status?.didJustFinish])

  

    useEffect(()=>{
        if (!player || !selectSongPlaying || player.isLoaded) return  
        console.log("url from  the footerplayer",selectSongPlaying.url)   
        player.replace(selectSongPlaying?.url || "")
        player.play();

        if(updateLockScreen){
            player.updateLockScreenMetadata({
               title: selectSongPlaying.title || "Unknown Title",
               artist:selectSongPlaying?.artist.name || "Unknown Artist",
               artworkUrl:
                selectSongPlaying.thumbnail?.replace("w60-h60", "w400-h400") || "https://via.placeholder.com/150",      
            });
            setUpdateLockScreen(false);
        }else{
          player.setActiveForLockScreen(true, {
           title: selectSongPlaying.title || "Unknown Title",
           artist:selectSongPlaying?.artist.name || "Unknown Artist",
           artworkUrl:
             selectSongPlaying.thumbnail?.replace("w60-h60", "w400-h400") ||
             "https://via.placeholder.com/150",
         })
        }
    },[selectSongPlaying])

    const nextPlaylist=()=>{
        console.log(state.playlist)
        if(state.playlist){
            console.log("snext is execute from footer in line 96")
            const currentSong=state.playlist?.find(item=>item.song.videoId==selectSongPlaying?.videoId)
            

            if((currentSong?.index|| 0)+1<state.playlist.length){
                const nextSong=state.playlist[(currentSong?.index|| 0)+1]
                player?.replace("")
                setUpdateLockScreen(true)
                setSelectSongPlaying({
                  url:nextSong.song.url,
                  thumbnail: nextSong.song.thumbnail,
                  videoId: nextSong.song.videoId,
                  artist: nextSong.song.artist,
                  title: nextSong.song.title,
                  album: nextSong.song.album,
                  isThisSongWithPlaylist:true,
                  index:nextSong.index
                })
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


   if(selectSongPlaying){
      return(
         <View style={[{ bottom:notViewWithMenu?50:0},style.container]}>
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
              <Progress value={progress} size="md" orientation="horizontal">
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
        flexDirection:"row"
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