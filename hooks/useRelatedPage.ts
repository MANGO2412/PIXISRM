import {useState,useEffect} from "react"

import {browserResponse,MusicResponsiveListItemRenderer,MusicTwoRowItemRenderer} from "@/interface/browser"
import {nextResponse} from "@/interface/next"

import {URL_API_YOUTUBE} from "@/constant/initialValue"
import {WEB_REMIX} from "@/constant/clientYoutube"
import Storage from 'expo-sqlite/kv-store';

//tyopes to extracted info about songs, albums and artists from related page
import {type Song} from "@/interface/song"
import {type Album } from "@/interface/album"
import {type Artist}  from "@/interface/artist"



function formattedtoSong (item?:MusicResponsiveListItemRenderer | undefined):Song|null{
    try{ 
        if(!item)return null

        const videoId=item.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].navigationEndpoint.watchEndpoint?.videoId||""
        const title=item.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text||""
        const thumbnailUrl=item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails[0].url||""
       
        // const artistName=item.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text||""
        // const browseId=item.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].navigationEndpoint?.browseEndpoint?.browseId||""

        const artistinfo=item.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs;
        const album=item.flexColumns.find(item=>item.musicResponsiveListItemFlexColumnRenderer.text.runs[0].navigationEndpoint.browseEndpoint?.browseEndpointContextSupportedConfigs.browseEndpointContextMusicConfig.pageType=="MUSIC_PAGE_TYPE_ALBUM")

     
        return {
            videoId:videoId,
            title:title,
            artist:artistinfo.map(elem=>{
                return {
                    name:elem.text,
                    browseId:elem.navigationEndpoint?.browseEndpoint?.browseId || ""
                }
            }),
            album:{
              title:album?.musicResponsiveListItemFlexColumnRenderer.text.runs[0].text || "Uknown Album",
              browseId:album?.musicResponsiveListItemFlexColumnRenderer.text.runs[0].navigationEndpoint.browseEndpoint?.browseId || ""
            },
            thumbnail:thumbnailUrl
        }
    }catch(error){
        console.log("Error formatting to song:",error)
        return null
    }
}

function formattedToAlbum(item:MusicTwoRowItemRenderer|undefined):Album|null{
   try{
    if(!item)return null
    const title=item.title.runs[0].text||""
    const year=item.subtitle.runs[2].text||""
    const thumbnailUrl=item.thumbnailRenderer.musicThumbnailRenderer.thumbnail.thumbnails[0].url||""
    const artistName=item.subtitle.runs[0].text||"Unknown Artist"
    const artistBrowserId=item.subtitle.runs[0].navigationEndpoint?.browseEndpoint?.browseId||""
    const browserId=item.navigationEndpoint?.browseEndpoint?.browseId||""
    
    return {
        title:title,
        thumbnail:thumbnailUrl,
        artist:{
            name:artistName,
            browseId:artistBrowserId,
            thumbnail:""
        },
        browseId:browserId,
        year:year
    }
      
   }catch(error){
    return null
  }
}

function formattedToArtist(item:MusicTwoRowItemRenderer|undefined):Artist|null{
    try{
        if(!item)return null
        const name=item.title.runs[0].text||""
        const thumbnailUrl=item.thumbnailRenderer.musicThumbnailRenderer.thumbnail.thumbnails[0].url||""
        const browserId=item.navigationEndpoint?.browseEndpoint?.browseId||""   
        return {
            name:name,
            thumbnail:thumbnailUrl,
            browseId:browserId
        }
    }catch(error){
        return null
    }
}

export default function useRelatedPage({videoid}:{videoid:string}){
    const [relatedPage,setRelatedPage]=useState<browserResponse|null>(null)
    const [nextPage,setNextPage]=useState<nextResponse|null>(null)
    const [relatedSongs,setRelatedSongs]=useState<Song[][] | null| undefined>([])
    const [relatedAlbums,setRelatedAlbums]=useState<Album[] | null>([])
    const [relatedArtists,setRelatedArtists]=useState<Artist[] | null>([])

     useEffect(()=>{
        async function fetchRelatedPage(){
         try{
            const visitorData = await Storage.getItem('visitorData');
            WEB_REMIX.visitorData = visitorData || "";
            const response=await fetch(URL_API_YOUTUBE+"next?prettyPrint=false",{
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
                 videoId:videoid,
                 isAudioOnly:false,
                 playlistSetVideoId:null,
                 tunnerSettingValue:"AUTOMIX_SETTING_NORMAL",
                 index:null,
                 params:null,
                 watchEndpointMusicSupportedConfigs:{
                   musicVideoType : "MUSIC_VIDEO_TYPE_ATV"
                 }
             })
            })


          const data:nextResponse=await response.json()
          setNextPage(data)


        }catch(error){
            console.log("Error fetching related page:",error)
        }
       }

       fetchRelatedPage()
    },[setNextPage,videoid])


    useEffect(()=>{
        //You might also like, Recommended playlists, Other performances,Similar artists, 
        async function fetchRelatedContent(){
            if(!nextPage)return
            try{

                const browseId=nextPage.
                                        contents.
                                        singleColumnMusicWatchNextResultsRenderer.
                                        tabbedRenderer.
                                        watchNextTabbedResultsRenderer.
                                        tabs.find(tab=>tab.tabRenderer.title=="Related")?.tabRenderer.endpoint?.browseEndpoint.browseId                     
                if(!browseId)return

                const visitorData = await Storage.getItem('visitorData');
                WEB_REMIX.visitorData = visitorData || "";
                const response=await fetch(URL_API_YOUTUBE+"browse?prettyPrint=false",{
                    method:"POST",
                    headers:{
                       "Content-Type":"application/json",
                       "X-Goog-FieldMask":"contents.sectionListRenderer.contents.musicCarouselShelfRenderer(header.musicCarouselShelfBasicHeaderRenderer(title,strapline),contents(musicResponsiveListItemRenderer(flexColumns,fixedColumns,thumbnail,navigationEndpoint),musicTwoRowItemRenderer(thumbnailRenderer,title,subtitle,navigationEndpoint)))",
                       "X-Goog-Api-Key":"AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
                    },
                    body:JSON.stringify({
                        localized:true,
                        context:{
                            client:WEB_REMIX
                        },
                        params:null,
                        browseId:browseId
                    })
                })

                const data:browserResponse=await response.json()
                const contents=data.contents.sectionListRenderer.contents
                
                console.log(contents)

                const relatedSongsData:(Song | null)[] | undefined=contents.
                                        find(content=>
                                                       content.
                                                       musicCarouselShelfRenderer.
                                                       header.
                                                       musicCarouselShelfBasicHeaderRenderer.
                                                       title.
                                                       runs[0].
                                                       text=="You might also like")?.
                                                       musicCarouselShelfRenderer.
                                                       contents.map(content=>formattedtoSong(content.musicResponsiveListItemRenderer))
                
                console.log("informacion de las canciones",relatedSongs)

                const relatedAlbumsData:(Album | null)[]|undefined=contents.
                                                 find(content=>content.
                                                               musicCarouselShelfRenderer.
                                                               header.
                                                               musicCarouselShelfBasicHeaderRenderer.strapline?.runs[0] != null)?.musicCarouselShelfRenderer.contents.map(content=>formattedToAlbum(content.musicTwoRowItemRenderer))
                
                const relatedSimilarArtistsData:(Artist|null)[]|undefined=contents.
                                                 find(content=>content.
                                                               musicCarouselShelfRenderer.
                                                               header.
                                                               musicCarouselShelfBasicHeaderRenderer.
                                                               title.
                                                               runs[0].
                                                               text=="Similar artists")?.musicCarouselShelfRenderer.contents.map(content=> formattedToArtist(content.musicTwoRowItemRenderer))

                setRelatedPage(data)
                setRelatedSongs(relatedSongsData?.includes(null)?
                                 []:
                                 relatedSongsData?.flatMap((_,index)=>{
                                    if(index > 4) return [] 
                                    const chunkSize=4
                                    const startIndex=index*chunkSize
                                    return [relatedSongsData.slice(startIndex,startIndex+chunkSize) as Song[]] as Song[][]
                                   
                                 }) as undefined|Song[][])
                
                setRelatedAlbums(relatedAlbumsData?.includes(null)?[]:relatedAlbumsData as Album[])
                setRelatedArtists(relatedSimilarArtistsData?.includes(null)?[]:relatedSimilarArtistsData as Artist[])

            }catch(error){
                console.log("Error fetching related content:",error)
            }
        }

        fetchRelatedContent()

    },[nextPage,setRelatedPage])


   return {relatedPage,relatedSongs,relatedAlbums,relatedArtists}
}