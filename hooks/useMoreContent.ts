import {useState,useEffect} from "react"
import {type Song} from "@/interface/song"
import {browserResponse} from "@/interface/browser"

import {URL_API_YOUTUBE} from "@/constant/initialValue"
import {WEB_REMIX} from "@/constant/clientYoutube"
import Storage from 'expo-sqlite/kv-store';

function extractSongs(data:browserResponse):Song[]{
 
   const playlistShelf=data.contents.singleColumnBrowseResultsRenderer?.tabs[0].tabRenderer.content.sectionListRenderer.contents.find(
       item=>"musicPlaylistShelfRenderer" in item
   )?.musicPlaylistShelfRenderer



   if(!playlistShelf)return[]

   return playlistShelf.contents.filter(item=>"musicResponsiveListItemRenderer" in item).map((item,index)=>{
       const renderer=item.musicResponsiveListItemRenderer
       const flexColumns=renderer?.flexColumns

       const firstRun=flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer.text.runs?.[0]
       const videoId=firstRun?.navigationEndpoint?.watchEndpoint?.videoId || ""
       const playlistId=firstRun?.navigationEndpoint?.watchEndpoint?.playlistId
       const title=firstRun?.text || ""

       const artistRuns=flexColumns.find(item=>
           item.musicResponsiveListItemFlexColumnRenderer.text.runs?.[0].navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig.pageType=="MUSIC_PAGE_TYPE_ARTIST"
       )?.musicResponsiveListItemFlexColumnRenderer.text.runs

       return {
           videoId,
           playlistId,
           title,
           artist:artistRuns?.filter(item=>item.text !=' & ').map(item=>{
               return {
                   browseId:item.navigationEndpoint?.browseEndpoint?.browseId || "",
                   name:item.text || ""
               }
           }) || [],
           thumbnail:renderer.thumbnail?.musicThumbnailRenderer.thumbnail.thumbnails[0].url || " ",
           duration:renderer.fixedColumns?.[0].musicResponsiveListItemFixedColumnRenderer.text.runs?.[0].text || "0:00"
       } as Song
   })
}

export default function useMoreContent({browseId,params}:{browseId:string,params?:string}){
   const [songs,setSongs]=useState<Song[]>([])
   const [loading,setLoading]=useState<boolean>(true)

   useEffect(()=>{
       async function fetchMoreContent(){
           try{
               const visitorData = await Storage.getItem('visitorData');
               WEB_REMIX.visitorData = visitorData || "";
               const response=await fetch(`${URL_API_YOUTUBE}browse?prettyPrint=false`,{
                   method:"POST",
                   headers:{
                       "Content-Type":"application/json",
                       "X-Goog-Api-Key":"AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
                   },
                   body:JSON.stringify({
                       context:{
                           client:WEB_REMIX
                       },
                       browseId:browseId,
                       params:params,
                       localized:true,
                   })
               })

               const data:browserResponse=await response.json()
               const formattedSongs=extractSongs(data)
               setSongs(formattedSongs)
           }catch(error){
               console.log("Error fetching more content:",error)
           }finally{
               setLoading(false)
           }
       }

       fetchMoreContent()
   },[browseId,params])

   return {songs,loading}
}