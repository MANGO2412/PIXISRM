import { 
View, 
StyleSheet, 
Text, 
TouchableOpacity, 
TextInput, 
Modal, 
FlatList, 
ActivityIndicator, 
Dimensions, 
Alert 
} from "react-native";

import { useRouter } from 'expo-router';

import FooterPlayer from "@/components/custome/FooterPlayer"


import { 
useState 
} from "react";

import { 
  usePlaylists 
} from "@/hooks/usePlaylists";

import { 
  Heart, 
  Plus, 
  Music 
} from "lucide-react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 48) / 2;

interface PlaylistItem {
  id: number;
  nombre: string;
  download:number;
}

export default function Playlist() {
  let navigation=useRouter()
  const { playlists, loading, createPlaylist } = usePlaylists();
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleCreatePlaylist = async () => {
    if (newPlaylistName.trim()) {
      const success = await createPlaylist(newPlaylistName.trim());
      if (success) {
        setModalVisible(false);
        setNewPlaylistName("");
      } else {
        Alert.alert("Error", "No se pudo crear la playlist");
      }
    }
  };

  const renderPlaylistItem = ({ item }: { item: PlaylistItem }) => {
    const isDefault = item.nombre === "Mi musica favorita";

    return (
      <TouchableOpacity onPress={()=>navigation.navigate(`/playlistcontent?playlist_id=${item.id}&&nombre=${item.nombre}&&download=${item.download}`)} style={styles.playlistCard}>
        {isDefault ? (
          <View style={styles.defaultPlaylistCover}>
            <Heart size={40} color="#fff" fill="#fff" />
          </View>
        ) : (
          <View style={styles.customPlaylistCover}>
            <Music size={40} color="#666" />
          </View>
        )}
        <Text style={styles.playlistName} numberOfLines={1}>
          {item.nombre}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6A1A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tus listas de reproducciones </Text>
      </View>

      <FlatList
        data={playlists}
        renderItem={renderPlaylistItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={28} color="#fff" />
      </TouchableOpacity>

      <FooterPlayer/>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Playlist</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la playlist"
              placeholderTextColor="#888"
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setNewPlaylistName("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreatePlaylist}
              >
                <Text style={styles.createButtonText}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  header: {
   paddingTop: 30,
   paddingHorizontal: 20,
   paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  playlistCard: {
    width: ITEM_WIDTH,
    alignItems: "center",
  },
  defaultPlaylistCover: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6A1A",
  },
  customPlaylistCover: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: 16,
    backgroundColor: "#282828",
    justifyContent: "center",
    alignItems: "center",
  },
  playlistName: {
    marginTop: 8,
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF6A1A",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#FF6A1A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#282828",
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: "#3E3E3E",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  createButton: {
    flex: 1,
    padding: 14,
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: "#FF6A1A",
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});