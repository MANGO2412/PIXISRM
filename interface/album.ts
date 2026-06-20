import type {Song} from "@/interface/song"
import type {Artist} from "@/interface/artist"

export interface Album {
    browseId: string;
    title: string;
    type?: 'Album' | 'EP' | 'Single' | 'Compilation';
    year: string;
    thumbnail: string;
    artist?: Artist;
    duration?: string;
    songs?: Song[];
    description?: string;
    params?:string
    subtitle?:string
 
}



export interface YTAlbumResponse {
    contents: YTContents;
    background: {
        musicThumbnailRenderer: YTMusicThumbnailRenderer;
    };
    microformat: {
        microformatDataRenderer: YTMicroformatDataRenderer;
    };
}

export interface YTContents {
    twoColumnBrowseResultsRenderer: {
        secondaryContents: {
            sectionListRenderer: {
                contents: YTSectionContent[];
            };
        };
        tabs: YTTab[];
    };
}

export type YTSectionContent =
    | {musicPlaylistShelfRenderer:YTMusicShelfRenderer}
    | { musicShelfRenderer: YTMusicShelfRenderer }
    | { musicCarouselShelfRenderer: YTMusicCarouselShelfRenderer };

export interface YTTab {
    tabRenderer: {
        content: {
            sectionListRenderer: {
                contents: YTAlbumSectionContent[];
            };
        };
    };
}

export type YTAlbumSectionContent =
    | { musicResponsiveHeaderRenderer: YTMusicResponsiveHeaderRenderer }
    | { musicShelfRenderer: YTMusicShelfRenderer }
    | { musicCarouselShelfRenderer: YTMusicCarouselShelfRenderer };

export interface YTMusicResponsiveHeaderRenderer {
    thumbnail: {
        musicThumbnailRenderer: YTMusicThumbnailRenderer;
    };
    buttons: YTButton[];
    title: {
        runs: Array<{ text: string }>;
    };
    subtitle: {
        runs: Array<{ text: string }>;
    };
    straplineTextOne: {
        runs: Array<{ text: string; navigationEndpoint?: YTNavigationEndpoint }>;
    };
    straplineThumbnail: {
        musicThumbnailRenderer: YTMusicThumbnailRenderer;
    };
    description: {
        musicDescriptionShelfRenderer: YTMusicDescriptionShelfRenderer;
    };
    secondSubtitle: {
        runs: Array<{ text: string }>;
    };
}

export interface YTButton {
    toggleButtonRenderer?: YTToggleButtonRenderer;
    musicPlayButtonRenderer?: YTMusicPlayButtonRenderer;
    menuRenderer?: YTMenuRenderer;
}

export interface YTToggleButtonRenderer {
    isToggled: boolean;
    isDisabled: boolean;
    defaultIcon: { iconType: string };
    toggledIcon: { iconType: string };
    trackingParams: string;
    defaultNavigationEndpoint?: YTNavigationEndpoint;
    accessibilityData?: { accessibilityData: { label: string } };
    toggledAccessibilityData?: { accessibilityData: { label: string } };
}

export interface YTMusicPlayButtonRenderer {
    playNavigationEndpoint: {
        clickTrackingParams?: string;
        watchPlaylistEndpoint?: { playlistId: string,videoId:string };
        watchEndpoint?: { playlistId: string,videoId:string };
    };
    trackingParams: string;
    playIcon: { iconType: string };
    pauseIcon: { iconType: string };
    iconColor: number;
    backgroundColor: number;
    activeBackgroundColor: number;
    loadingIndicatorColor: number;
    playingIcon: { iconType: string };
    iconLoadingColor: number;
    activeScaleFactor: number;
    accessibilityPlayData?: { accessibilityData: { label: string } };
    accessibilityPauseData?: { accessibilityData: { label: string } };
}

export interface YTMenuRenderer {
    items: YTMenuItem[];
    trackingParams: string;
    accessibility: { accessibilityData: { label: string } };
}

export interface YTMenuItem {
    menuNavigationItemRenderer?: {
        text: { runs: Array<{ text: string }> };
        icon: { iconType: string };
        navigationEndpoint: YTNavigationEndpoint;
        trackingParams: string;
    };
    menuServiceItemRenderer?: {
        text: { runs: Array<{ text: string }> };
        icon: { iconType: string };
        serviceEndpoint: YTServiceEndpoint;
        trackingParams: string;
    };
    toggleMenuServiceItemRenderer?: {
        defaultText: { runs: Array<{ text: string }> };
        defaultIcon: { iconType: string };
        defaultServiceEndpoint: YTNavigationEndpoint;
        toggledText: { runs: Array<{ text: string }> };
        toggledIcon: { iconType: string };
        toggledServiceEndpoint: YTMusicToggleServiceEndpoint;
        trackingParams: string;
    };
}

export interface YTMusicToggleServiceEndpoint {
    feedbackEndpoint?: {
        feedbackToken: string;
    };
    likeEndpoint?: {
        status: string;
        target: { playlistId: string };
    };
    modalEndpoint?: {
        modal: {
            modalWithTitleAndButtonRenderer: {
                title: { runs: Array<{ text: string }> };
                content: { runs: Array<{ text: string }> };
                button: {
                    buttonRenderer: {
                        style: string;
                        isDisabled: boolean;
                        text: { runs: Array<{ text: string }> };
                        navigationEndpoint: YTNavigationEndpoint;
                        trackingParams: string;
                    };
                };
            };
        };
    };
}

export interface YTServiceEndpoint {
    clickTrackingParams?: string;
    queueAddEndpoint?: {
        queueTarget: {
            videoId?: string;
            playlistId?: string;
            onEmptyQueue?: {
                clickTrackingParams: string;
                watchEndpoint?: { videoId: string };
            };
        };
        queueInsertPosition: string;
        commands?: Array<{
            clickTrackingParams: string;
            addToToastAction: {
                item: {
                    notificationTextRenderer: {
                        successResponseText: { runs: Array<{ text: string }> };
                        trackingParams: string;
                    };
                };
            };
        }>;
    };
}

export interface YTMusicShelfRenderer {
    title?: {
        runs: Array<{ text: string }>;
    };
    contents: Array<{musicResponsiveListItemRenderer:YTMusicResponsiveListItemRenderer}>;
    trackingParams?: string;
    shelfDivider?: {
        musicShelfDividerRenderer: {
            hidden: boolean;
        };
    };
    contentsMultiSelectable?: boolean;
}

export interface YTMusicResponsiveListItemRenderer {
    thumbnail?:{
         musicThumbnailRenderer: YTMusicThumbnailRenderer;
    };
    trackingParams: string;
    overlay?: {
        musicItemThumbnailOverlayRenderer: {
            background: {
                verticalGradient: {
                    gradientLayerColors: string[];
                };
            };
            content: {
                musicPlayButtonRenderer: YTMusicPlayButtonRenderer;
            };
            contentPosition: string;
            displayStyle: string;
        };
    };
    flexColumns: Array<{
        musicResponsiveListItemFlexColumnRenderer: {
            text: {
                runs?: Array<{ text: string; navigationEndpoint?: YTNavigationEndpoint }>;
                accessibility?: { accessibilityData: { label: string } };
            };
            displayPriority: string;
        };
    }>;
    fixedColumns?: Array<{
        musicResponsiveListItemFixedColumnRenderer: {
            text: {
                runs: Array<{ text: string }>;
                accessibility?: { accessibilityData: { label: string } };
            };
            displayPriority: string;
            size: string;
        };
    }>;
    menu: {
        menuRenderer: YTMenuRenderer;
    };
    playlistItemData?: {
        playlistSetVideoId: string;
        videoId: string;
    };
    itemHeight: string;
    index?: {
        runs: Array<{ text: string }>;
    };
    multiSelectCheckbox?: {
        checkboxRenderer: {
            onSelectionChangeCommand: {
                clickTrackingParams: string;
                updateMultiSelectStateCommand: {
                    multiSelectParams: string;
                    multiSelectItem: string;
                };
            };
            checkedState: string;
            trackingParams: string;
        };
    };
}

export interface YTMusicCarouselShelfRenderer {
    header?: {
        musicCarouselShelfBasicHeaderRenderer: {
            title: {
                runs: Array<{ text: string }>;
            };
            accessibilityData?: { accessibilityData: { label: string } };
            headerStyle: string;
            trackingParams: string;
        };
    };
    contents: Array<{
        musicTwoRowItemRenderer: YTMusicTwoRowItemRenderer;
    }>;
    trackingParams: string;
    itemSize: string;
}

export interface YTMusicTwoRowItemRenderer {
    thumbnailRenderer: {
        musicThumbnailRenderer: YTMusicThumbnailRenderer;
    };
    aspectRatio: string;
    title: {
        runs: Array<{ text: string; navigationEndpoint?: YTNavigationEndpoint }>;
    };
    subtitle: {
        runs: Array<{ text: string; navigationEndpoint?: YTNavigationEndpoint }>;
    };
    navigationEndpoint: YTNavigationEndpoint;
    trackingParams: string;
    menu?: {
        menuRenderer: YTMenuRenderer;
    };
    thumbnailOverlay?: {
        musicItemThumbnailOverlayRenderer: {
            background: {
                verticalGradient: {
                    gradientLayerColors: string[];
                };
            };
            content: {
                musicPlayButtonRenderer: YTMusicPlayButtonRenderer;
            };
            contentPosition: string;
            displayStyle: string;
        };
    };
    subtitleBadges?: Array<{
        musicInlineBadgeRenderer: {
            trackingParams: string;
            icon: { iconType: string };
            accessibilityData: { accessibilityData: { label: string } };
        };
    }>;
}

export interface YTMusicThumbnailRenderer {
    thumbnail: {
        thumbnails: Array<{ url: string; width: number; height: number }>;
    };
    thumbnailCrop?: string;
    thumbnailScale?: string;
    trackingParams?: string;
}

export interface YTMusicDescriptionShelfRenderer {
    description: {
        runs: Array<{ text: string; navigationEndpoint?: YTNavigationEndpoint }>;
    };
    moreButton?: {
        toggleButtonRenderer: {
            isToggled: boolean;
            isDisabled: boolean;
            defaultIcon: { iconType: string };
            defaultText: { runs: Array<{ text: string }> };
            toggledIcon: { iconType: string };
            toggledText: { runs: Array<{ text: string }> };
            trackingParams: string;
        };
    };
    trackingParams: string;
    shelfStyle: string;
}

export interface YTNavigationEndpoint {
    clickTrackingParams?: string;
    watchEndpoint?: {
        videoId: string;
        playlistId?: string;
        index?: number;
        playerParams?: string;
        playlistSetVideoId?: string;
        loggingContext?: {
            vssLoggingContext: {
                serializedContextData: string;
            };
        };
        watchEndpointMusicSupportedConfigs?: {
            watchEndpointMusicConfig: {
                musicVideoType: string;
            };
        };
    };
    browseEndpoint?: {
        browseId: string;
        params?: string;
        browseEndpointContextSupportedConfigs?: {
            browseEndpointContextMusicConfig: {
                pageType: string;
            };
        };
    };
    watchPlaylistEndpoint?: {
        playlistId: string;
        params?: string;
    };
    urlEndpoint?: {
        url: string;
        target: string;
    };
    signInEndpoint?: {
        hack: boolean;
    };
    modalEndpoint?: {
        modal: {
            modalWithTitleAndButtonRenderer: {
                title: { runs: Array<{ text: string }> };
                content: { runs: Array<{ text: string }> };
                button: {
                    buttonRenderer: {
                        style: string;
                        isDisabled: boolean;
                        text: { runs: Array<{ text: string }> };
                        navigationEndpoint: YTNavigationEndpoint;
                        trackingParams: string;
                    };
                };
            };
        };
    };
}

export interface YTMicroformatDataRenderer {
    urlCanonical: string;
    title: string;
    description: string;
    thumbnail: {
        thumbnails: Array<{ url: string; width: number; height: number }>;
    };
    siteName: string;
    appName: string;
    androidPackage: string;
    iosAppStoreId: string;
    ogType: string;
    urlApplinksWeb: string;
    urlApplinksIos: string;
    urlApplinksAndroid: string;
    urlTwitterIos: string;
    urlTwitterAndroid: string;
    twitterCardType: string;
    twitterSiteHandle: string;
}