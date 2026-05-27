export interface ClientYoutube{
    clientName:string,
    clientVersion:string,
    clientId:string,
    userAgent:string,
    osVersion?:string,
    platform?:string
    visitorData?:string,
    localized:boolean
}


export const WEB_REMIX:ClientYoutube={
        clientName:"WEB_REMIX",
        clientVersion:"1.20250922.03.00",
        clientId:"67",
        platform:"DESKTOP",
        userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
        localized:true
}


export const ANDROID_VR:ClientYoutube={
     clientName:"ANDROID_VR",
     clientVersion : "1.65.10",
     clientId : "28",
     userAgent:"com.google.android.apps.youtube.vr.oculus/1.65.10 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip",
     osVersion:"12L",
     localized:true
}

export const  TVHTML5_SIMPLY_EMBEDDED_PLAYER:ClientYoutube={
    clientName : "TVHTML5_SIMPLY_EMBEDDED_PLAYER",
    clientVersion : "2.0",
    clientId : "85",
    platform : "TV",
    userAgent : "Mozilla/5.0 (PlayStation; PlayStation 4/12.02) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
    localized:true
}