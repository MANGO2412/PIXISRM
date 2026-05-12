export interface SearchSuggestion {
    query: string;
}

export interface SearchSuggestionRenderer {
    navigationEndpoint: {
        searchEndpoint: SearchSuggestion;
    };
}

export interface SearchSuggestionsSectionRenderer {
    contents:{
        searchSuggestionRenderer:SearchSuggestionRenderer
    }[];
}

export interface SearchResponse {
    contents: {
        searchSuggestionsSectionRenderer?: SearchSuggestionsSectionRenderer;
    }[];
}
