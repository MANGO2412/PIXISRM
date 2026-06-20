import {View, Image, StyleSheet, Pressable, FlatList, ScrollView, Dimensions} from "react-native"
import {useContext} from "react"
import {
    useRouter,
} from "expo-router"

import FooterPlayer from "@/components/custome/FooterPlayer"
import {Text} from "@/components/ui"
import type {Artist} from "@/interface/artist"
import type {PlaylistArtist} from "@/interface/playlist"
import type {Album} from "@/interface/album"
import type {Song} from "@/interface/song"

import {GlobalContext} from "@/context/reduceContext";
import SongItem from "@/components/custome/SongItem"
import {WEB_REMIX} from "@/constant/clientYoutube"
import {URL_API_YOUTUBE} from "@/constant/initialValue"
import {NextResponse} from "@/interface/next"
import {getParams,getPlaylist} from "@/utils/playlistExtractor"
import {fetchStreamData,getSourceFromFormats} from '@/utils/fetchStramData'
import {usePlayerContext} from "@/context/player/player-context"
import type {PlayList} from "@/interface/playlist"
import Storage from 'expo-sqlite/kv-store';



interface ArtistModalProps {
    artist: Artist
}

const {width} = Dimensions.get("window")

export default function ArtistModal({artist}: ArtistModalProps) {
    let navigation=useRouter()
    const {dispatch}=useContext(GlobalContext)
    const {player,setSelectSongPlaying}=usePlayerContext()

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
   
    async function reloadPlaylist(videoId:string,playlistId?:string){
          const nextPageRaw=await fetchNex({videoId,playlistId})
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


        dispatch({ type: "SET_PLAYLIST", payload: playlist });
    }

    const playSong=async(item: Song)=>{
      player?.replace(""); 
      dispatch({ type: "SET_PLAYLIST", payload: [] });
      const url=getSourceFromFormats((await fetchStreamData(item.videoId || ""))?.streamingData?.adaptiveFormats) || "";
      
      setSelectSongPlaying({...item,url})
      navigation.navigate("/playedsong");
      reloadPlaylist(item.videoId, item.playlistId)
    }

    const renderSongItem = ({item, index}: {item: Song, index: number}) => (
        <SongItem  
         key={index} 
         customPlay={()=>playSong(item)} 
         style={styles.songItem}  {...item} 
         options />
    )
    
    const renderAlbumItem = ({item}: {item: Album}) => (
        <Pressable style={styles.albumItem} onPress={()=> navigation.navigate(`/albummodal?browseId=${item.browseId}&params=${item.params}`)}>
            <Image source={{uri: item.thumbnail}} style={styles.albumThumbnail}/>
            <Text size="md" className="color-white" numberOfLines={1}>{item.title.length>12?item.title.substring(0,12)+"...":item.title}</Text>
            <Text size="sm" className="color-gray-400">{item.year} </Text>
        </Pressable>
    )

    const renderSinglesAndEpsItem = ({item}: {item:PlaylistArtist}) => (
        <Pressable style={styles.albumItem} onPress={()=> navigation.navigate(`/albummodal?browseId=${item.browseId}`)}>
            <Image source={{uri: item.thumbnail}} style={styles.albumThumbnail} />
            <Text size="md" className="color-white" numberOfLines={1}>{item.title.length>19?item.title.substring(0,19)+"...":item.title}</Text>
            <Text size="sm" className="color-gray-400">{item.subtitle.length>19?item.subtitle.substring(0,19)+"...":item.subtitle}</Text>
        </Pressable>
    )

    const renderRelatedArtist = ({item}: {item: Artist}) => (
        <Pressable style={styles.relatedArtistItem} onPress={()=>navigation.replace(`/artistmodal?browseId=${item.browseId}`)}>
            <Image source={{uri: item.thumbnail}} style={styles.relatedThumbnail}/>
            <Text size="sm" className="color-white text-center mt-2" numberOfLines={1}>{item.name}</Text>
        </Pressable>
    )

    return (
        <View style={styles.container}>
            <View style={styles.modalContent}>
                <ScrollView 
                   style={styles.content}  
                   showsVerticalScrollIndicator={false}
                
                   >
                     <View style={styles.headerContainer}>
                         <Image source={{uri: artist.thumbnail}} style={styles.headerImage}/>
                         <View style={styles.gradient}/>
                         <View style={styles.headerInfo}>
                            <Text size="sm" className="color-white uppercase tracking-wider">Artista</Text>
                            <Text size="3xl" className="color-white font-bold">{artist.name}</Text>
                            {artist.subscribers && (
                                <Text size="sm" className="color-gray-300">{artist.subscribers} seguidores</Text>
                            )}
                        </View>
                  </View>
                    {artist.songs && artist.songs.length > 0 && (
                        <View style={styles.section}>
                          <Text size="lg" className="color-white font-bold mb-4">Canciones</Text>
                           <FlatList
                            data={artist.songs as Song[]}
                            renderItem={renderSongItem}
                            keyExtractor={(item) => item.videoId}
                            scrollEnabled={false}
                            />
                        </View>
                    )}

                    {artist.albums && artist.albums.length > 0 && (
                      <View style={styles.section}>
                          <Text size="lg" className="color-white font-bold mb-4">Álbumes</Text>
                          <FlatList
                            data={artist.albums}
                            renderItem={renderAlbumItem}
                            keyExtractor={(item) => item.browseId}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.relatedList}
                        />     
                        </View>
                    )}

                    { artist.singlesAndEps && artist.singlesAndEps.length > 0 && (
                        <View style={styles.section}>
                          <Text size="lg" className="color-white font-bold mb-4">Sencillos</Text>
                           <FlatList
                            data={artist.singlesAndEps}
                            renderItem={renderSinglesAndEpsItem}
                            keyExtractor={(item) => item.browseId}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.relatedList}
                           />   
                        </View>
                    )}

                    {artist.relatedArtists && artist.relatedArtists.length > 0 && (
                        <View style={styles.section}>
                            <Text size="lg" className="color-white font-bold mb-4">Artistas similares</Text>
                            <FlatList
                                data={artist.relatedArtists}
                                renderItem={renderRelatedArtist}
                                keyExtractor={(item) => item.browseId}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.relatedList}
                            />
                        </View>
                    )}

                    {artist.description && (
                        <View style={[styles.section,{paddingBottom:60}]}>
                            <Text size="lg" className="color-white font-bold mb-2">Acerca de</Text>
                            <Text size="sm" className="color-gray-300">{artist.description}</Text>
                        </View>
                    )}
                </ScrollView>
                <FooterPlayer/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: "#121212",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: "90%",
        paddingBottom: 20,
    },
    headerContainer: {
        position: "relative",
        height:280
    },
    headerImage: {
        width: "100%",
        height: "100%",
        position: "absolute",
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(18,18,18,0.3)",
    },
    headerInfo: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    songItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },
    songThumbnail: {
        width: 50,
        height: 50,
        borderRadius: 6,
        marginRight: 12,
    },
    songInfo: {
        flex: 1,
        marginRight: 10,
    },
    albumRow: {
        justifyContent: "space-between",
        marginBottom: 16,
    },
    albumItem: {
         marginRight: 12,
    },
    albumThumbnail: {
        width:  width * 0.4,
        aspectRatio: 1,
        borderRadius: 8,
        marginBottom: 8,
    },
    section: {
        marginTop: 24,
        marginBottom:30,
    },
    relatedList: {
        paddingRight: 16,
    },
    relatedArtistItem: {
        marginRight: 12,
        width: 100,
    },
    relatedThumbnail: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
})