type WatchEndpointMusicConfig={
    musicVideoType:string;
}

type WatchEnpointMusicSupportedConfigs={
    watchEnpointMusicConfig:WatchEndpointMusicConfig
}

export interface WatchEndpoint{
    videoId:string;
    watchEndpointMusicSupportedConfigs:WatchEnpointMusicSupportedConfigs
}

type BrowseEndpointContextMusicConfig ={
    pageType:string;
}

type BrowseEndpointContextSupportedConfigs={
    browseEndpointContextMusicConfig:BrowseEndpointContextMusicConfig
}

export interface BrowseEndpoint{
    browseId:string;
    params?:string;
    browseEndpointContextSupportedConfigs:BrowseEndpointContextSupportedConfigs
}