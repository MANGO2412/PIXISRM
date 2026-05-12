export interface LyricsResponse{
  contents:{
    sectionListRenderer:{
        contents:Array<{
            musicDescriptionShelfRenderer:{
                description:{
                    runs:Array<{ text: string }>
                }
            }
        }>
    }
  }
}

export interface Lyrics{
    text:string
}