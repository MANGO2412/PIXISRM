import {useContext} from "react"
import {View, Image, StyleSheet, Pressable, FlatList,ActivityIndicator} from "react-native"
import {Text} from "@/components/ui"
import type {PlayList} from "@/interface/playlist"
import {usePlayerContext} from "@/context/player/player-context"
import {fetchStreamData,getSourceFromFormats} from "@/utils/fetchStramData";
import {GlobalContext} from "@/context/reduceContext/"


interface PlaylistModalProps {
    playlist: PlayList[] | null
    currentVideoId?: string
}

export default function PlaylistModal({playlist, currentVideoId}: PlaylistModalProps) {
    const {player,setSelectSongPlaying,selectSongPlaying}=usePlayerContext()
     const {dispatch}=useContext(GlobalContext)
 
    const handlePress = async(item: PlayList) => {
        console.log("Element song is getting when the user press a song item",item);
        if(!item.song.url){
             const responseUrl= await fetchStreamData(item.song.videoId);
             const url = getSourceFromFormats(responseUrl?.streamingData?.adaptiveFormats) || "";
             dispatch({
                    type: "UPDATE_PLAYLIST",
                    payload: {
                      videoId: item.song.videoId,
                      song: { url: url }
                    }
             });

           setSelectSongPlaying({
                 thumbnail: item.song.thumbnail,
                 videoId: item.song.videoId,
                 artist: item.song.artist,
                 title: item.song.title,
                 album: item.song.album,
                 url:url,
                 isThisSongWithPlaylist:true,
                 index:item.index
             })
             
            player?.replace(url) 
        }else{
          setSelectSongPlaying({
              thumbnail: item.song.thumbnail,
              videoId: item.song.videoId,
              artist: item.song.artist,
              title: item.song.title,
              album: item.song.album,
              url:item.song.url,
              isThisSongWithPlaylist:true,
              index:item.index
          })

         player?.replace(item.song.url|| "")  
        }          
    }

    const renderItem = ({item}: {item: PlayList}) => {
        const isPlaying = item.song.videoId === selectSongPlaying?.videoId;

        return (
            <Pressable 
                style={[styles.itemContainer, isPlaying && styles.itemPlaying]}
                onPress={() => handlePress(item)}
            >
                <View style={styles.indexContainer}>
                    <Text size="lg" className={isPlaying ? "color-orange-500" : "color-gray-400"}>
                        {item.index + 1}
                    </Text>
                </View>
                
                {isPlaying && <Image style={{position:"absolute",left:59,top:15,width: 50, height: 50,zIndex: 1}} source={require("@/assets/playingsong.gif")}/>}
                <Image 
                    style={styles.thumbnail} 
                    source={{uri: item.song.thumbnail}} 
                />
                
                <View style={styles.infoContainer}>
                    <Text size="md" className="color-white font-bold" numberOfLines={1}>
                        {item.song.title}
                    </Text>
                    <Text size="sm" className="color-gray-400" numberOfLines={1}>
                        { item.song.artist.length>0 ?item.song.artist.map(elem=>elem.name).join(" & "):"Artista desconocido"}
                    </Text>
                </View>
                
                <Text size="sm" className="color-gray-400 mr-2">
                    {item.song.duration}
                </Text>
            </Pressable>
        )
    }

    if (!playlist || playlist.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                  <ActivityIndicator size="large" color="#FF6A1A" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text size="xl" className="color-white font-bold">
                    Lista de reproducción
                </Text>
                <Text size="sm" className="color-gray-400">
                    {playlist.length} canciones
                </Text>
            </View>

            <FlatList
                data={playlist}
                renderItem={renderItem}
                keyExtractor={(item) => item.song.videoId}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                extraData={selectSongPlaying?.videoId}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#2a2a2a",
    },
    listContent: {
        paddingTop: 10,
        paddingBottom:55,

    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    itemPlaying: {
        backgroundColor: "rgba(255, 106, 26, 0.1)",
    },
    indexContainer: {
        width: 30,
        alignItems: "center",
    },
    thumbnail: {
        width: 50,
        height: 50,
        borderRadius: 6,
        marginHorizontal: 12,
    },
    infoContainer: {
        flex: 1,
        marginRight: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
})