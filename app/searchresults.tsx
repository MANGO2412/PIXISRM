import { 
 View, 
 StyleSheet, 
 ScrollView, 
 FlatList, 
 Dimensions,
 ActivityIndicator,
 NativeScrollEvent
} from 'react-native';



import { GlobalContext } from "@/context/reduceContext";
import { useContext, useState, useRef, useCallback } from 'react';
import useSearchPage from '@/hooks/useSearchPage';
import SongItem from "@/components/custome/SongItem"
import ArtistItem from "@/components/custome/ArtistItem"
import AlbumItem from "@/components/custome/AlbumItem"
import FooterPlayer from '@/components/custome/FooterPlayer';




import { Host, FilterChip, Text, FlowRow } from '@expo/ui/jetpack-compose';
const { width } = Dimensions.get("window");

const GRID_PADDING = 20;
const GRID_GAP = 8;
const GRID_COLUMN_WIDTH = (width - GRID_PADDING * 2 - GRID_GAP) / 2;

const SONGS_FILTER = "EgWKAQIIAWoKEAkQBRAKEAMQBA%3D%3D";
const ALBUMS_FILTER = "EgWKAQIYAWoKEAkQChAFEAMQBA%3D%3D";
const ARTISTS_FILTER = "EgWKAQIgAWoKEAkQChAFEAMQBA%3D%3D";

const filters = [
    { name: "Canciones", filterKey: SONGS_FILTER },
    { name: "Álbumes", filterKey: ALBUMS_FILTER },
    { name: "Artistas", filterKey: ARTISTS_FILTER },
];

export default function SearchResults() {
  
    const { state } = useContext(GlobalContext)
    const [continuationToken, setContinuationToken] = useState<string | undefined>(undefined);
    const requestedTokenRef = useRef<string | undefined>(undefined);

    const [selected, setSelected] = useState(SONGS_FILTER);
    const { contents, loading, nextToken, loadingContinuation } = useSearchPage({ query: state.query || "", selectedFilterKey: selected, continuationToken })

    const isSongsFilter = selected === SONGS_FILTER;

    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}: NativeScrollEvent)=>{
        const paddingToBottom = 15;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    }

    const handleLoadMore = useCallback(() => {
        if (!nextToken || loadingContinuation) return;
        if (requestedTokenRef.current === nextToken) return;
        requestedTokenRef.current = nextToken;
        setContinuationToken(nextToken);
    }, [nextToken, loadingContinuation]);


    return (
        <View style={styles.container}>
            <Host matchContents>
                <FlowRow horizontalArrangement={{ spacedBy: 8 }}>
                    {filters.map((filter, index) => (
                        <FilterChip selected={selected === filter.filterKey} onClick={() => setSelected(filter.filterKey)} key={index}>
                            <FilterChip.Label>
                                <Text>{filter.name}</Text>
                            </FilterChip.Label>
                        </FilterChip>
                    ))}
                </FlowRow>
            </Host>

            {loading && contents.length === 0 ? (
             <View style={styles.loadingContainer}>
                 <ActivityIndicator size="large" color="#FF6A1A" />
             </View>
             ):(
              <>
              {isSongsFilter ? (
                 <ScrollView 
                    style={styles.scrollContent} 
                    showsVerticalScrollIndicator={false}
                      onScroll={({nativeEvent})=>{
                        if (isCloseToBottom(nativeEvent)) {
                            handleLoadMore();
                        }
                      }}
                >
                     {contents.map((item, index) => {
                         if (item.type === "song") {
                             return <SongItem key={index} style={{ marginBottom: 12 }} {...item.song} options />;
                         }
                         return null;
                     })}
                     {loadingContinuation && (
                           <View style={{position: "relative",backgroundColor: "#000", height: 80, bottom: 30, justifyContent: "center", alignItems: "center" }}>
                             <ActivityIndicator size="large" color="#FF6A1A" />
                         </View>
                     )}
                    
                 </ScrollView>
                ) : (
                 <FlatList
                     data={contents}
                     keyExtractor={(_, index) => index.toString()}
                     numColumns={2}
                     columnWrapperStyle={styles.gridRow}
                     style={styles.scrollContent}
                     showsVerticalScrollIndicator={false}
                      onEndReached={handleLoadMore}
                     onEndReachedThreshold={0.3}
                     renderItem={({ item }) => {
                         if (item.type === "playlist" ) {
                             const data = item.playlist;
                             const enhancedThumb = data?.thumbnail?.replace("w60-h60","w300-h300");
                             return (
                                 <View style={styles.gridCell}>
                                     <AlbumItem style={styles.gridAlbumItem} {...data} thumbnail={enhancedThumb || data?.thumbnail || ""} />
                                 </View>
                             );
                         }
                          if ( item.type === "album") {
                             const data = item.album ;
                             const enhancedThumb = data?.thumbnail?.replace("w60-h60","w300-h300");
                             return (
                                 <View style={styles.gridCell}>
                                     <AlbumItem style={styles.gridAlbumItem} {...data} thumbnail={enhancedThumb || data?.thumbnail || ""} />
                                 </View>
                             );
                         }
                         if (item.type === "artist") {
                             const enhancedThumb = item.artist.thumbnail.replace("w60-h60","w300-h300");
                             return (
                                 <View style={styles.gridCell}>
                                     <ArtistItem style={styles.gridArtistItem} {...item.artist} thumbnail={enhancedThumb} />
                                 </View>
                             );
                         }
                         return null;
                     }}
                    ListFooterComponent={loadingContinuation ? (
                        <View style={{position: "relative",backgroundColor: "#000", height: 80, bottom: 30, justifyContent: "center", alignItems: "center" }}>
                            <ActivityIndicator size="large" color="#FF6A1A" />
                        </View>
                     ) : null}
                 />
               )}
              </>
             )}
            <FooterPlayer notViewWithMenu />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingStart: 20,
        paddingEnd: 20,
        paddingTop: 10
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    scrollContent: {
        flex: 1,
        marginTop: 12,
        marginBottom: 50
    },
    gridRow: {
        gap: GRID_GAP,
        marginBottom: 16,
    },
    gridCell: {
        width: GRID_COLUMN_WIDTH,
       
    },
    gridAlbumItem: {
        width: GRID_COLUMN_WIDTH,
        justifyContent: "center",
        alignItems: "center",
    },
    gridArtistItem: {
        width: GRID_COLUMN_WIDTH,
        justifyContent: "center",
        alignItems: "center",
    },
});
