import {Song} from "@/interface/song"
import {
    SearchResultResponse,
    MusicResponsiveListItemRenderer
} from "@/interface/searchResult"

export const extractSongData = (item: MusicResponsiveListItemRenderer): Song | null => {
    try {
        const thumbnail = item.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails[0]?.url || "";
        const flexColumns = item.flexColumns;

        if (!flexColumns || flexColumns.length < 2) return null;

        const titleRun = flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer.text?.runs?.[0];
        const title = titleRun?.text || "";

        const videoId = titleRun?.navigationEndpoint?.watchEndpoint?.videoId || "";

        const infoRuns = flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer.text?.runs || [];
        let artistName = "";
        let artistBrowserId = "";
        let albumName = "";
        let albumBrowseId = "";

        for (let i = 0; i < infoRuns.length; i++) {
            const run = infoRuns[i];
            
            if (run.text === " • ") continue;

            if (i === 0 && run.navigationEndpoint?.browseEndpoint) {
                artistName = run.text;
                artistBrowserId = run.navigationEndpoint.browseEndpoint.browseId;
            } else if (run.navigationEndpoint?.browseEndpoint) {
                albumName = run.text;
                albumBrowseId=run.navigationEndpoint.browseEndpoint.browseId
            }
        }

        return {
            thumbnail,
            videoId,
            artist: {
                browseId: artistBrowserId,
                name: artistName
            },
            album:{
               browseId:albumBrowseId,
               title:albumName
            },
            title
        };
    } catch (error) {
        console.error("Error extracting song data:", error);
        return null;
    }
};

export const getSongsFromSearchResult = (response: SearchResultResponse): Song[] => {
    const songs: Song[] = [];

    try {
        const tabs = response.contents.tabbedSearchResultsRenderer.tabs;
        if (!tabs || tabs.length === 0) return songs;

        const tab = tabs[0]?.tabRenderer?.content;
        if (!tab?.sectionListRenderer) return songs;

        const contents = tab.sectionListRenderer.contents;
        if (!contents) return songs;

        for (const section of contents) {
            if (section.musicShelfRenderer?.contents) {
                for (const content of section.musicShelfRenderer.contents) {
                    if (content.musicResponsiveListItemRenderer) {
                        const song = extractSongData(content.musicResponsiveListItemRenderer);
                        if (song) {
                            songs.push(song);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error getting songs from search result:", error);
    }

    return songs;
};
