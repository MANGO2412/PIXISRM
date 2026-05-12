import {View,FlatList,ScrollView} from "react-native"
import {SafeAreaView} from "react-native-safe-area-context"
import {Text} from '@/components/ui'

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

    return(
       <SafeAreaView>
        <ScrollView >
           <View >
             <View style={{marginTop:3}}>
                <HeaderText>
                    Selecciones rapidas
                </HeaderText>
                <FlatList
                  horizontal
                  data={relatedSongs}
                  renderItem={({item})=><RenderItem item={item}/>}
                />
            </View>

            <View style={{marginTop:23}}>
                <HeaderText>
                   Albumes relacionados
                </HeaderText>
                <FlatList
                  horizontal
                  data={relatedAlbums}
                  renderItem={({item})=><RenderAlbum item={item}/>}
                />
            </View>


              <View style={{marginTop:23,marginBottom:70}}>
                <HeaderText>
                   Artista similares
                </HeaderText>
               <FlatList
                 horizontal
                 data={relatedArtists}
                 renderItem={({item})=><RenderArtist item={item}/>}
               />              
            </View>
           </View>
        </ScrollView>
        <FooterPlayer/>
       </SafeAreaView>
        
    )
}


