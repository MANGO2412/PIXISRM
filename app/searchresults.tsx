import { View,StyleSheet,ScrollView } from 'react-native';
import {GlobalContext} from "@/context/reduceContext";
import { useContext } from 'react';
import useSearchPage from '@/hooks/useSearchPage';
import SongItem from "@/components/custome/SongItem"
import FooterPlayer from '@/components/custome/FooterPlayer';

export default function SearchResults() {
     const {state}=useContext(GlobalContext)
     const {songs}=useSearchPage({query:state.query||""})

    return (
        <View style={styles.container}>
            <ScrollView>
                {songs.map((song,index)=>(
                    <SongItem  key={index} style={{marginBottom:12}} {...song} />
                ))}
            </ScrollView>
            <FooterPlayer notViewWithMenu/>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        paddingStart:20,
        paddingEnd:20,
        paddingTop:10
    }
})