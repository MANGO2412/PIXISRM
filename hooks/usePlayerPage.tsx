import {useState,useEffect} from "react"
import {ANDROID_VR} from "@/constant/clientYoutube"
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
                ANDROID_VR.visitorData = visitorData;
                const response=await fetch(`${URL_API_YOUTUBE}player?prettyPrint=false`,{
                    method:"POST",
                    headers:{
                     "Content-Type":"application/json",
                     "X-Goog-FieldMask":"playabilityStatus.status,playerConfig.audioConfig,streamingData.adaptiveFormats,videoDetails.videoId",
                     "X-Goog-Api-Key":"AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
                   },
                   body:JSON.stringify({
                       context:{
                           client:ANDROID_VR
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