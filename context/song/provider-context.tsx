import React,{useState} from 'react'
import {songContextType,SongContext} from "@/context/song/song-context"
import { Song } from '@/interface/song'


export const SongProvider:React.FC<{children:React.ReactNode}>=({children})=>{
    const [selectSong,setSelectSong]=useState<Song>()

    const updateSong=(newState:Song)=>{
        setSelectSong(newState)
    }
    return(
        <SongContext.Provider value={{selectSong,updateSong}}>
            {children}
        </SongContext.Provider>
    )
}