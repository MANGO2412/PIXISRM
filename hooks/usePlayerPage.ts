import {useState,useEffect} from "react"
import {VISION_OS} from "@/constant/clientYoutube"
import {URL_API_YOUTUBE} from "@/constant/initialValue"

import type {PlayerResponse} from "@/interface/player"
import Storage from 'expo-sqlite/kv-store';

export default function usePlayerPage(videoId:string){
    const [relatedSongs,setRelatedSongs]=useState<PlayerResponse>()

    useEffect(()=>{
        async function fetchRelatedSongs(){
            console.log("Fetching related songs for videoId:", videoId)
            try{
                const visitorData = await Storage.getItem('visitorData');
                console.log(visitorData)
                VISION_OS.visitorData=visitorData || ""
                console.log(VISION_OS)
                const response=await fetch(`${URL_API_YOUTUBE}player?prettyPrint=false`,{
                    method:"POST",
                    headers:{
                     "Content-Type":"application/json",
                     "X-Goog-FieldMask":"playabilityStatus.status,playerConfig.audioConfig,streamingData.adaptiveFormats,videoDetails.videoId",
                     "X-Goog-Api-Key":"AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
                   },
                   body:JSON.stringify({
                       context:{
                           client:VISION_OS
                       },
                       videoId:videoId,
                   })           
                })
                const data:PlayerResponse=await response.json()
                // console.log("Related songs data:",data)
                setRelatedSongs(data)
            }catch(error){
                console.error("Error fetching related songs:",error)
            }
        }
        fetchRelatedSongs()

    },[videoId])
    
    return {relatedSongs}
}