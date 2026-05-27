import {useState,useEffect} from "react"
import type {NextResponse} from '@/interface/next'
import type {Lyrics,LyricsResponse} from "@/interface/lyrics"
import {URL_API_YOUTUBE} from "@/constant/initialValue"
import {WEB_REMIX} from "@/constant/clientYoutube"
import Storage from 'expo-sqlite/kv-store';


const getBrowseidLyrics=(value:NextResponse)=>{
  const content=value.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer.watchNextTabbedResultsRenderer.tabs
  const tabrenderer=content.find(item=>item.tabRenderer.title=="Lyrics")
  return tabrenderer?.tabRenderer.endpoint?.browseEndpoint.browseId
}

const useLyrics=({ videoId }: { videoId: string  })=>{
    const [lyrics,setLyrics]=useState<Lyrics>()
    const [isLoading,setIsLoading]=useState(false)

    useEffect(()=>{
      const getLyrics=async()=>{
        setIsLoading(true)
        try {
            const visitorData = await Storage.getItem('visitorData');
            WEB_REMIX.visitorData = visitorData;
            //next  response
            const responseNext = await fetch(`${URL_API_YOUTUBE}next`,{
                 method:"POST",
                 headers:{
                   "Content-Type":"application/json",
                    "X-Goog-FieldMask":"contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer.watchNextTabbedResultsRenderer.tabs.tabRenderer(endpoint,title)",
                    "X-Goog-Api-Key":"AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
                 },
                 body:JSON.stringify({
                     context:{
                         client:WEB_REMIX
                     },
                    "isAudioOnly": true,
                    "playlistId": null,
                    "tunerSettingValue":"AUTOMIX_SETTING_NORMAL",
                    "index": null,
                    "params":  null,
                    "playlistSetVideoId": null,
	                 "watchEndpointMusicSupportedConfigs":{
	                 	 "musicVideoType":"MUSIC_VIDEO_TYPE_ATV"
	                 },
	                 "videoId":videoId
                 })
           });
          const dataNext:NextResponse= await responseNext.json();

          //Browse Response
          const browseID=getBrowseidLyrics(dataNext);
          const response = await fetch(`${URL_API_YOUTUBE}browse?prettyPrint=false`,{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
               "X-Goog-FieldMask":"contents.sectionListRenderer.contents.musicDescriptionShelfRenderer.description",
               "X-Goog-Api-Key":"AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
            },
            body:JSON.stringify({
                context:{
                    client:WEB_REMIX
                },
                browseId:browseID,
                params:null,
                localized:true,
            })
         });
         const data:LyricsResponse= await response.json();

         setLyrics({text:data.contents.sectionListRenderer.contents[0].musicDescriptionShelfRenderer.description.runs[0].text})

        } catch (error) {
            console.log("Error ferching data from lyrics",lyrics)
        }
        setIsLoading(false)
      }
      getLyrics()
    },[videoId])

    return {lyrics,isLoading}
}


export default useLyrics;