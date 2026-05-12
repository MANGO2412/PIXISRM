import type {NextResponse,AutomixPreviewVideoRenderer,PlaylistPanelVideoRenderer} from "@/interface/next"
import type {PlayList} from "@/interface/playlist"
import type { Song } from "@/interface/song"


export function getParams({nextResponse}:{nextResponse:NextResponse|undefined}){
  
    if(!nextResponse){
      return{params:"",playlistId:""}
    }

    const  tabs=nextResponse.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer.watchNextTabbedResultsRenderer.tabs
    const tabrender=tabs.filter(data=>data.tabRenderer.content)
    const playlistInfo=(tabrender[0].tabRenderer.content?.musicQueueRenderer?.content?.playlistPanelRenderer.contents.find(elem=>'automixPreviewVideoRenderer' in elem) as unknown as {automixPreviewVideoRenderer: AutomixPreviewVideoRenderer})?.automixPreviewVideoRenderer
    const {params,playlistId}=playlistInfo.content.automixPlaylistVideoRenderer.navigationEndpoint.watchPlaylistEndpoint 
    return {params,playlistId}

}


export function getPlaylist({nextResponse}:{nextResponse:NextResponse|undefined}){
      if(!nextResponse){
      return null
    }

    const  tabs=nextResponse.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer.watchNextTabbedResultsRenderer.tabs
    const tabrender=tabs.filter(data=>data.tabRenderer.content)
    const playlistInfo=tabrender[0].tabRenderer.content?.musicQueueRenderer?.content?.playlistPanelRenderer.contents.map(elem=>getPlaylistItem({playlistPanelVideoRenderer:elem.playlistPanelVideoRenderer}))   
    return playlistInfo
}


export function  getPlaylistItem({playlistPanelVideoRenderer}:{playlistPanelVideoRenderer: PlaylistPanelVideoRenderer|undefined}):PlayList|null{
   if(!playlistPanelVideoRenderer){
     return null;
   }
   
    const artistData=playlistPanelVideoRenderer.longBylineText.runs.find(elem=>elem.navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig.pageType=="MUSIC_PAGE_TYPE_ARTIST")
    const albumData=playlistPanelVideoRenderer.longBylineText.runs.find(elem=>elem.navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig.pageType=="MUSIC_PAGE_TYPE_ALBUM")

    const song:Song={
       videoId:playlistPanelVideoRenderer.navigationEndpoint.watchEndpoint?.videoId || "",
       title:playlistPanelVideoRenderer.title.runs[0].text,
       duration:playlistPanelVideoRenderer.lengthText.runs[0].text,
       artist:{browseId:artistData?.navigationEndpoint?.browseEndpoint?.browseId || "",name:artistData?.text || ""},
       album:{browseId:albumData?.navigationEndpoint?.browseEndpoint?.browseId || "",title:albumData?.text ||""},
       thumbnail:playlistPanelVideoRenderer.thumbnail.thumbnails[0].url
    }


    return {
      index:playlistPanelVideoRenderer.navigationEndpoint.watchEndpoint?.index || 0,
      params:playlistPanelVideoRenderer.navigationEndpoint.watchEndpoint?.params || "",
      playlistId:playlistPanelVideoRenderer.navigationEndpoint.watchEndpoint?.playlistId || "",
      song,
    } as PlayList
}






