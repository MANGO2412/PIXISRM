import { useState,  useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import type {Song} from "@/interface/song"

interface SongPlaylist{
   id?:string;
   videoId:string;
   artist:string;
   title:string;
   album:string;
   thumbnail:string;
   playlist_id:number

}

const formatSongPlaylistToSong=(song:SongPlaylist):Song=>{
   return {
     ...song,
     album:JSON.parse(song.album),
     artist:JSON.parse(song.artist),
     playlistId:song.playlist_id.toString()
   }
}


export function usePlaylistContent({playlist_id,videoid}:{playlist_id?:string,videoid?:string}) {
  const db=useSQLiteContext()
  const [content, setContent] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContentPlaylist = useCallback(async () => {
    try {
      const  result =playlist_id ?  await db.getAllAsync<SongPlaylist>("SELECT * FROM songs where playlist_id=?",playlist_id)
                                 :videoid? await db.getAllAsync<SongPlaylist>("SELECT * FROM songs where videoId=?",videoid)
                                         :[];

      const data=result.map(item=>formatSongPlaylistToSong(item))

      setContent(data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchContentPlaylist();
    }, [fetchContentPlaylist])
  );

  const deleteSong = useCallback(async (videoId: string,playlist_id:number) => {
    try {
      await db.runAsync("DELETE FROM songs WHERE videoId = ? and playlist_id = ?", videoId,playlist_id);
      await fetchContentPlaylist();
      return true;
    } catch (error) {
      console.error("Error deleting playlist:", error);
      return false;
    }
  }, [fetchContentPlaylist]);

//   const createPlaylist = useCallback(async (name: string) => {
//     try {
//       await db.runAsync(
//         "INSERT INTO playlists (nombre) VALUES (?)",
//         name
//       );
//       await fetchPlaylists();
//       return true;
//     } catch (error) {
//       console.error("Error creating playlist:", error);
//       return false;
//     }
//   }, [fetchPlaylists]);



//   const addSongtoPlaylist=useCallback(async(song:Song,playlistid:string[])=>{
//      try {
//        const data=formatSongToSongPlaylist(song);

//        for (const element of  playlistid) {
//          await db.runAsync("INSERT INTO songs (videoId,artist,title,album,thumbnail,playlist_id) VALUES (?,?,?,?,?,?)",data.videoId,data.artist,data.title,data.album,data.thumbnail,element)
//        }

//        return true;
//      } catch (error) {
//       console.error("Error  adding song playlist")
//       return false;
//      }
//   },[])


  return {
    content,
    loading,
    deleteSong,
    refresh: fetchContentPlaylist,
  };
}
