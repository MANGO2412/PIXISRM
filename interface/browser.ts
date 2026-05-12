import {type Run} from "@/interface/run"
import {BrowseEndpoint} from '@/interface/endpoint'

export interface thumbnail{
    url:string;
    width:number;
    height:number
}


export interface MusicThumbnailRenderer{
    thumbnail:{
        thumbnails:thumbnail[]
    },
    thumbnailCrop:string,
    thumbnailScale:string,
    trackingParams:string
}

export interface MusicResponsiveListItemFlexColumnRenderer{
       text:{
         runs:Run[]
       },
       displayPriority:string
}


export interface MusicResponsiveListItemRenderer{
    thumbnail:{
         musicThumbnailRenderer:MusicThumbnailRenderer        
    },
    flexColumns:{
        musicResponsiveListItemFlexColumnRenderer:MusicResponsiveListItemFlexColumnRenderer
    }[],
}


export interface MusicTwoRowItemRenderer{
    thumbnailRenderer:{
        musicThumbnailRenderer:MusicThumbnailRenderer
    }
    title:{
        runs:Run[]
    },
    subtitle:{
        runs:Run[]
    },
    navigationEndpoint:{
        browseEndpoint?:BrowseEndpoint;
    }
}

export interface MusicCarouselShelBasicHeaderRenderer{
    title:{
        runs:Run[]
    },
    strapline?:{
        runs:Run[]
    }
}
export interface MusicCarouselShelfRenderer{
    header:{
        musicCarouselShelfBasicHeaderRenderer:MusicCarouselShelBasicHeaderRenderer
    },
    contents:{
        musicResponsiveListItemRenderer?:MusicResponsiveListItemRenderer,
        musicTwoRowItemRenderer?:MusicTwoRowItemRenderer
    }[]
}

export interface browserResponse{
    contents:{
        sectionListRenderer:{
            contents:{
                musicCarouselShelfRenderer:MusicCarouselShelfRenderer
            }[]
        }
    }
}