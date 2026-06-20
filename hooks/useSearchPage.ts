import {URL_API_YOUTUBE} from "@/constant/initialValue"
import {WEB_REMIX} from "@/constant/clientYoutube"
import Storage from 'expo-sqlite/kv-store';

import { useEffect, useState, useRef} from "react"
import type {SearchResultResponse, ContinuationResponse} from "@/interface/searchResult"

import {getContentsFromSearchResult, SearchContent,extractTokenFromSearchResult, getContentsFromContinuation, getContinuationTokenFromContinuation} from "@/utils/songExtractor"


export default function useSearchPage({query,selectedFilterKey,continuationToken}:{query:string,selectedFilterKey:string,continuationToken?:string}) {
    const [contents, setContents] = useState<SearchContent[]>([]);
    const [nextToken, setNextToken] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingContinuation, setLoadingContinuation] = useState<boolean>(false);
    const processedTokenRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        setContents([]);
        setNextToken(undefined);
        processedTokenRef.current = undefined;

        async function fetchSearchResults() {
            setLoading(true);
            try {
                const visitorData = await Storage.getItem('visitorData');
                WEB_REMIX.visitorData = visitorData || "";
                const response = await fetch(URL_API_YOUTUBE+"search?prettyPrint=false",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Goog-FieldMask":"contents.tabbedSearchResultsRenderer.tabs.tabRenderer.content.sectionListRenderer.contents.musicShelfRenderer(continuations,contents.musicResponsiveListItemRenderer(flexColumns,thumbnail,navigationEndpoint))",
                        "X-Goog-Api-Key":"AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
                    },
                    body: JSON.stringify({
                        query: query,
                        context: {
                            client: WEB_REMIX
                        },
                        params:selectedFilterKey
                    }),
                });

                const data: SearchResultResponse = await response.json();
                console.log("result: ",data)
                setContents(getContentsFromSearchResult(data));
                setNextToken(extractTokenFromSearchResult(data));
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSearchResults();

    }, [query, selectedFilterKey]);

    useEffect(() => {
        if (!continuationToken || continuationToken === processedTokenRef.current) return;
        processedTokenRef.current = continuationToken;

        async function fetchContinuation() {
            setLoadingContinuation(true);
            try {
                const visitorData = await Storage.getItem('visitorData');
                WEB_REMIX.visitorData = visitorData || "";
                const response = await fetch(URL_API_YOUTUBE+"search?prettyPrint=false",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Goog-FieldMask":"continuationContents.musicShelfContinuation(continuations,contents.musicResponsiveListItemRenderer(flexColumns,thumbnail,navigationEndpoint))",
                        "X-Goog-Api-Key":"AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
                    },
                    body: JSON.stringify({
                        context: {
                            client: WEB_REMIX
                        },
                        continuation: continuationToken,
                    }),
                });

                const data: ContinuationResponse = await response.json();
                const newContents = getContentsFromContinuation(data);
                const newContinuationToken = getContinuationTokenFromContinuation(data);

                setContents(prev => [...prev, ...newContents]);
                setNextToken(newContinuationToken);
            } catch (error) {
                console.error("Error fetching continuation:", error);
            } finally {
                setLoadingContinuation(false);
            }
        }
        fetchContinuation();

    }, [continuationToken]);

    return { contents, loading, nextToken, loadingContinuation };
}
