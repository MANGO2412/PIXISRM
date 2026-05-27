import {URL_API_YOUTUBE} from "@/constant/initialValue"
import {WEB_REMIX} from "@/constant/clientYoutube"
import Storage from 'expo-sqlite/kv-store';

import { useEffect, useState} from "react"
import type {SearchResultResponse} from "@/interface/searchResult"
import {type Song} from "@/interface/song"

import {getSongsFromSearchResult} from "@/utils/songExtractor"


export default function useSearchPage({query}:{query:string}){
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchSearchResults() {
            setLoading(true);
            try {
                const visitorData = await Storage.getItem('visitorData');
                WEB_REMIX.visitorData = visitorData || "";
                const response = await fetch(URL_API_YOUTUBE+"search?prettyPrint=false",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Goog-FieldMask":"contents.tabbedSearchResultsRenderer.tabs.tabRenderer.content.sectionListRenderer.contents.musicShelfRenderer(continuations,contents.musicResponsiveListItemRenderer(flexColumns,fixedColumns,thumbnail,navigationEndpoint))",
                        "X-Goog-Api-Key":"AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
                    },
                    body: JSON.stringify({
                        query: query,
                        context: {
                            client: WEB_REMIX
                        },
                        params:"EgWKAQIIAWoKEAkQBRAKEAMQBA%3D%3D"
                    }),
                });

                const data: SearchResultResponse = await response.json();
                setSongs(getSongsFromSearchResult(data));
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSearchResults();

    }, [query]);

    return { songs, loading };
}