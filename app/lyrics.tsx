import {View,StyleSheet,ScrollView, ActivityIndicator} from "react-native"
import {Text} from "@/components/ui"
import useLyrics from "@/hooks/useLyrics";
import {usePlayerContext} from "@/context/player/player-context"


const Lyrics=()=>{
    const {selectSongPlaying}=usePlayerContext()
    const {lyrics,isLoading}=useLyrics({videoId:selectSongPlaying?.videoId||""})

    if(isLoading){
        return(
          <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF6A1A" />
          </View>
        )
    }


    return( 
    <View style={styles.container}>
        <ScrollView
          bounces={false}
          overScrollMode="never"
        nestedScrollEnabled={true}
        > 
         {lyrics?.text?(
            <Text size="2xl" className="p-20   font-medium">{lyrics.text}</Text>
         ):(
            <Text size="2xl" className="p-20   font-medium">La letra no está disponible</Text>
         )}
        </ScrollView>
    </View>
    )

}

const styles=StyleSheet.create({
     container: {
        flex: 1,
        backgroundColor: "#121212",
    },
     loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
})


export default Lyrics;