import React,{useState,useMemo,useCallback} from 'react'
import {songContextType,SongContext} from "@/context/song/song-context"
import { Song } from '@/interface/song'


export const SongProvider:React.FC<{children:React.ReactNode}>=({children})=>{
    const [selectSong,setSelectSong]=useState<Song>()

    const updateSong = useCallback((newState:Song)=>{
        setSelectSong(newState)
    }, []);

    const contextValue = useMemo(() => ({ selectSong, updateSong }), [selectSong, updateSong]);

    return(
        <SongContext.Provider value={contextValue}>
            {children}
        </SongContext.Provider>
    )
}