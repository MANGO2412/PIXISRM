import type {Artist,YTMusicResponse,YTMusicShelfRenderer,YTMusicCarouselShelfRenderer} from "@/interface/artist"
import type {Song} from "@/interface/song"
import type {Album} from "@/interface/album"
import type {PlaylistArtist} from "@/interface/playlist"


import {URL_API_YOUTUBE} from "@/constant/initialValue"
import {WEB_REMIX} from "@/constant/clientYoutube"
import Storage from 'expo-sqlite/kv-store';
import {useState,useEffect} from "react"


function extractMusicData(musicShelf: YTMusicShelfRenderer| undefined):Song[]{
    if(!musicShelf) return [];
    return musicShelf.contents.map(item=>{
        const music=item.musicResponsiveListItemRenderer;
        const artistinfo=music.flexColumns.find(item=>item.musicResponsiveListItemFlexColumnRenderer.text?.runs?.[0].navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType==="MUSIC_PAGE_TYPE_ARTIST")
        return {
            thumbnail:music.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails[0].url,
            videoId:music.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer.playNavigationEndpoint.watchEndpoint.videoId,
            playlistId:music.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer.playNavigationEndpoint.watchEndpoint.playlistId,                                                                                             
            title:music.flexColumns.find(item=>item.musicResponsiveListItemFlexColumnRenderer.text?.runs?.[0].navigationEndpoint?.watchEndpoint?.watchEndpointMusicSupportedConfigs?.watchEndpointMusicConfig?.musicVideoType==="MUSIC_VIDEO_TYPE_ATV")?.musicResponsiveListItemFlexColumnRenderer.text.runs?.[0].text || "Unknown Title",
            artist:artistinfo?.musicResponsiveListItemFlexColumnRenderer.text.runs?.filter(elem=>elem.text !=' & ').map(elem=>{
              return {
                name:elem.text,
                browseId:elem.navigationEndpoint?.browseEndpoint?.browseId
              }
            })
        } 
    }) as Song[]
}

function extractAlbumData(musicCarousel:YTMusicCarouselShelfRenderer|undefined):Album[]{
   if(!musicCarousel) return[]
   return musicCarousel.contents.map(item=>{
     const album=item.musicTwoRowItemRenderer;
     return{
        thumbnail:album.thumbnailRenderer.musicThumbnailRenderer.thumbnail.thumbnails[0].url,
        browseId:album.navigationEndpoint.browseEndpoint?.browseId,
        params:album.navigationEndpoint.browseEndpoint?.params,
        year:album.subtitle?.runs[0].text,
        title:album.title.runs[0].text
     }
   }) as Album[]
}

function extractRelatedArtist(artistCarousel:YTMusicCarouselShelfRenderer|undefined):Artist[]{
   if(!artistCarousel) return[];

   return artistCarousel.contents.map(item=>{
     const artist=item.musicTwoRowItemRenderer;
     return {
       thumbnail:artist.thumbnailRenderer.musicThumbnailRenderer.thumbnail.thumbnails[0].url,
       name:artist.title.runs[0].text,
       subscribers:artist.subtitle?.runs[0].text,
       browseId:artist.navigationEndpoint.browseEndpoint?.browseId
     }
   }) as Artist[]
}

function extractSinglesAndEps(singlesAndEpsCarousel:YTMusicCarouselShelfRenderer|undefined):PlaylistArtist[]{
   if(!singlesAndEpsCarousel) return [];

   return singlesAndEpsCarousel.contents.map(item=>{
      const playlist=item.musicTwoRowItemRenderer;
      return {
        thumbnail:playlist.thumbnailRenderer.musicThumbnailRenderer.thumbnail.thumbnails[0].url,
        browseId:playlist.navigationEndpoint.browseEndpoint?.browseId,
        title:playlist.title.runs[0].text,
        subtitle: playlist.title.runs[0].text
      }
   }) as PlaylistArtist[]
}

function extractArtistData(data: YTMusicResponse):Artist{
  const header=data.header?.musicImmersiveHeaderRenderer
  const content=data.contents.singleColumnBrowseResultsRenderer?.tabs[0].tabRenderer.content.sectionListRenderer.contents;   
  const carrouselContent=content?.filter(section=>"musicCarouselShelfRenderer" in section)
  const songsSection=content?.find(section=>"musicShelfRenderer" in section)?.musicShelfRenderer
  const songs=extractMusicData(songsSection); 
  const albums=extractAlbumData(carrouselContent
                                      ?.find(section=>
                                          section
                                             .musicCarouselShelfRenderer
                                             .header
                                             ?.musicCarouselShelfBasicHeaderRenderer
                                             .title
                                             .runs[0].text=="Albums"
                                            )?.musicCarouselShelfRenderer)
  

  const  relatedArtists=extractRelatedArtist(carrouselContent
                                     ?.find(section=>
                                      section
                                          .musicCarouselShelfRenderer
                                          .header
                                          ?.musicCarouselShelfBasicHeaderRenderer
                                          .title
                                          .runs[0].text=="Fans might also like"
                                     )?.musicCarouselShelfRenderer)
  

  const singlesAndEps=extractSinglesAndEps(carrouselContent
                              ?.find(section=>
                                section
                                      .musicCarouselShelfRenderer
                                      .header
                                      ?.musicCarouselShelfBasicHeaderRenderer
                                      .title
                                      .runs[0].text.includes("Singles & EPs")
                              )?.musicCarouselShelfRenderer)
                                       

  return{
    songs: songs,
    albums:albums,
    relatedArtists:relatedArtists,
    singlesAndEps:singlesAndEps,
    songsParams:songsSection?.title?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.params,
    browseId:header?.subscriptionButton.subscribeButtonRenderer.channelId || "",
    name:header?.title.runs[0].text || "",
    thumbnail:header?.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails[0].url || "",
    description:header?.description?.runs.map(elem=>elem.text).join(""),
    subscribers:header?.subscriptionButton.subscribeButtonRenderer.subscriberCountText.runs[0].text,
    moreContent:[
      {
        type:"song",
        browseId:songsSection?.bottomEndpoint?.browseEndpoint?.browseId || "",
        params:songsSection?.bottomEndpoint?.browseEndpoint?.params || ""
      }
    ]
  }
}


export default function useArtistPage({ browseId }: { browseId: string  }) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate an API call to fetch artist data
    const fetchArtistData = async () => {
      setLoading(true);
      try {
        const visitorData = await Storage.getItem('visitorData');
        WEB_REMIX.visitorData = visitorData || "";
        const response = await fetch(`${URL_API_YOUTUBE}browse?prettyPrint=false`,{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
               "X-Goog-FieldMask":"contents,header",
               "X-Goog-Api-Key":"AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
            },
            body:JSON.stringify({
                context:{
                    client:WEB_REMIX
                },
                browseId:browseId,
                params:null,
                localized:false,
            })
        });
        const data= await response.json();
        console.log("console data:",data);
        const formatData= extractArtistData(data);
        setArtist(formatData);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, []);

  return { artist, loading };
}