import {ANDROID_VR} from "@/constant/clientYoutube"
import {URL_API_YOUTUBE} from "@/constant/initialValue"
import type {PlayerResponse} from "@/interface/player"

export async  function  fetchStreamData(videoId:string):Promise<PlayerResponse | null>{
    try {
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

        const data:PlayerResponse=await response.json();
     

        return data
    } catch (error) {
        console.log(error)
        return null
    }

}

export  const getSourceFromFormats = (formats: PlayerResponse["streamingData"]["adaptiveFormats"] | undefined) => {
    if (!formats) return null
    const audioFormat = formats.find(format => format.mimeType.includes("audio/mp4"))
    return audioFormat ? audioFormat.url : ""
}


