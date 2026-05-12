import type {Album} from "@/interface/album"
import type {Artist} from "@/interface/artist"

export interface Song{
    thumbnail:string;
    videoId:string;
    artist:Omit<Artist,"thumbnail">;
    title:string;
    duration?:string;
    playlistId?:string;
    album?:Omit<Album,"artist"|"year"|"thumbnail">
    index?:number,
    isThisSongWithPlaylist?:boolean,
    url?:string
}