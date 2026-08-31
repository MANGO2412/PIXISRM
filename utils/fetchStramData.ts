import axios from "axios"
import {VISION_OS} from "@/constant/clientYoutube"
import {URL_API_YOUTUBE} from "@/constant/initialValue"
import type {PlayerResponse} from "@/interface/player"
import Storage from 'expo-sqlite/kv-store';
import { Directory, File, Paths } from 'expo-file-system';
import { fetch } from 'expo/fetch';

const destination = new Directory(Paths.cache, 'LocalMusic');


export async  function  fetchStreamData(videoId:string):Promise<PlayerResponse | null>{
    try {
        const visitorData = await Storage.getItem('visitorData') || "";
        VISION_OS.visitorData = visitorData;
        const response = await axios.post(`${URL_API_YOUTUBE}player?prettyPrint=false`,{
            context:{
                client:VISION_OS
            },
            videoId:videoId,
        },{
            headers:{
                "Content-Type":"application/json",
                "X-Goog-FieldMask":"playabilityStatus.status,playerConfig.audioConfig,streamingData.adaptiveFormats,videoDetails.videoId",
                "X-Goog-Api-Key":"AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
            }
        })

        return response.data as PlayerResponse
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


export const downloadSong=async(url:string)=>{
   console.log("Con el fetch de expo")
   const response = await fetch(url);
  console.log("obtuvo el source")
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const file = new File(Paths.document, 'audio2.mp4');

//     console.log("inicializo el obj")

//   file.create({
//     overwrite: true,
//   });

//    console.log("inicializo lo creo")

//       console.log("obteniendo bytes")
//   file.write(await response.bytes());
//     console.log("obtuvo bytes")
//     console.log(file.uri)

//   return file.uri;
}


