import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable
} from "react-native"

import {
Host,
CircularProgressIndicator
} from "@expo/ui/jetpack-compose"


import {
Icon
} from "@/components/ui"

import {
Text
} from "@/components/ui"

import SongItem from "@/components/custome/SongItem"
import FooterPlayer from "@/components/custome/FooterPlayer"

import { 
  useLocalSearchParams 
} from "expo-router";

import { 
  Heart, 
  Music,
  Play,
  Download 
} from "lucide-react-native";

import {
 usePlaylistContent
} from "@/hooks/usePlaylistContent"

import {
  usePlayerContext
} from "@/context/player/player-context"

import type {
Song
} from "@/interface/song"
import {PlayList} from "@/interface/playlist"


import { Stack } from 'expo-router';
import {RightActionHeaderPlaylist} from '@/components/custome/LogoHeader'
import { 
  Gesture, 
  GestureDetector, 
} from 'react-native-gesture-handler';

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS
} from 'react-native-reanimated';
import {
    useRouter,
} from "expo-router"
import { memo, useContext, useState } from "react";
import {GlobalContext} from "@/context/reduceContext";
import {fetchStreamData,getSourceFromFormats} from '@/utils/fetchStramData'

const END_POSITION = -400;

const PlaylistContent = (): React.ReactElement => {
  const { playlist_id,nombre,download } = useLocalSearchParams<{ playlist_id: string;nombre:string;download:string}>();
  const [namePlaylist,setNamePlaylist]=useState<string>(nombre);
  const [isPressed, setIsPressed] = useState(false)
  const {content,loading,deleteSong}=usePlaylistContent({playlist_id})
  const {selectSongPlaying}=usePlayerContext()
  let navigation=useRouter()

  const onChangeValue=(newName:string)=>{
    setNamePlaylist(newName)
  }


  const ListItem = memo(({ item }: { item: Song }) => {
    const onRight= useSharedValue(true);
    const position = useSharedValue(0);
    const isPressed=useSharedValue(0);
    const {player,setSelectSongPlaying,selectSongPlaying}=usePlayerContext()
    const {dispatch}=useContext(GlobalContext)
    const isPlaying = selectSongPlaying?.videoId === item.videoId;

    const reloadplaylist=async(item: Song)=>{
       
        const url=getSourceFromFormats((await fetchStreamData(item.videoId || ""))?.streamingData?.adaptiveFormats) || ""
        setSelectSongPlaying({
            ...item,
            url
        })
    
        let playlist:PlayList[]=[]
         const CONCURRENT_LIMIT = 3
          let currentIndex = 0
    
    
         async function worker(){
                 if(!content.length) return
                
                  while(currentIndex < content.length ){
                      const index = currentIndex++
                      const elem = content[index]
                      console.log(elem.videoId)
                      if (!elem?.videoId) continue
                      const responseUrl =await fetchStreamData(
                            elem.videoId
                      )
                    playlist[index] = {
                      index,
                      song: {
                          ...elem,
                          url:
                              getSourceFromFormats(
                                  responseUrl?.streamingData?.adaptiveFormats
                              ) || ""
                      },
                     params:"",
                     playlistId:""
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

    const playSong=async()=>{
        player?.replace("");
        dispatch({ type: "SET_PLAYLIST", payload: [] }); 
        navigation.navigate("/playedsong");
        reloadplaylist(item)
    }

    const longPress=Gesture.LongPress()
        .onStart(()=>{
           isPressed.value=1
        })
        
  
    const panGesture = Gesture.Pan()
       .activateAfterLongPress(300)
       .activeOffsetX([-10,10])
       .failOffsetY([-10,10])
       .onStart(()=>{
        isPressed.value=1;
       })
       .onUpdate((e) => {
        if(isPressed.value >0){
           if (onRight.value) {
           position.value = e.translationX;
         } else {
           position.value = END_POSITION + e.translationX;
         }
        }       
       })
       .onEnd(async(e) => {
        console.log(position.value)
     
          if (position.value > END_POSITION / 2) {
              position.value = withTiming(0, { duration: 100 });
              onRight.value = true;
         } else {
           position.value = withTiming(END_POSITION, { duration: 100 });
           onRight.value = false;  
           runOnJS(deleteSong)(item.videoId,Number(playlist_id))
         }

        isPressed.value=0         
       });

    const composed=Gesture.Race(longPress,panGesture)

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX:   position.value }],
    }));

    return(
      <GestureDetector  gesture={composed}>
              <Animated.View style={[styles.songItem, isPlaying && styles.songItemPlaying, animatedStyle]} >
                  <SongItem    {...item}  customPlay={playSong}/>
              </Animated.View>
      </GestureDetector>
    )
  });

 const  renderSongItem= ({ item, index }: { item: Song; index: number }) => <ListItem key={index}  item={item} />;


  if(loading){
    return(
      <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6A1A" />
      </View>
    )

  }
 
  const isDefault = playlist_id === "1";

  return(
   <>
    <Stack.Screen
       options={{
          headerRight:props=><RightActionHeaderPlaylist 
                                     {...props}  
                                     playlist_id={playlist_id} 
                                     name={namePlaylist} 
                                     onChangeName={onChangeValue}
                                     download={download}       
                              />
       }} 
      />
      <View style={styles.container}>
       <View style={styles.songsSection}>
           <FlatList
              data={content}
              renderItem={renderSongItem}
              keyExtractor={(item: Song) => item.videoId}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
              <>
                <View style={styles.content}/>
                 <View style={styles.header}>
                    {isDefault?(
                     <View style={styles.defaultPlaylistCover}>
                        <Heart size={40} color="#fff" fill="#fff" />
                    </View>

                    ):(
                    <View style={styles.customPlaylistCover}>
                        <Music size={40} color="#666" />
                    </View>
                    )}
                    <View
                     style={{
                       position:"absolute",
                       display:"flex",
                       flexDirection:"row",
                       gap:5,
                       top:155,
                       right:90, 
                       zIndex: 9999,
                       elevation: 20 
                      }}
                    >
                      {/* Esta funcionalidad va esta disponiblle en la version 2.0.0 */}
                      {/* {download=="0" && (
                         <Pressable
                           style={{
                             height:40,
                             width:40,
                             padding:2,
                             borderRadius:30,
                             backgroundColor:isDefault ? "#282828" : "#FF6A1A",
                             justifyContent:"center",
                             alignItems:"center",
                             alignSelf:"center",
                           }}
                         >
                            <Host matchContents>
                              <CircularProgressIndicator progress={0.79}  color={"white"}/>
                            </Host>
                            <Icon as={Download}  size="md" className="absolute left-3 top-3 color-white"/>
                         </Pressable>
                      )} */}
                       <Pressable 
                            // onPress={()=>{playSong(albumContent.songs?.[0] as Song)}}  
                            onPressIn={() => setIsPressed(true)}
                            onPressOut={() => setIsPressed(false)} 
                            style={{
                              height:60,
                              width:60,
                              backgroundColor:isDefault ? "#282828" : isPressed ? "#cc5515" : "#FF6A1A",
                              padding:4,
                              borderRadius:30,
                              justifyContent:"center",
                              alignItems:"center",
                              opacity: isPressed ? 0.9 : 1
                            }}>
                             <Icon as={Play} size="lg" className="color-white"/>
                       </Pressable>
                    </View>
                    <Text style={styles.playlistName} numberOfLines={1}>
                       {namePlaylist}
                    </Text>
                </View>
              </>}
              extraData={selectSongPlaying?.videoId}
          />
       </View>
      <FooterPlayer/>
    </View>
   </>
  )
}

const styles=StyleSheet.create({
    container:{
      height: "94%",
      paddingBottom: 20,
    },
      box: {
    height: 120,
    width: 120,
    backgroundColor: '#b58df1',
    borderRadius: 20,
    marginBottom: 30,
  },
    customPlaylistCover: {
        width: 200,
        height: 200,
        borderRadius: 16,
        backgroundColor: "#282828",
        justifyContent: "center",
        alignItems: "center",
    },
    defaultPlaylistCover: {
      width: 200,
      height: 200,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FF6A1A",
    },
    songsSection: {
        flex: 1,
        paddingHorizontal: 16,
     
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    playlistName: {
       marginTop: 20,
       fontSize: 14,
       color: "#fff",
       textAlign: "center",
    },
    songItem: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#222",
       
    },
     content: {
        flex: 1,
        paddingTop: 50,
    },
    header: {
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 20,

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
})

export default PlaylistContent;

