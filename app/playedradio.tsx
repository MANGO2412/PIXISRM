import SongProgressBar from "@/components/custome/SongProgrssBar"
import {usePlayerContext,usePlayerStatus} from "@/context/player/player-context"
import {useState} from "react"
import {View, Image, StyleSheet, Pressable,ImageBackground} from "react-native"
import {Text, Icon} from "@/components/ui"
import {
    Play,
    Pause,
} from "lucide-react-native"




export default function PlayedRadio(){
    const {player,selectRadioStation}=usePlayerContext();
    const [error, setError] = useState<boolean>(false);
    const {status}=usePlayerStatus();

    const playAudio =  () => {
        if (status?.playing) {
            player?.pause()
        } else {
            player?.play()
        }  
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                source={selectRadioStation?.favicon ? error ? require("@/assets/notUrlImage.png"): {uri: selectRadioStation.favicon} : require("@/assets/notUrlImage.png")}  
                style={{width: 500, height: 900, position: "absolute", top: 0, left: 0,opacity:0.3,}}
                blurRadius={50}
            />

            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.albumArt}
                        source={selectRadioStation?.favicon ? error ? require("@/assets/notUrlImage.png"): {uri: selectRadioStation.favicon} : require("@/assets/notUrlImage.png")}
                        onError={() => {
                          setError(true)
                        }}
                    />
                </View>
                <View style={styles.songInfo}>
                    <Text size="2xl" className="text-center color-white font-bold" numberOfLines={2}>
                        {selectRadioStation?.name || "Station Unknown"}
                    </Text> 
                </View>
            </View>

            <SongProgressBar/>

            <View style={styles.controls}>
        

                <View style={styles.mainControls}>
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
                </View>
            </View>
        </View>
    )


    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        paddingVertical:50,
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
        width:"100%",
        justifyContent:"center",
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
    }
})


