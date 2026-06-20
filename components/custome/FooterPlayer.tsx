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
import {usePlayerContext,usePlayerStatus} from "@/context/player/player-context"
import {GlobalContext} from "@/context/reduceContext/"



const FooterPlayer=({notViewWithMenu}:{notViewWithMenu?:boolean})=>{
 const [updateLockScreen,setUpdateLockScreen]=useState<boolean>(false);
 const {player,selectSongPlaying,setSelectSongPlaying}=usePlayerContext()
 const {status}=usePlayerStatus()
 const {state}=useContext(GlobalContext)
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

        let subscription=player.addListener("playbackStatusUpdate",(status)=>{
            if(status.didJustFinish){
                console.log('Audio has finished playing! in footerplayer');
                nextPlaylist()
            }
        });
  
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
         })
        }

        return () => subscription?.remove();
    },[selectSongPlaying])

    const nextPlaylist=()=>{
        const playlist = playlistRef.current;
        console.log(playlist)
        if(playlist){
            console.log("snext is execute from footer in line 96")
            const currentSong=state.playlist?.find(item=>item.song.videoId==selectSongPlaying?.videoId)
            

            if((currentSong?.index|| 0)+1<playlist.length){
                const nextSong=playlist.sort((a, b) => a.index - b.index)[(currentSong?.index|| 0)+1]
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