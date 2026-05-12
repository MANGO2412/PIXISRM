import {createContext} from "react"
import {type Song} from "@/interface/song"

export interface songContextType{
    selectSong?:Song
    updateSong:(newState:Song)=>void
}

const defaultState:songContextType={
    selectSong:undefined,
    updateSong:()=>{}
}


export const SongContext=createContext<songContextType>(defaultState)


