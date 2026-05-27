import {  type SQLiteDatabase } from 'expo-sqlite';
import Storage from 'expo-sqlite/kv-store';



export const getSWjsData=async ()=>{
   try {
     console.log("se ejecuto el  gewSWJSDATA")
     const existVisitorData=await Storage.getItem("visitorData")

     if(!existVisitorData){
        const respo=await fetch("https://music.youtube.com/sw.js_data")
        const buffer=await respo.text()
        const jsonResponse=JSON.parse(buffer.substring(5))
        const text=jsonResponse[0][2]?.filter((elem:string)=>typeof elem != "object" && elem != null && elem?.match("^Cg[t|s]"))
        console.log("Esto son los datos",text[0])
        await Storage.setItem('visitorData',text[0]);
     }
   } catch (error) {
     console.log(`Error fetching swj Data ${error}`)
   }
}


export default async function  migrateDbIfNeeded(db: SQLiteDatabase){
     const DATABASE_VERSION = 1;

     console.log("hello from migrate DB function")
     await getSWjsData()
   
    let currentDbVersion = (await db.getFirstAsync<{ user_version: number }>(
      'PRAGMA user_version'
    ))!.user_version;

    console.log("current version",currentDbVersion)

   if (currentDbVersion >= DATABASE_VERSION) {
     return;
   }

   if(currentDbVersion === 0){
     await db.execAsync(`
       CREATE TABLE IF NOT EXISTS  playlists(
         id INTEGER PRIMARY KEY NOT NULL,
         nombre  TEXT NOT NULL
       );

       CREATE TABLE IF NOT EXISTS  songs(
         id INTEGER PRIMARY KEY NOT NULL,
         videoId TEXT,
         artist TEXT,
         title TEXT,
         album TEXT,
         thumbnail TEXT,
         playlist_id INTEGER,
         FOREIGN KEY (playlist_id) REFERENCES playlists(id)  ON DELETE CASCADE
       );
    `)

    await db.runAsync('INSERT INTO playlists (nombre) VALUES (?)', 'Mi musica favorita');
    currentDbVersion = 1;
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
   }

}