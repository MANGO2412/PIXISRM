import {View, Image, StyleSheet, Pressable,ImageBackground} from "react-native"
import { useContext, useState} from "react"
import {Text, Icon} from "@/components/ui"

import {
    useRouter,
    router
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
import {usePlayerContext} from "@/context/player/player-context"
import SongProgressBar from "@/components/custome/SongProgrssBar"

export default function PlayedSong() {
    let navigation=useRouter()
    const {state}=useContext(GlobalContext)
    const [isLiked, setIsLiked] = useState(false)

    const {player,status,setSelectSongPlaying,selectSongPlaying}=usePlayerContext()
   
       
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
                const nextSong=state.playlist[(currentSong?.index|| 0)+1]
                console.log("next song",nextSong)
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
    
    const backPlaylist=()=>{
         if(state.playlist){
            const currentSong=state.playlist?.find(item=>item.song.videoId==selectSongPlaying?.videoId)
            if((currentSong?.index|| 0)-1>=0){
                 player?.replace("")
                const nextSong=state.playlist[(currentSong?.index|| 0)-1]
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => {}}>
                    <Icon as={MoreHorizontal} className="color-white" size="xl" />
                </Pressable>
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
                    <Text size="2xl" className="text-center color-white font-bold" numberOfLines={2}>
                        {selectSongPlaying?.title || "Song Title"}
                    </Text>
                    <Pressable onPress={()=>navigation.replace(`/artistmodal?browseId=${selectSongPlaying?.artist.browseId}`)}>
                       <Text size="lg" className="color-gray-400 text-center ">
                           {selectSongPlaying?.artist.name || "Artist Name"}
                       </Text>
                    </Pressable>
                </View>
            </View>

             <SongProgressBar/>

            <View style={styles.controls}>
                <Pressable onPress={() => {}} style={styles.secondaryControl}>
                    <Icon
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

                <Pressable onPress={() => {}} style={styles.secondaryControl}>
                    <Icon as={Repeat} className="color-white" size="lg" />
                </Pressable>
            </View>

            <View style={styles.bottomSection}>
                <Pressable style={styles.bottomOption} onPress={() =>{router.setParams({ showDetailSong: undefined }) ;router.push({pathname: "/playlistmodal", params: {videoId:selectSongPlaying?.videoId}})}}>
                    <Icon as={ListMusic} className="color-white" size="xl" />
                    <Text size="xl" className="color-white mt-1">
                        Lista
                    </Text>
                </Pressable>

                <Pressable style={styles.bottomOption} onPress={()=>router.push("/lyrics")}>
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
        marginTop: 30,
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
        marginTop: 90,
        paddingBottom: 40,
    },
    bottomOption: {
        alignItems: "center",
    },
})
