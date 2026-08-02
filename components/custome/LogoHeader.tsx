import {
  Image,
  View,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity
} from 'react-native';

import{
 useState
} from "react"

import {Text} from "@/components/ui"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import {usePlaylists} from "@/hooks/usePlaylists"
import {useRouter} from "expo-router"



export function RightActionHeader({canGoBack,tintColor}:{ tintColor?: string | undefined; canGoBack?: boolean | undefined; }){
  return (
      <View style={styles.container}>
        <Link href="/search" push asChild>
         <MaterialIcons size={30} name='search' color={tintColor} />
        </Link>
        {/* <Link href="/setting" push asChild>
        <MaterialIcons size={30} name='settings' color={tintColor} />
        </Link> */}
    </View>
  )
}

export function RightActionHeaderPlaylist({canGoBack,tintColor,playlist_id,name,onChangeName}:{ tintColor?: string | undefined; canGoBack?: boolean | undefined;playlist_id?:string,name:string,onChangeName:(newName:string)=>void }){
    let navigation=useRouter();
    const {deletePlaylist,updateName}=usePlaylists()
    const [modalVisible,setModalVisible]=useState<boolean>(false)
    const [newPlaylistName,setNewPlaylistName]=useState<string>(name)

    
    const handleDelete=async()=>{
        console.log(playlist_id)
        const success=await deletePlaylist(Number(playlist_id))
        if(success){
          navigation.back()
        }
    }

    const handleChangeName=async()=>{
      await updateName(newPlaylistName,Number(playlist_id))
      onChangeName(newPlaylistName)
      setModalVisible(false)
    }


    if(playlist_id == "1"){
      return null;
    }
    
     return(
      <>
        <View  style={styles.container}>
          <MaterialIcons  size={25} name='edit' onPress={()=>setModalVisible(true)} color={tintColor} />
          <MaterialIcons  size={25} name='delete' onPress={handleDelete} color={tintColor} />
        </View>
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}

        >
          <View style={styles.modalOverlay}>
             <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Editar Nombre</Text>
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
                    disabled={newPlaylistName.trim()==""}
                    style={styles.createButton}
                    onPress={handleChangeName}
                  >
                    <Text style={styles.createButtonText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
             </View>
          </View>
        </Modal>
      </>
     )
}

export default function LogoHeader({children,tintColor}:{children: string; tintColor?: string | undefined; }){
    return(
        <View style={styles.container}>
           <Image style={styles.image} source={require("@/assets/logo_without_background.png")} />
           <Text size='2xl' className='inline-block align-bottom tracking-wide' >PIXIS RM</Text>
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
      display:"flex",
      flexDirection:"row",
    },
    image:{
        width:42,
        height:38
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

})

