import {Song} from "@/interface/song"
import {Album} from "@/interface/album"
import {Artist} from "@/interface/artist"
import {
    SearchResultResponse,
    MusicResponsiveListItemRenderer,
    ContinuationResponse
} from "@/interface/searchResult"

export type SearchContent = { type: "song"; song: Song }
    | { type: "album"; album: Album }
    | { type: "artist"; artist: Artist }
    | { type: "playlist"; playlist: Album };

const getThumbnail = (item: MusicResponsiveListItemRenderer) =>
    item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails[0]?.url || "";

const getPageType = (item: MusicResponsiveListItemRenderer): string | undefined =>
    item.navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs
        ?.browseEndpointContextMusicConfig?.pageType;

export const extractSongData = (item: MusicResponsiveListItemRenderer): Song | null => {
    try {
        const thumbnail = getThumbnail(item);
        const flexColumns = item.flexColumns;

        if (!flexColumns || flexColumns.length < 2) return null;

        const titleRun = flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer.text?.runs?.[0];
        const title = titleRun?.text || "";
        const videoId = titleRun?.navigationEndpoint?.watchEndpoint?.videoId || "";

        const infoRuns = flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer.text?.runs || [];
        let artist:Omit<Artist , "thumbnail">[]=[]
        let albumName = "";
        let albumBrowseId = "";

        for (let i = 0; i < infoRuns.length; i++) {
            const run = infoRuns[i];
            if (run.text === " • " || run.text === ", " || run.text === " & ") continue;

            if(
                run.navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig.pageType==="MUSIC_PAGE_TYPE_ARTIST" 
            
            ) {
                artist.push({
                    name:run.text,
                    browseId:run.navigationEndpoint.browseEndpoint.browseId
                })
            } else if (run.navigationEndpoint?.browseEndpoint) {
                albumName = run.text;
                albumBrowseId = run.navigationEndpoint.browseEndpoint.browseId;
            }
        }

        return {
            thumbnail,
            videoId,
            artist:artist,
            album: {
                browseId: albumBrowseId,
                title: albumName
            },
            title
        };
    } catch (error) {
        console.error("Error extracting song data:", error);
        return null;
    }
};

export const extractAlbumData = (item: MusicResponsiveListItemRenderer): Album | null => {
    try {
        const thumbnail = getThumbnail(item);
        const flexColumns = item.flexColumns;
        if (!flexColumns || flexColumns.length < 2) return null;

        const title = flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer.text?.runs?.[0]?.text || "";
        const browseId = item.navigationEndpoint?.browseEndpoint?.browseId || "";

        const infoRuns = flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer.text?.runs || [];

        const typeText = infoRuns[0]?.text || "Album";
        const albumType: Album["type"] = typeText === "EP" ? "EP" : typeText === "Single" ? "Single" : "Album";

        let artistName = "";
        let artistBrowseId = "";
        let year = "";

        for (const run of infoRuns) {
            if (run.text === " • ") continue;
            if (run.navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs
                ?.browseEndpointContextMusicConfig?.pageType === "MUSIC_PAGE_TYPE_ARTIST") {
                artistName = run.text;
                artistBrowseId = run.navigationEndpoint.browseEndpoint.browseId;
            } else if (/^\d{4}$/.test(run.text)) {
                year = run.text;
            }
        }

        return { browseId, title, thumbnail, year, type: albumType, artist: { browseId: artistBrowseId, name: artistName, thumbnail: "" } };
    } catch {
        return null;
    }
};

export const extractArtistData = (item: MusicResponsiveListItemRenderer): Artist | null => {
    try {
        const thumbnail = getThumbnail(item);
        const flexColumns = item.flexColumns;
        if (!flexColumns || flexColumns.length < 2) return null;

        const name = flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer.text?.runs?.[0]?.text || "";
        const browseId = item.navigationEndpoint?.browseEndpoint?.browseId || "";

        const infoRuns = flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer.text?.runs || [];
        let subscribers = "";

        for (const run of infoRuns) {
            if (run.text === " • ") continue;
            if (run.text !== "Artist" && !run.navigationEndpoint) {
                subscribers = run.text;
            }
        }

        return { browseId, name, thumbnail, subscribers };
    } catch {
        return null;
    }
};

export const extractPlaylistData = (item: MusicResponsiveListItemRenderer): Album | null => {
    try {
        const thumbnail = getThumbnail(item);
        const flexColumns = item.flexColumns;
        if (!flexColumns || flexColumns.length < 2) return null;

        const title = flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer.text?.runs?.[0]?.text || "";
        const browseId = item.navigationEndpoint?.browseEndpoint?.browseId || "";

        const infoRuns = flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer.text?.runs || [];
        const creatorName = infoRuns[0]?.text || "";
        const creatorBrowseId = infoRuns[0]?.navigationEndpoint?.browseEndpoint?.browseId || "";

        let count = "";
        for (const run of infoRuns) {
            if (run.text === " • ") continue;
            if (!run.navigationEndpoint && run.text !== creatorName) {
                count = run.text;
            }
        }

        return { browseId, title, thumbnail, year: count, artist: { browseId: creatorBrowseId, name: creatorName, thumbnail: "" } };
    } catch {
        return null;
    }
};

export const extractSearchContent = (item: MusicResponsiveListItemRenderer): SearchContent | null => {
    try {
        const pageType = getPageType(item);
        const hasWatchEndpoint = item.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer.text?.runs?.[0]
            ?.navigationEndpoint?.watchEndpoint != null;

        if (hasWatchEndpoint || (!pageType && !item.navigationEndpoint)) {
            const song = extractSongData(item);
            return song ? { type: "song", song } : null;
        }

        if (pageType === "MUSIC_PAGE_TYPE_ALBUM") {
            const album = extractAlbumData(item);
            return album ? { type: "album", album } : null;
        }

        if (pageType === "MUSIC_PAGE_TYPE_ARTIST") {
            const artist = extractArtistData(item);
            return artist ? { type: "artist", artist } : null;
        }

        if (pageType === "MUSIC_PAGE_TYPE_PLAYLIST") {
            const playlist = extractPlaylistData(item);
            return playlist ? { type: "playlist", playlist } : null;
        }

        const song = extractSongData(item);
        return song ? { type: "song", song } : null;
    } catch {
        return null;
    }
};

export const extractTokenFromSearchResult = (response: SearchResultResponse): string | undefined => {

      return response.
                     contents.
                     tabbedSearchResultsRenderer.
                     tabs[0]?.tabRenderer?.
                     content?.
                     sectionListRenderer?.
                     contents[0]?.
                     musicShelfRenderer?.
                     continuations?.[0]?.
                     nextContinuationData?.
                     continuation;
} 


export const getContentsFromSearchResult = (response: SearchResultResponse): SearchContent[] => {
    const contents: SearchContent[] = [];

    try {
        const tabs = response.contents.tabbedSearchResultsRenderer.tabs;
        if (!tabs || tabs.length === 0) return contents;

        const tab = tabs[0]?.tabRenderer?.content;
        if (!tab?.sectionListRenderer) return contents;

        const sections = tab.sectionListRenderer.contents;
        if (!sections) return contents;

        for (const section of sections) {
            if (section.musicShelfRenderer?.contents) {
                for (const content of section.musicShelfRenderer.contents) {
                    if (content.musicResponsiveListItemRenderer) {
                        const item = extractSearchContent(content.musicResponsiveListItemRenderer);
                        if (item) contents.push(item);
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error getting contents from search result:", error);
    }

    return contents;
};

export const getContentsFromContinuation = (response: ContinuationResponse): SearchContent[] => {
    try {
        const shelfContents = response.continuationContents.musicShelfContinuation?.contents;
        if (!shelfContents) return [];
        return shelfContents
            .map(c => c.musicResponsiveListItemRenderer ? extractSearchContent(c.musicResponsiveListItemRenderer) : null)
            .filter((c): c is SearchContent => c !== null);
    } catch {
        return [];
    }
};

export const getContinuationTokenFromContinuation = (response: ContinuationResponse): string | undefined => {
    return response.continuationContents.musicShelfContinuation?.continuations?.[0]?.nextContinuationData?.continuation;
};

export const getSongsFromSearchResult = (response: SearchResultResponse): Song[] => {
    return response.contents.tabbedSearchResultsRenderer.tabs[0]?.tabRenderer?.content?.sectionListRenderer?.contents
        ?.flatMap(section =>
            section.musicShelfRenderer?.contents?.map(({ musicResponsiveListItemRenderer: item }) =>
                item ? extractSongData(item) : null
            ) ?? []
        )
        .filter((s): s is Song => s !== null) ?? [];
};

