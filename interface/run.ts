import {BrowseEndpoint,WatchEndpoint} from '@/interface/endpoint'

export interface Run{
    text:string;
    navigationEndpoint:{
        browseEndpoint?:BrowseEndpoint;
        watchEndpoint?:WatchEndpoint;
    }
}