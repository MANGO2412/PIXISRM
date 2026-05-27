import {View,FlatList,ScrollView} from "react-native"
import {SafeAreaView} from "react-native-safe-area-context"
import {Text} from '@/components/ui'

import {Skeleton,SkeletonText} from "@/components/ui/skeleton"
import { HStack } from "@/components/ui/hstack"

import {ReactNode} from "react"
import useRelatedPage from "@/hooks/useRelatedPage"

import type {Artist} from "@/interface/artist"
import type {Album} from "@/interface/album"
import type {Song} from "@/interface/song"


import SongItem from "@/components/custome/SongItem"
import AlbumItem from "@/components/custome/AlbumItem"
import ArtistItem from "@/components/custome/ArtistItem"
import FooterPlayer from "@/components/custome/FooterPlayer"




export default function index(){
    const {relatedAlbums,relatedSongs,relatedArtists}=useRelatedPage({videoid:"K1FlAphL2p8"})


    const RenderItem=({item}:{item:Song[]})=>{
        return(
            <View style={{paddingLeft:23}}>
                {item.map((song,index)=>(
                    <SongItem  key={index} style={{marginBottom:12}} {...song} options />
                ))}
            </View>
        )
    }

    const RenderAlbum=({item}:{item:Album})=>(<AlbumItem style={{marginStart:5,marginEnd:5}} {...item}/>)

    const RenderArtist=({item}:{item:Artist})=>(<ArtistItem style={{marginStart:5,marginEnd:5}} {...item}/>)

    const HeaderText=({children}:{children:ReactNode})=><Text size="2xl" className="mb-4 color-typography-950">{children}</Text>


    const SkeletonSong=()=>(
        <HStack className="gap-1 align-bottom mt-2">
            <Skeleton variant="rounded" className="h-[60px] w-[60px] mr-2"/>  
            <View style={{display:"flex",justifyContent:"center",gap:7}}>
                 <Skeleton variant="sharp" className="h-4 w-[200px]"/>
                 <Skeleton variant="sharp" className="h-4 w-[200px]"/>
            </View>  
            
        </HStack>
    )

    const SkeletonAlbum=()=>(
        <View style={{padding:3}}>
            <Skeleton variant="rounded" className="h-[120px] w-[120px] mb-3" />
            <SkeletonText _lines={2} className="h-2 w-16"/>
        </View>
    )

    const SkeletonArtist=()=>(
        <View style={{padding:3}}>
            <Skeleton variant="circular" className="h-[118px] w-[118px] mb-3" />
            <SkeletonText _lines={1} className="h-3 w-28"/>
        </View>
    )

    return(
       <SafeAreaView>
        <ScrollView >
           <View >
             <View style={{marginTop:3}}>
                <HeaderText>
                    Selecciones rapidas
                </HeaderText>
                {relatedSongs && relatedSongs?.length > 0 ?(
                    <FlatList
                  horizontal
                  data={relatedSongs}
                  renderItem={({item})=><RenderItem item={item}/>}
                />

                ):(
                 <View>{
                    Array.from({length:4}).map((item,index)=>(
                    <SkeletonSong key={index}/>
                  ))
                 }</View>
                )}
                  
            </View>

            <View style={{marginTop:23}}>
                <HeaderText>
                   Albumes relacionados
                </HeaderText>
               {relatedAlbums && relatedAlbums.length > 0?(
                 <FlatList
                  horizontal
                  data={relatedAlbums}
                  renderItem={({item})=><RenderAlbum item={item}/>}
                />
               ):(
                <HStack className="gap-1 align-bottom ">
                    {
                      Array.from({length:4}).map((_,index)=>(
                        <SkeletonAlbum key={index}/>
                      ))
                    }
                </HStack>
               )}
            </View>


              <View style={{marginTop:23,marginBottom:70}}>
                <HeaderText>
                   Artista similares
                </HeaderText>
                {relatedArtists && relatedArtists.length > 0?(
                  <FlatList
                   horizontal
                   data={relatedArtists}
                   renderItem={({item})=><RenderArtist item={item}/>}
                 />   
                ):(
                
                  <HStack className="gap-1 align-bottom ">
                      {
                        Array.from({length:4}).map((_,index)=>(
                          <SkeletonArtist key={index}/>
                        ))
                      }
                  </HStack>
                )}           
            </View>
           </View>
        </ScrollView>
        <FooterPlayer/>
       </SafeAreaView>
        
    )
}


