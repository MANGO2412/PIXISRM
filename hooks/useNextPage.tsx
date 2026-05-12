import {useState,useEffect,useRef} from "react"
import {NextResponse} from "@/interface/next"
import {WEB_REMIX} from "@/constant/clientYoutube"
import {URL_API_YOUTUBE} from "@/constant/initialValue"


export default function useNextPage({params,videoId,playlistId}:{params?:string,videoId?:string,playlistId?:string}){
    const [nextResponse,setNextResponse]=useState<NextResponse>()

    useEffect(()=>{   
        async function fetchNex() {
            try {
                const response=await fetch(`${URL_API_YOUTUBE}next`,{
                        method:"POST",
                        headers:{
                          "Content-Type":"application/json",
                          "X-Goog-FieldMask":"contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer.watchNextTabbedResultsRenderer.tabs.tabRenderer.content.musicQueueRenderer.content.playlistPanelRenderer(continuations,contents(automixPreviewVideoRenderer,playlistPanelVideoRenderer(title,navigationEndpoint,longBylineText,shortBylineText,thumbnail,lengthText)))",
                          "X-Goog-Api-Key":"AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
                        },
                        body:JSON.stringify({
                            context:{
                                client:WEB_REMIX
                            },
                           "isAudioOnly": true,
                           "playlistId":playlistId,
                           "tunerSettingValue":"AUTOMIX_SETTING_NORMAL",
                           "index": null,
                           "params":  params,
                           "playlistSetVideoId": null,
	                        "watchEndpointMusicSupportedConfigs":{
	                        	 "musicVideoType":"MUSIC_VIDEO_TYPE_ATV"
	                        },
	                        "videoId":videoId
                        })
                })

                const data:NextResponse=await response.json()
                console.log("output json",data)
                setNextResponse(data)
            } catch (error) {
                console.error("fatch error response",error)
            }
        }

        fetchNex();
    },[params, videoId, playlistId])

    return {nextResponse}
}