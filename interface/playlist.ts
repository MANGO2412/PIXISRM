import type {Song} from "@/interface/song"

export interface PlayList{
   index:number;
   song:Song;
   params:string;
   playlistId:string;
}

export interface PlaylistArtist{
    thumbnail:string
    browseId:string
    title:string
    subtitle:string
}
