import useNextPage from "./useNextPage";
import {getParams,getPlaylist} from "@/utils/playlistExtractor"




export default function usePlaylistPage({videoId}:{videoId:string}){
     const nextPageData = useNextPage({videoId})
     const {playlistId,params}=getParams(nextPageData)
     const nextPageRaw=useNextPage({videoId,playlistId,params})
     const playlist=getPlaylist(nextPageRaw)

     return playlist
}