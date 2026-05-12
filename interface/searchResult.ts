export interface Thumbnail {
    url: string;
    width: number;
    height: number;
}

export interface WatchEndpointMusicConfig {
    musicVideoType: string;
}

export interface WatchEndpointMusicSupportedConfigs {
    watchEndpointMusicConfig: WatchEndpointMusicConfig;
}

export interface WatchEndpoint {
    videoId: string;
    watchEndpointMusicSupportedConfigs?: WatchEndpointMusicSupportedConfigs;
    playerParams?: string;
}

export interface BrowseEndpointContextMusicConfig {
    pageType: string;
}

export interface BrowseEndpointContextSupportedConfigs {
    browseEndpointContextMusicConfig: BrowseEndpointContextMusicConfig;
}

export interface BrowseEndpoint {
    browseId: string;
    browseEndpointContextSupportedConfigs?: BrowseEndpointContextSupportedConfigs;
}

export interface NavigationEndpoint {
    clickTrackingParams?: string;
    watchEndpoint?: WatchEndpoint;
    browseEndpoint?: BrowseEndpoint;
}

export interface TextRun {
    text: string;
    navigationEndpoint?: NavigationEndpoint;
}

export interface AccessibilityData {
    label: string;
}

export interface Accessibility {
    accessibilityData: AccessibilityData;
}

export interface MusicResponsiveListItemFlexColumnRenderer {
    text: {
        runs: TextRun[];
        accessibility?: Accessibility;
    };
    displayPriority: string;
}

export interface MusicThumbnailRenderer {
    thumbnail: {
        thumbnails: Thumbnail[];
    };
    thumbnailCrop: string;
    thumbnailScale: string;
    trackingParams: string;
}

export interface MusicResponsiveListItemRenderer {
    thumbnail: {
        musicThumbnailRenderer: MusicThumbnailRenderer;
    };
    flexColumns: {
        musicResponsiveListItemFlexColumnRenderer: MusicResponsiveListItemFlexColumnRenderer;
    }[];
}

export interface MusicShelfRenderer {
    contents: {
        musicResponsiveListItemRenderer?: MusicResponsiveListItemRenderer;
    }[];
    continuations?: {
        nextContinuationData?: {
            continuation: string;
            clickTrackingParams: string;
        };
    }[];
}

export interface SectionListRenderer {
    contents: {
        musicShelfRenderer?: MusicShelfRenderer;
    }[];
}

export interface TabRendererContent {
    sectionListRenderer?: SectionListRenderer;
}

export interface TabRenderer {
    content: TabRendererContent;
}

export interface Tab {
    tabRenderer: TabRenderer;
}

export interface TabbedSearchResultsRenderer {
    tabs: Tab[];
}

export interface SearchResultResponse {
    contents:{
      tabbedSearchResultsRenderer: TabbedSearchResultsRenderer;
    }
}
