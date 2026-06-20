import PlaylistModal from "@/components/custome/PlaylistModal"
import {useLocalSearchParams} from "expo-router"
import type {PlayList} from "@/interface/playlist"
import {GlobalContext} from "@/context/reduceContext";
import {useContext,useEffect} from "react"


export default function PlaylistModalScreen() {
    const {videoId} = useLocalSearchParams<{videoId?: string}>()
    const {state}=useContext(GlobalContext)
    const playlist: PlayList[] | null = (state && state.playlist && state.playlist.length > 0) ?  state.playlist.filter((p): p is PlayList => p !== null).sort((a, b) => a.index - b.index) : null

    return <PlaylistModal playlist={playlist} currentVideoId={videoId} />
}