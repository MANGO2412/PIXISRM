/**
 * No modificar este comentario
 */
// export interface Artist{
//     browseId:string,
//     name:string
//     thumbnail:string,
//     subscribers?:string,
//     description?:string,
//     songs?:{
//         thumbnail:string,
//         videoId:string,
//         title:string,
//         artist:{name:string},
//         duration:string
//     }[],
//     albums?:{
//         thumbnail:string,
//         browseId:string,
//         title:string,
//         year:string
//     }[],
//     playlists?:{
//         thumbnail:string,
//         browseId:string,
//         title:string,
//         itemCount:string
//     }[],
//     relatedArtists?:{
//         browseId:string,
//         name:string,
//         thumbnail:string
//     }[]
// }

import type {Song} from "@/interface/song"


export interface Artist{
    browseId:string,
    name:string
    thumbnail:string,
    subscribers?:string,
    description?:string,
    songs?:{
        thumbnail:string,
        videoId:string,
        title:string,
        artist:{
            name:string
        }[]
    }[],
    albums?:{
        thumbnail:string,
        browseId:string,
        title:string,
        year:string
    }[],
    singlesAndEps?:{
        thumbnail:string,
        browseId:string,
        title:string,
        subtitle:string
    }[],
    relatedArtists?:{
        browseId:string,
        name:string,
        thumbnail:string,
        subscribers?:string
    }[],
    songsParams?:string
    moreContent?:{
        type:"song"|"artist"|"album",
        browseId:string,
        params:string
    }[]
}

export interface YTMusicResponse {
    header?: {
        musicImmersiveHeaderRenderer?: {
            title: {
                runs: Array<{ text: string }>
            },
            subtitle: {
                runs: Array<{ text: string }>
            },
            description:{
                runs: Array<{ text: string }>
            },
            thumbnail: {
                musicThumbnailRenderer: {
                    thumbnail: {
                        thumbnails: Array<{ url: string; width: number; height: number }>
                    }
                }
            },
            subscriptionButton:{
                subscribeButtonRenderer:{
                    channelId:string,
                    subscriberCountText:{
                         runs: Array<{ text: string }>
                    }
                }
            }
        }
    };
    contents: {
        singleColumnBrowseResultsRenderer?: {
            tabs: Array<{
                tabRenderer: {
                    content: {
                        sectionListRenderer: {
                            contents: YTSectionContent[]
                        }
                    }
                }
            }>
        }
    }
}

export type YTSectionContent = 
    | { musicShelfRenderer: YTMusicShelfRenderer }
    | { musicCarouselShelfRenderer: YTMusicCarouselShelfRenderer }
    | { musicDescriptionShelfRenderer: YTMusicDescriptionShelfRenderer };

export interface YTMusicShelfRenderer {
    bottomEndpoint?: YTNavigationEndpoint;
    title?: {
        runs: Array<{ text: string; navigationEndpoint?: YTNavigationEndpoint }>
    };
    subtitle?: {
        runs: Array<{ text: string }>
    };
    contents: YTMusicShelfItem[];
    continuation?: string;
}

export interface YTMusicShelfItem {
    musicResponsiveListItemRenderer: {
        flexColumns: Array<{
            musicResponsiveListItemFlexColumnRenderer: {
                text: {
                    runs?: Array<{ text: string; navigationEndpoint?: YTNavigationEndpoint }>
                }
            }
        }>;
        playlistItemData:{
            videoId:string
        }
        thumbnail: {
            musicThumbnailRenderer: {
                thumbnail: {
                    thumbnails: Array<{ url: string; width: number; height: number }>
                }
            }
        };
        overlay:{
            musicItemThumbnailOverlayRenderer:YTMusicItemThumbnailOverlayRenderer
        }
        navigationEndpoint?: YTNavigationEndpoint;

    }
}

export interface YTMusicCarouselShelfRenderer {
    header?: {
        musicCarouselShelfBasicHeaderRenderer: {
            title: {
                runs: Array<{ text: string }>
            }
            strapline?: {
                runs: Array<{ text: string }>
            }
        }
    };
    contents: Array<{
        musicTwoRowItemRenderer: YTMusicTwoRowItemRenderer
    }>;
}

export interface YTMusicTwoRowItemRenderer {
    title: {
        runs: Array<{ text: string }>
    };
    subtitle?: {
        runs: Array<{ text: string }>
    };
    thumbnailRenderer: {
        musicThumbnailRenderer: {
            thumbnail: {
                thumbnails: Array<{ url: string; width: number; height: number }>
            }
        }
    };
    navigationEndpoint: YTNavigationEndpoint;
}

export interface YTMusicDescriptionShelfRenderer {
    header?: {
        runs: Array<{ text: string }>
    };
    description: {
        runs: Array<{ text: string }>
    };
    footer?: {
        runs: Array<{ text: string }>
    };
}

export interface YTMusicItemThumbnailOverlayRenderer{
    content:{
        musicPlayButtonRenderer:{
            playNavigationEndpoint:{
                watchEndpoint:{
                    videoId:string;
                    playlistId:string
                }
            }
        }
    }
}

export interface YTNavigationEndpoint {
    watchEndpoint?: {
        videoId: string;
        playlistId?: string;
        watchEndpointMusicSupportedConfigs?:{
            watchEndpointMusicConfig?: {
                musicVideoType: string
            }
        }

    };
    browseEndpoint?: {
        browseId: string;
        params:string;
        browseEndpointContextSupportedConfigs?: {
            browseEndpointContextMusicConfig?: {
                pageType: string
            }
        }
    };
}