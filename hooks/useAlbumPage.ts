import {useState,useEffect} from "react"
import type {Album,YTAlbumResponse,YTContents} from "@/interface/album"
import type {Song} from "@/interface/song"
import type {Artist} from "@/interface/artist"


import {URL_API_YOUTUBE} from "@/constant/initialValue"
import {WEB_REMIX} from "@/constant/clientYoutube"
import Storage from 'expo-sqlite/kv-store';

async function fetchPlaylist(playlistid:string){
    try {
        const visitorData = await Storage.getItem('visitorData');
        WEB_REMIX.visitorData = visitorData || "";
        const response = await fetch(`${URL_API_YOUTUBE}browse?prettyPrint=false`,{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
               "X-Goog-Api-Key":"AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
            },
            body:JSON.stringify({
                context:{
                    client:WEB_REMIX
                },
                browseId:"VL"+playlistid,
                params:null,
                localized:true,
            })
        });
        
      const data= await response.json() as YTAlbumResponse;
      return data
    } catch (error) {
      return undefined
    }
}
async function extractMUsic(playlistId:string):Promise<Song[]>{
   const data=await fetchPlaylist(playlistId)
   if(!data){
     return []
   }
   
   const contents=data.contents.twoColumnBrowseResultsRenderer.secondaryContents.sectionListRenderer.contents.find(item=>"musicPlaylistShelfRenderer"in item)
   return contents?.musicPlaylistShelfRenderer.contents.map(item=>{
        const flexColumns=item.musicResponsiveListItemRenderer.flexColumns; 
        const infoMusic=flexColumns.find(item=>
             item.musicResponsiveListItemFlexColumnRenderer.text.runs?.[0].navigationEndpoint?.watchEndpoint?.watchEndpointMusicSupportedConfigs?.watchEndpointMusicConfig.musicVideoType=="MUSIC_VIDEO_TYPE_ATV" ||
             item.musicResponsiveListItemFlexColumnRenderer.text.runs?.[0].navigationEndpoint?.watchEndpoint?.watchEndpointMusicSupportedConfigs?.watchEndpointMusicConfig.musicVideoType=="MUSIC_VIDEO_TYPE_OMV"
        )
        const infoArtist=flexColumns.find(item=>item.musicResponsiveListItemFlexColumnRenderer.text.runs?.[0].navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig.pageType=="MUSIC_PAGE_TYPE_ARTIST")

       return {
          videoId:infoMusic?.musicResponsiveListItemFlexColumnRenderer.text.runs?.[0].navigationEndpoint?.watchEndpoint?.videoId || "",
          playlistId:infoMusic?.musicResponsiveListItemFlexColumnRenderer.text.runs?.[0].navigationEndpoint?.watchEndpoint?.playlistId,
          title:infoMusic?.musicResponsiveListItemFlexColumnRenderer.text.runs?.[0].text || "",
          artist:{
            browseId:infoArtist?.musicResponsiveListItemFlexColumnRenderer.text.runs?.[0].navigationEndpoint?.browseEndpoint?.browseId || "",
            name:infoArtist?.musicResponsiveListItemFlexColumnRenderer.text.runs?.[0].text || ""
          },
          thumbnail:item.musicResponsiveListItemRenderer.thumbnail?.musicThumbnailRenderer.thumbnail.thumbnails[0].url || " ",
          duration:item.musicResponsiveListItemRenderer.fixedColumns?.[0].musicResponsiveListItemFixedColumnRenderer.text.runs?.[0].text || "0:00"
       } as Song
   }) as Song[]
}


async function extractAlbumInfo(content:YTContents){
    let  tabsHeader =content.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0];
    const  musicResponsiveHeaderRenderer="musicResponsiveHeaderRenderer" in tabsHeader?tabsHeader.musicResponsiveHeaderRenderer : undefined
    const artist:Omit<Artist,"thumbnail">={
        browseId:musicResponsiveHeaderRenderer?.straplineTextOne.runs?.[0].navigationEndpoint?.browseEndpoint?.browseId||"Unknow Name",
        name:musicResponsiveHeaderRenderer?.straplineTextOne.runs?.[0].text || "Unknow browseId",
    }
 

    const thumbnail=musicResponsiveHeaderRenderer?.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails[0].url
    // const data=content.twoColumnBrowseResultsRenderer.secondaryContents.sectionListRenderer.contents.find(item=> "musicShelfRenderer" in item)

    

    const navigationPlaylist=musicResponsiveHeaderRenderer?.buttons.find(item=>"musicPlayButtonRenderer"in item)
    const playlistid=navigationPlaylist?.musicPlayButtonRenderer?.playNavigationEndpoint.watchPlaylistEndpoint?.playlistId || navigationPlaylist?.musicPlayButtonRenderer?.playNavigationEndpoint.watchEndpoint?.playlistId

    return {
        title:musicResponsiveHeaderRenderer?.title.runs?.[0].text,
        description:musicResponsiveHeaderRenderer?.description?.musicDescriptionShelfRenderer.description.runs.map(item=>item.text).join(""),
        thumbnail,
        year:musicResponsiveHeaderRenderer?.subtitle.runs.join(""),
        artist,
        songs:await extractMUsic(playlistid || ""),
        duration:musicResponsiveHeaderRenderer?.secondSubtitle.runs.map(item=>item.text).join("")
    } as Album;

}


function extractReleaseAlbum(content:YTContents):Album[]{
    const data=content.twoColumnBrowseResultsRenderer.secondaryContents.sectionListRenderer.contents.find(item=> "musicCarouselShelfRenderer" in item)
    return data?.musicCarouselShelfRenderer.contents.map(item=>{
        const content=item.musicTwoRowItemRenderer;
        const artistData=content.subtitle.runs.find(item=>item.navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig.pageType=="MUSIC_PAGE_TYPE_ARTIST")

        return{
            browseId:content.navigationEndpoint.browseEndpoint?.browseId,
            params:content.navigationEndpoint.browseEndpoint?.params,
            title:content.title.runs[0].text,
            subtitle:content.subtitle.runs.map(item=>item.text).join(""),
            artist:{
               browseId:artistData?.navigationEndpoint?.browseEndpoint?.browseId,
               name:artistData?.text
            },
            thumbnail:content.thumbnailRenderer.musicThumbnailRenderer.thumbnail.thumbnails[0].url
        } as Album;
    }) as Album[]

}

export  default function useAlbumPage({browseId,params}:{browseId:string,params?:string}){
  const [albumContent,setAlbumContent]=useState<Album>();
  const [releaseAlbum,setReleaseAlbum]=useState<Album[]>();

  useEffect(()=>{
    const fetchAlbumData=async()=>{
        try {
            const visitorData = await Storage.getItem('visitorData');
            WEB_REMIX.visitorData = visitorData || "";
            const response = await fetch(`${URL_API_YOUTUBE}browse?prettyPrint=false`,{
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
            });

            const data= await response.json() as YTAlbumResponse;
            setAlbumContent(await extractAlbumInfo(data.contents))
            setReleaseAlbum(extractReleaseAlbum(data.contents))
        } catch (error) {
            console.log(error)
        }
    }
    fetchAlbumData()
  },[])

  return {
    albumContent,
    releaseAlbum
  }

}