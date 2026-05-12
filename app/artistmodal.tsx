import {View, StyleSheet, ActivityIndicator} from "react-native"
import {useLocalSearchParams} from "expo-router"
import ArtistModal from "@/components/custome/ArtistModal"


import useArtistPage from "@/hooks/useArtistPage"
export default function ArtistPage() {
    const {browseId} = useLocalSearchParams()
    const {artist} = useArtistPage({ browseId: browseId as string });


    if (!artist) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#FF6A1A" />
            </View>
        )
    }

    return <ArtistModal artist={artist}  />
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",

    },
})