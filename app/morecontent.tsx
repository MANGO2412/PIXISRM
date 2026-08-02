import {View,StyleSheet,ActivityIndicator,FlatList} from "react-native"
import {useLocalSearchParams,useRouter} from "expo-router"
import {useContext} from "react"
import {usePlayerContext} from "@/context/player/player-context"
import {GlobalContext} from "@/context/reduceContext"
import useMoreContent from "@/hooks/useMoreContent"
import type {Song} from "@/interface/song"
import type {PlayList} from "@/interface/playlist"
import FooterPlayer from "@/components/custome/FooterPlayer"
import {fetchStreamData,getSourceFromFormats} from '@/utils/fetchStramData'
import SongItem from "@/components/custome/SongItem"


export default function MoreContent(){
    const {browseId,params}=useLocalSearchParams<{browseId:string,params?:string}>()
    const {songs,loading}=useMoreContent({browseId:browseId as string,params:params})
    const {player,selectSongPlaying,setSelectSongPlaying}=usePlayerContext()
    const {dispatch}=useContext(GlobalContext)
    let navigation=useRouter()

    const reloadplaylist=async(item: Song)=>{
        const url=getSourceFromFormats((await fetchStreamData(item.videoId || ""))?.streamingData?.adaptiveFormats) || ""
        setSelectSongPlaying({
            ...item,
            playlistId: browseId || "",
            url
        })
        const CONCURRENT_LIMIT = 3
        let currentIndex = 0
        async function worker(){
            if(!songs?.length) return;

            while(currentIndex < songs?.length){
                const index = currentIndex++
                const elem = songs[index]
                if (!elem?.videoId) continue

                const responseUrl =await fetchStreamData(elem.videoId);
                dispatch({ type: "PUSH_PLAYLIST", payload: {
                     index,
                     song:{
                        ...elem,
                        playlistId: browseId || "",
                        url: getSourceFromFormats(responseUrl?.streamingData?.adaptiveFormats) || ""
                     },
                    params:"",
                    playlistId: "",
                } });
                
                
                
                // playlist[index] = {
                //     index,
                //     song: {
                //         ...elem,
                //         playlistId: browseId || "",
                //         url: getSourceFromFormats(responseUrl?.streamingData?.adaptiveFormats) || ""
                //     },
                //     params:"",
                //     playlistId: "",
                // }
            }
        }
        await Promise.all(
            Array.from({length:CONCURRENT_LIMIT},()=>worker())
        )
      
    }

    const playSong=async(item: Song)=>{
        player?.replace("");
        setSelectSongPlaying({...item,playlistId:browseId || ""});
        dispatch({ type: "SET_PLAYLIST", payload: [] });
        navigation.navigate("/playedsong");
        reloadplaylist(item)
    }

    if(loading){
        return(
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6A1A" />
            </View>
        )
    }

    const renderSongItem=({item,index}:{item:Song,index:number})=>{
        const isPlaying=selectSongPlaying?.videoId===item.videoId&&selectSongPlaying?.playlistId===browseId
        return(
          <SongItem  
           key={index} 
           customPlay={()=>playSong(item)} 
           style={[styles.songItem,isPlaying&&styles.songItemPlaying]}  {...item} 
           options 
           />
        )
    }

    return(
        <View style={styles.container}>
            <View style={styles.songsSection}>
                <FlatList
                    data={songs}
                    renderItem={renderSongItem}
                    keyExtractor={(item)=>item.videoId}
                    showsVerticalScrollIndicator={false}
                    extraData={selectSongPlaying?.videoId}
                />
            </View>
            <FooterPlayer/>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        height:"94%",
        paddingBottom:20,
    },
    loadingContainer:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#000",
    },
    songsSection:{
        flex:1,
        paddingHorizontal:16,
    },
    songItem:{
        flexDirection:"row",
        alignItems:"center",
        padding:18,
    },
    songItemPlaying:{
        backgroundColor:"rgba(255, 106, 26, 0.1)",
    },
    songIndex:{
        width:30,
        fontSize:14,
    },
    songInfo:{
        flex:1,
        marginLeft:8,
    },
    songTitle:{
        fontSize:16,
        color:"#fff",
        marginBottom:2,
    },
    songArtist:{
        fontSize:12,
        color:"#888",
    },
    songDuration:{
        fontSize:14,
        color:"#666",
    },
})