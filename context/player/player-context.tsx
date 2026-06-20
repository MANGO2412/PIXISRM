import {
 createContext, useContext, useState, ReactNode,useEffect, useMemo
} from "react"

import {
    useAudioPlayer,
    useAudioPlayerStatus,
    setAudioModeAsync,
    useAudioPlaylist,
    useAudioPlaylistStatus,
    AudioSource
} from "expo-audio";
import {Song} from "@/interface/song"

interface PlayerContextType {
    player: ReturnType<typeof useAudioPlayer> | null,
    setSelectSongPlaying:(selectSongPlaying:Song|undefined)=>void,
    selectSongPlaying:Song|undefined,
    isLoadingPlayer:boolean
}

interface PlayerStatusContextType {
    status: ReturnType<typeof useAudioPlayerStatus> | null
}

const  PlayerContext = createContext<PlayerContextType | null>(null)
const  PlayerStatusContext = createContext<PlayerStatusContextType | null>(null)


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
        
    const contextValue = useMemo(() => ({
        isLoadingPlayer,
        player,
        setSelectSongPlaying,
        selectSongPlaying
    }), [isLoadingPlayer, player, selectSongPlaying]);

    const statusValue = useMemo(() => ({ status }), [status]);

    return (
      <PlayerContext.Provider value={contextValue}>
        <PlayerStatusContext.Provider value={statusValue}>
          {children}
        </PlayerStatusContext.Provider>
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

export function usePlayerStatus() {
    const context = useContext(PlayerStatusContext)
    if (!context) {
        throw new Error('usePlayerStatus must be used within PlayerProvider')
    }
    return context
}