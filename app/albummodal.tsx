import { useLocalSearchParams } from "expo-router";
import useAlbumPage from "@/hooks/useAlbumPage";
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  FlatList, 
  ActivityIndicator,
  Image,
  Pressable,
} from "react-native";

import {useContext,useState } from "react";
import type { Album } from "@/interface/album";
import type { Song } from "@/interface/song";
import {GlobalContext} from "@/context/reduceContext";
import {PlayList} from "@/interface/playlist"
import {
    useRouter,
} from "expo-router"
import FooterPlayer from "@/components/custome/FooterPlayer"
import {Play} from "lucide-react-native"
import {Icon} from "@/components/ui"
import {fetchStreamData,getSourceFromFormats} from '@/utils/fetchStramData'
import {usePlayerContext} from "@/context/player/player-context"


export default function AlbumModal() {
    const { browseId, params } = useLocalSearchParams<{ browseId: string; params?: string }>();
    const { albumContent, releaseAlbum } = useAlbumPage({ browseId: browseId, params:params });
    const {dispatch}=useContext(GlobalContext)
    let navigation=useRouter()
    const [isPressed, setIsPressed] = useState(false)
    const {player,selectSongPlaying,setSelectSongPlaying}=usePlayerContext()
    
    const reloadplaylist=async(item: Song)=>{
     const url=getSourceFromFormats((await fetchStreamData(item.videoId || ""))?.streamingData?.adaptiveFormats) || ""
     setSelectSongPlaying({
         ...item,
         playlistId: browseId || "",
         url
     })
     let playlist:PlayList[]=[]
      const CONCURRENT_LIMIT = 3
       let currentIndex = 0
       async function worker(){
               if(!albumContent?.songs?.length) return      
                while(currentIndex < albumContent?.songs?.length ){
                    const index = currentIndex++
                    const elem = albumContent.songs[index]
                    if (!elem?.videoId) continue
                    const responseUrl =await fetchStreamData(
                          elem.videoId
                    )
                  playlist[index] = {
                    index,
                    song: {
                        ...elem,
                        playlistId: browseId || "",
                        url:
                            getSourceFromFormats(
                                responseUrl?.streamingData?.adaptiveFormats
                            ) || ""
                    },
                   params:"",
                   playlistId: "",
                  }
                }
        }
       await Promise.all(
             Array.from(
               {length:CONCURRENT_LIMIT},
               ()=>worker()
             )
       )
       dispatch({ type: "SET_PLAYLIST", payload: playlist });
    }

    const playSong=(item: Song)=>{
        player?.replace("");
        setSelectSongPlaying({...item,playlistId:browseId || ""});
        dispatch({ type: "SET_PLAYLIST", payload: [] }); 
        navigation.navigate("/playedsong");
        reloadplaylist(item)
    }
  
    if (!albumContent) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6A1A" />
            </View>
        );
    }

    const renderSongItem = ({ item, index }: { item: Song; index: number }) => {
        const isPlaying = selectSongPlaying?.videoId === item.videoId && selectSongPlaying?.playlistId === browseId;
        return(
        <Pressable 
            style={[styles.songItem, isPlaying && styles.songItemPlaying]}
            onPress={() =>{playSong(item)}}
            
        >
            <>
             {isPlaying && <Image style={{position:"absolute",left:5,width: 30, height: 30}} source={require("@/assets/playingsong.gif")}/>}
              <Text style={[styles.songIndex,{color:isPlaying ? "#FF6A1A" : "#666",}]}>{index + 1}</Text>
            </>
            <View style={styles.songInfo}>
                <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
            </View>
            <Text style={styles.songDuration}>{item.duration || "0:00"}</Text>
        </Pressable>
        )
    };

    const renderReleaseAlbumItem = ({ item }: { item: Album }) => (
        <Pressable style={styles.releaseAlbumItem} onPress={()=> navigation.push(`/albummodal?browseId=${item.browseId}`)}>
            <Image
              source={{uri:item.thumbnail.replace("w60-h60", "w300-h300")}}
              style={styles.releaseAlbumThumbnail}
            />
            <Text style={styles.releaseAlbumTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.releaseAlbumSubtitle} numberOfLines={1}>{item.subtitle}</Text>
        </Pressable>
    );

    return (
        <View style={styles.Container}>
           <View style={styles.songsSection}>
             <FlatList
                        data={albumContent.songs}
                        renderItem={renderSongItem}
                        keyExtractor={(item) => item.videoId}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={
                        <>
                          <ImageBackground
                             source={{ uri: albumContent.thumbnail.replace("w60-h60", "w200-h200") }}
                             style={styles.backgroundImage}
                             blurRadius={50}
                          >
                          </ImageBackground>
                          <View style={styles.content}/>
                           <View style={styles.header}>
                              <Image
                                source={{uri:albumContent.thumbnail.replace("w60-h60", "w300-h300")}}
                                style={styles.albumThumbnailContainer}
                              />
                              
                           <View style={{position:"absolute",top:-55,right:90, zIndex: 9999,elevation: 20 }}>
                                 <Pressable 
                                     onPress={()=>{playSong(albumContent.songs?.[0] as Song)}}  
                                     onPressIn={() => setIsPressed(true)}
                                     onPressOut={() => setIsPressed(false)} 
                                     style={{height:60,width:60,backgroundColor: isPressed ? "#cc5515" : "#FF6A1A",padding:4,borderRadius:30,justifyContent:"center",alignItems:"center",   opacity: isPressed ? 0.7 : 1}}>
                                      <Icon as={Play} size="lg" className="color-white"/>
                                 </Pressable>
                              </View>
                              <Text style={styles.albumTitle}>{albumContent.title.length>27?albumContent.title.substring(0,27)+"...":albumContent.title}</Text>
                              <Text style={styles.albumArtist}>{albumContent.artist?.name}</Text>
                              <Text style={styles.albumDuration}>{albumContent.duration}</Text> 
                              {albumContent.description ? (
                                  <Text style={styles.albumDescription} numberOfLines={3}>
                                      {albumContent.description}
                                  </Text>
                              ):<View style={{marginBottom:70}}/>}
                          </View>
                        </>}
                        ListFooterComponent={
                          <>
                            {releaseAlbum && releaseAlbum.length > 0 && (
                               <View style={styles.releasesSection}>
                                  <Text style={styles.sectionTitle}>More Releases</Text>
                                  <FlatList
                                      data={releaseAlbum}
                                      renderItem={renderReleaseAlbumItem}
                                      keyExtractor={(item, index) => `release-${item.browseId}-${index}`}
                                      horizontal
                                      showsHorizontalScrollIndicator={false}
                                      contentContainerStyle={styles.releasesList}
                                  />
                               </View>
                            )}  
                          </>
                        }
                        extraData={selectSongPlaying?.videoId}
                    />
           </View>
          <FooterPlayer/>
        </View>
    );
}

const styles = StyleSheet.create({
    Container:{
        height: "94%",
        paddingBottom: 20,
    
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    backgroundImage: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height:400,
        resizeMode: "cover",
        opacity:0.5
    },
    content: {
        flex: 1,
        paddingTop: 230,
    },
    header: {
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 20,

    },
    albumThumbnailContainer: {
        width: 180,
        height: 180,
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 16,
        position: "absolute",
        top: -180,
        backgroundColor: "#282828",
    },
    albumThumbnailPlaceholder: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    albumTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginBottom: 1,
    },
    albumArtist: {
        fontSize: 16,
        color: "white",
        marginBottom: 4,
    },
    albumDuration: {
        fontSize: 14,
        color: "white",
        marginBottom: 12,
    },
    albumDescription: {
        fontSize: 13,
        marginTop:13,
        color: "white",
        textAlign: "center",
        lineHeight: 18,
    },
    songsSection: {
        flex: 1,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 16,
    },
    songItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#222",
       
    },
    songItemPlaying: {
        backgroundColor: "rgba(255, 106, 26, 0.1)",
    
    },
    songIndex: {
        width: 30,
        fontSize: 14,
    },
    songInfo: {
        flex: 1,
        marginLeft: 8,
    },
    songTitle: {
        fontSize: 16,
        color: "#fff",
        marginBottom: 2,
    },
    songPlays: {
        fontSize: 12,
        color: "#666",
    },
    songDuration: {
        fontSize: 14,
        color: "#666",
    },
    releasesSection: {
        paddingVertical: 20,
        paddingBottom:100,
    },
    releasesList: {
        paddingHorizontal: 16,
    },
    releaseAlbumItem: {
        width: 140,
        marginRight: 12,
    },
    releaseAlbumThumbnail: {
        width: 140,
        height: 140,
        borderRadius: 8,
        backgroundColor: "#282828",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    releaseAlbumTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 2,
    },
    releaseAlbumSubtitle: {
        fontSize: 12,
        color: "#666",
    },
});
