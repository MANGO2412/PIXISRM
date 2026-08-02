import {View, Image, StyleSheet, Pressable,ImageBackground,Alert} from "react-native"
import { useContext, useEffect, useState} from "react"
import {Text, Icon} from "@/components/ui"

import {
  Host,
  DropdownMenu,
  DropdownMenuItem,
  Text as ComposeText,
  RNHostView,
} from '@expo/ui/jetpack-compose';

import {
    useRouter,
} from "expo-router"

import {
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Heart,
    Repeat,
    MoreHorizontal,
    ListMusic,
    Mic2
} from "lucide-react-native"

import {GlobalContext} from "@/context/reduceContext";
import {usePlayerContext,usePlayerStatus} from "@/context/player/player-context"
import SongProgressBar from "@/components/custome/SongProgrssBar"

import {usePlaylists} from "@/hooks/usePlaylists"
import {usePlaylistContent} from "@/hooks/usePlaylistContent"



import SlidedText from "@/components/custome/SlideText";
import ModalPlaylist from "@/components/custome/ModalPlaylist"

import  type {Song} from "@/interface/song"


function PopoverOptions({song}: {song: Song}) {
  let navigation=useRouter()
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalVisible,setModalVisible]=useState<boolean>(false)
  const {addSongtoPlaylist}=usePlaylists()
  const [values, setValues] = useState<string[]>([]);
  const {content}=usePlaylistContent({videoid:song?.videoId})


  const handleSavePlaylist=async ()=>{
    if(values.length <= 0){
      Alert.alert("Selecciona al menos una lista de reproduccion")
      return;
    }
  
    const success=await addSongtoPlaylist(song,values)
    setModalVisible(false);

    if(success){
      Alert.alert("La cancion se agrego exitosamente a la listas de reproducciones")
    }else{
      Alert.alert("Ocurrio un error al agregar cancion a lista de reproducciones")
    }
  }

  const handleOpenModal=()=>{
    setIsExpanded(false)
    setModalVisible(true)
  }

  return (
    <>
      <Host matchContents>
      <DropdownMenu expanded={isExpanded} onDismissRequest={() => setIsExpanded(false)}>
        <DropdownMenu.Trigger>
          <RNHostView matchContents>
            <Pressable
              onPress={() => setIsExpanded(true)}
              style={{paddingVertical: 5, zIndex:10}}
              >
                 <Icon as={MoreHorizontal} className="color-white" size="xl" />
            </Pressable>
          </RNHostView>
        </DropdownMenu.Trigger>
        <DropdownMenu.Items>
          <DropdownMenuItem onClick={handleOpenModal}>
            <DropdownMenuItem.Text>
              <ComposeText>Agregar a lista de reproducción</ComposeText>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={()=>navigation.replace(`/albummodal?browseId=${song?.album?.browseId}`)}>
            <DropdownMenuItem.Text>
              <ComposeText>Ver Álbum</ComposeText>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
          {(song?.artist?.length ?? 0) >0 && (
            <DropdownMenuItem onClick={()=>navigation.replace(`/artistmodal?browseId=${song?.artist[0]?.browseId}`)}>
            <DropdownMenuItem.Text>
              <ComposeText>Ver Artista</ComposeText>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
          )}
        </DropdownMenu.Items>
      </DropdownMenu>
    </Host>
    <ModalPlaylist
     modalVisible={modalVisible}
     setModalVisible={setModalVisible}
     values={values}
     setValues={setValues}
     content={content}
     handleSavePlaylist={handleSavePlaylist}
    />

    </>
  );  
}

export default function PlayedSong() {
    let navigation=useRouter()
    const {state}=useContext(GlobalContext)
    const {addSongtoPlaylist}=usePlaylists()
    const {content,deleteSong}=usePlaylistContent({playlist_id:"1"})
    const {player,setSelectSongPlaying,selectSongPlaying}=usePlayerContext()
    const {status}=usePlayerStatus()
    const [isLiked, setIsLiked] = useState(false)
    const [repeat, setRepeat] = useState(player?.loop || false)

    useEffect(()=>{
       setIsLiked(content.find(item=>item.videoId==selectSongPlaying?.videoId) != undefined)
    },[content,selectSongPlaying])
       
    const playAudio =  () => {
        if (status?.playing) {
            player?.pause()
        } else {
            player?.play()
        }  
    }

    const nextPlaylist=()=>{
        if(state.playlist){
            const currentSong=state.playlist?.find(item=>item.song.videoId==selectSongPlaying?.videoId)
            if((currentSong?.index|| 0)+1<=state.playlist.length){
                player?.replace("")
                const nextSong=state.playlist.sort((a, b) => a.index - b.index)[(currentSong?.index|| 0)+1]
                setSelectSongPlaying(nextSong?.song)
            }
        }
    }
    
    const backPlaylist=()=>{
         if(state.playlist){
            const currentSong=state.playlist?.find(item=>item.song.videoId==selectSongPlaying?.videoId)
            if((currentSong?.index|| 0)-1>=0){
                 player?.replace("")
                const nextSong=state.playlist.sort((a, b) => a.index - b.index)[(currentSong?.index|| 0)-1]
                setSelectSongPlaying(nextSong?.song)
            }
        }
    }

    const onLiked=()=>{
      if(isLiked){
         deleteSong(selectSongPlaying?.videoId || "",1)
         setIsLiked(false)
      }else{
        if(!selectSongPlaying) return;

        addSongtoPlaylist(selectSongPlaying,["1"]);
        setIsLiked(true);
      }
    }

    const onRepeat=()=>{
        if(player){
            player.loop = !repeat
        }
        setRepeat(!repeat)
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <PopoverOptions song={selectSongPlaying as Song}/>
            </View>
            <ImageBackground
                source={{uri: selectSongPlaying?.thumbnail.replace("w60-h60", "w300-h300") || "https://via.placeholder.com/300"}}
                style={{width: 500, height: 900, position: "absolute", top: 0, left: 0,opacity:0.3,}}
                blurRadius={50}
            />

            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.albumArt}
                        source={{uri: selectSongPlaying?.thumbnail.replace("w60-h60", "w300-h300") || "https://via.placeholder.com/300"}}
                    />
                </View>
                <View style={styles.songInfo}>
                    {(selectSongPlaying?.title || "Song Unknown").trim().length>=35?(
                      <SlidedText value={selectSongPlaying?.title || "Song Unknown"} />
                    ):(
                       <Text size="2xl" className="text-center color-white font-bold" numberOfLines={2}>
                          {selectSongPlaying?.title || "Song Unknown"}
                       </Text> 
                    )}

                   {(selectSongPlaying?.artist?.length ?? 0) > 0 ?
                   (
                    <View
                     style={{display:"flex",flexDirection:"row",justifyContent:"center"}}
                    >
                      {
                        selectSongPlaying?.artist?.map((elem,index)=>{
                            return(
                             <Pressable key={index} onPress={()=>navigation.replace(`/artistmodal?browseId=${elem.browseId}`)}>
                                <Text size="lg" className="color-gray-400 text-center ">
                                     {elem.name || "Artista desconocido"} {index < (selectSongPlaying?.artist?.length || 0) - 1 ? " & " : ""}
                                </Text>
                             </Pressable>
                            )
                        })
                      }

                    </View>
                   ):
                   (
                     <Text size="lg" className="color-gray-400 text-center ">Artista desconocido</Text>
                   )
                   }
                </View>
            </View>

            <SongProgressBar/>

            <View style={styles.controls}>
                <Pressable onPress={onLiked} style={styles.secondaryControl}>
                    <Icon
                        stroke=""
                        as={Heart}
                        className={isLiked ? "color-red-500" : "color-white"}
                        size="lg"
                    />
                </Pressable>

                <View style={styles.mainControls}>
                    <Pressable onPress={backPlaylist} style={styles.controlBtn}>
                        <Icon as={SkipBack} className="color-white" size="xl" />
                    </Pressable>

                    <Pressable
                        onPress={() =>{playAudio()}}
                        style={styles.playBtn}
                    >
                        <Icon
                            as={status?.playing ? Pause : Play}
                            className="color-white"
                            size="xl"

                        />
                    </Pressable>

                    <Pressable onPress={nextPlaylist} style={styles.controlBtn}>
                        <Icon as={SkipForward} className="color-white" size="xl" />
                    </Pressable>
                </View>

                <Pressable onPress={onRepeat} style={styles.secondaryControl}>
                    <Icon as={Repeat} className={repeat ? "color-background-500" : "color-white"} size="lg" />
                </Pressable>
            </View>

            <View style={styles.bottomSection}>
                <Pressable style={styles.bottomOption} onPress={() => navigation.navigate(`/playlistmodal?videoId=${selectSongPlaying?.videoId}`)}>
                    <Icon as={ListMusic} className="color-white" size="xl" />
                    <Text size="xl" className="color-white mt-1">
                        Lista
                    </Text>
                </Pressable>

                <Pressable style={styles.bottomOption} onPress={()=>navigation.navigate("/lyrics")}>
                    <Icon as={Mic2} className="color-white" size="xl" />
                    <Text size="xl" className="color-white mt-1">
                        Letra
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingTop: 50,
        paddingBottom: 20,
        zIndex: 10,
    },
    content: {
        alignItems: "center",
        marginTop: 20,
    },
    imageContainer: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    albumArt: {
        width: 300,
        height: 300,
        borderRadius: 12,
        objectFit:"contain",
    },
    songInfo: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    controls: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 15,
    },
    secondaryControl: {
        padding: 10,
    },
    mainControls: {
        flexDirection: "row",
        alignItems: "center",
        gap: 30,
    },
    controlBtn: {
        padding: 10,
    },
    playBtn: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#FF6A1A",
        alignItems: "center",
        justifyContent: "center",
    },
    bottomSection: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 80,
        marginTop: 30,
        paddingBottom: 40,
    },
    bottomOption: {
        padding: 10,
        alignItems: "center",
    },
})
