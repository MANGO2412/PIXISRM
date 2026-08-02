export interface CategoryRadioStation {
    title: string;
    data: RadioStation[];
}

export interface RadioStation {
    changeuuid: string;
    stationuuid: string;
    name: string;
    url: string;
    url_resolved: string;
    homepage: string;
    favicon: string;
    tags: string;
    country: string;
    countrycode: string;
    state: string;
    language: string;
    languagecodes: string;
    votes: number;
    codec: string;
    bitrate: number;
    hls: number;
    lastcheckok: number;
    clickcount: number;
    clicktrend: number;
}
