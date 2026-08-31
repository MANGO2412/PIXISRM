import { useState,  useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import type {Song} from "@/interface/song"
import {downloadSong} from "@/utils/fetchStramData"




export interface Playlist {
  id: number;
  nombre: string;
  download:number;
}

interface SongPlaylist{
   id?:string;
   videoId:string;
   artist:string;
   title:string;
   album:string;
   thumbnail:string;

}

const formatSongToSongPlaylist=(song:Song):SongPlaylist=>{
   return {
     ...song,
     album:JSON.stringify(song.album),
     artist:JSON.stringify(song.artist)
   }
}


export function usePlaylists() {
  const db=useSQLiteContext()
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);


  const fetchPlaylists = useCallback(async () => {
    try {
      const result = await db.getAllAsync<Playlist>(
        "SELECT * FROM playlists ORDER BY id"
      );
      setPlaylists(result);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPlaylists();
    }, [fetchPlaylists])
  );

  const createPlaylist = useCallback(async (name: string) => {
    try {
      await db.runAsync(
        "INSERT INTO playlists (nombre,download) VALUES (?, ?)",
        name,
        0
      );
      await fetchPlaylists();
      return true;
    } catch (error) {
      console.error("Error creating playlist:", error);
      return false;
    }
  }, [fetchPlaylists]);

  const deletePlaylist = useCallback(async (id: number) => {
    try {
      await db.runAsync("DELETE FROM playlists WHERE id = ?", id);
      await db.runAsync("DELETE FROM songs WHERE  playlist_id = ?", id);
      await fetchPlaylists();
      return true;
    } catch (error) {
      console.error("Error deleting playlist:", error);
      return false;
    }
  }, [fetchPlaylists]);

  const updateName=useCallback(async(newName:string,id:number,download:number)=>{
    try {
      await db.runAsync(
        "UPDATE playlists set nombre=? , set downlaod= ? WHERE  id =?",
         newName,
         download,
         id
      );
      await fetchPlaylists();
      return true;
    } catch (error) {
      console.error("Error creating playlist:", error);
      return false;
    }
  },[fetchPlaylists])

  const addSongtoPlaylist=useCallback(async(song:Song,playlistid:string[])=>{
     try {
      console.log("se esta ejecuntado")
      if(song.url){
        console.log("descargando")
        await downloadSong(song.url);
      }

       const data=formatSongToSongPlaylist(song);
       for (const element of  playlistid) {
         await db.runAsync("INSERT INTO songs (videoId,artist,title,album,thumbnail,playlist_id) VALUES (?,?,?,?,?,?)",data.videoId,data.artist,data.title,data.album,data.thumbnail,element)
       }

       console.log("finaliza")
       return true;
     } catch (error) {
      console.error("Error  adding song playlist",error)
      return false;
     }
  },[])


  return {
    playlists,
    loading,
    updateName,
    createPlaylist,
    deletePlaylist,
    addSongtoPlaylist,
    refresh: fetchPlaylists,
  };
}


