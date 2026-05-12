import {Thumbnail, NavigationEndpoint, TextRun} from "@/interface/searchResult"

export interface WatchEndpointMusicConfig {
    hasPersistentPlaylistPanel: boolean;
    musicVideoType: string;
}

export interface WatchEndpointMusicSupportedConfigs {
    watchEndpointMusicConfig: WatchEndpointMusicConfig;
}

export interface WatchEndpoint {
    videoId: string;
    params?: string;
    playlistId?: string;
    index?: number;
    playerParams?: string;
    playlistSetVideoId?: string;
    loggingContext?: {
        vssLoggingContext: {
            serializedContextData: string;
        };
    };
    watchEndpointMusicSupportedConfigs?: WatchEndpointMusicSupportedConfigs;
}

export interface NavigationEndpointWithWatch extends NavigationEndpoint {
    watchEndpoint?: WatchEndpoint;
}

export interface TextRunWithNavigation extends TextRun {
    navigationEndpoint?: NavigationEndpointWithWatch;
}

export interface Title {
    runs: TextRunWithNavigation[];
}

export interface LongBylineText {
    runs: (TextRunWithNavigation)[];
}

export interface ShortBylineText {
    runs: {text: string}[];
}

export interface LengthText {
    runs: {text: string}[];
    accessibility?: {
        accessibilityData: {
            label: string;
        };
    };
}

export interface ThumbnailRenderer {
    thumbnails: Thumbnail[];
}

export interface PlaylistPanelVideoRenderer {
    title: Title;
    longBylineText: LongBylineText;
    thumbnail: ThumbnailRenderer;
    lengthText: LengthText;
    navigationEndpoint: NavigationEndpointWithWatch;
    shortBylineText: ShortBylineText;
}

export interface AutomixPlaylistVideoRenderer {
    navigationEndpoint: {
        watchPlaylistEndpoint: {
            playlistId: string;
            params: string;
        };
    };
    trackingParams: string;
    automixMode: string;
}

export interface AutomixPreviewVideoRenderer {
    content:{
        automixPlaylistVideoRenderer:AutomixPlaylistVideoRenderer;
    } 
}

export interface PlaylistPanelContent {
    contents: {
        playlistPanelVideoRenderer:PlaylistPanelVideoRenderer,
        automixPreviewVideoRenderer:AutomixPreviewVideoRenderer
    }[];
    continuations?: {
        nextRadioContinuationData?: {
            continuation: string;
            clickTrackingParams: string;
        };
    }[];
}

export interface PlaylistPanelRenderer {
    contents: {
        playlistPanelVideoRenderer:PlaylistPanelVideoRenderer,
        automixPreviewVideoRenderer:AutomixPreviewVideoRenderer
    }[];
    continuations?: {
        nextRadioContinuationData?: {
            continuation: string;
            clickTrackingParams: string;
        };
    }[];
}

export interface QueueContent {
    playlistPanelRenderer: PlaylistPanelRenderer;
}

export interface MusicQueueContent {
    playlistPanelRenderer: QueueContent["playlistPanelRenderer"];
}

export interface TabRendererContent {
    musicQueueRenderer?: {
        content: MusicQueueContent;
    };
}

export interface TabRenderer {
    content?: TabRendererContent;
    title?:string;
    endpoint?:{
        clickTrackingParams:string;
        browseEndpoint:{
            browseId:string;
            browseEndpointContextSupportedConfigs:{
                browseEndpointContextMusicConfig:{
                    pageType:string
                }
            }

        }
    }
}

export interface WatchNextTabbedResultsRenderer {
    tabs: {
        tabRenderer: TabRenderer;
    }[];
}

export interface TabbedRenderer {
    watchNextTabbedResultsRenderer: WatchNextTabbedResultsRenderer;
}

export interface SingleColumnMusicWatchNextResultsRenderer {
    tabbedRenderer: {
        watchNextTabbedResultsRenderer: WatchNextTabbedResultsRenderer;
    };
}

export interface NextResponse {
    contents: {
        singleColumnMusicWatchNextResultsRenderer: SingleColumnMusicWatchNextResultsRenderer;
    };
}





