import {
createContext, useContext, useState, ReactNode,useEffect
} from "react"

import {
    useAudioPlayer,
    useAudioPlayerStatus,
    setAudioModeAsync
} from "expo-audio"
import {Song} from "@/interface/song"

interface PlayerContextType {
    player: ReturnType<typeof useAudioPlayer> | null,
    status: ReturnType<typeof useAudioPlayerStatus> | null,
    setSelectSongPlaying:(selectSongPlaying:Song|undefined)=>void,
    selectSongPlaying:Song|undefined,
    isLoadingPlayer:boolean
}

const  PlayerContext = createContext<PlayerContextType | null>(null)


export function PlayerProvider({ children }: { children: ReactNode })  {
    const [isLoadingPlayer,setIsLoadingPlayer]=useState<boolean>(false)
    const [selectSongPlaying,setSelectSongPlaying]=useState<Song>()
    const player = useAudioPlayer()
    const status = useAudioPlayerStatus(player)
    
    useEffect(() => {
      const setup=async()=>{
         try {
          
          await setAudioModeAsync({
            playsInSilentMode: true,
            shouldPlayInBackground: true,
            interruptionMode: 'doNotMix',
           })
           console.log('Audio mode set successfully');
         } catch (error) {
            console.error('Error setting up audio player:', error);
         }
      }
      setup();
    }, [player])
        
    return (
      <PlayerContext.Provider value={{ isLoadingPlayer,player, status,setSelectSongPlaying,selectSongPlaying }}>
        {children}
      </PlayerContext.Provider>
    )
}

export function usePlayerContext() {
    const context = useContext(PlayerContext)
    if (!context) {
        throw new Error('usePlayerContext must be used within PlayerProvider')
    }
    return context
}