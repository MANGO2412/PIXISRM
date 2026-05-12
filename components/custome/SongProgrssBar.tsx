import {useEffect,useState,useRef} from "react"
import {View,StyleSheet} from "react-native"
import Slider from "@react-native-community/slider"
import {Text} from "@/components/ui"
import {usePlayerContext} from "@/context/player/player-context"


const SongProgressBar=()=>{
    const {player,status,isLoadingPlayer}=usePlayerContext()
    const [progress, setProgress] = useState(0)
    let isSlidingRef=useRef(false)

    useEffect(() => {
        if (status?.isLoaded  && status.duration > 0 && !isSlidingRef.current) {
            const value = (status.currentTime / status.duration) * 100
            setProgress(value)
        }else{
            setProgress(0)
        } 
    },[status?.currentTime, status?.duration, status?.isLoaded])

  
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${Math.trunc(secs).toString().padStart(2, "0")}`
    }

    return(
           <View style={styles.progressSection}>
                <View >
                    <Slider
                    style={{ width: "100%", height: 30 }}
                    minimumValue={0}
                    maximumValue={100}
                    value={progress}
                    minimumTrackTintColor="#FF6A1A"
                    maximumTrackTintColor="#FFFFFF"
                    thumbTintColor="#FF6A1A"
                    onSlidingStart={() => {
                      isSlidingRef.current = true
                    
                    }}
                    onSlidingComplete={(value) => {
                      isSlidingRef.current = false
                    
                      const newTime = (value / 100) * (status?.duration || 0)
                      player?.seekTo(newTime)
                      player?.play()
                    }}
                    onValueChange={(value) => setProgress(value)}
                  />
                </View>
                <View style={styles.timeContainer}>
                    <Text size="sm" className="color-white">
                        {formatTime(status?.currentTime || 0)}
                    </Text>
                    <Text size="sm" className="color-white">
                        {formatTime(status?.duration || 0)}
                    </Text>
                </View>
            </View>
    )
}

const styles = StyleSheet.create({
    progressSection: {
        marginTop: 30,
        width: "100%",
    },
    timeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    }
})



export default SongProgressBar;