import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native"

import {
 Checkbox,
 CheckboxIndicator,
 CheckboxIcon,
 CheckboxLabel,
 CheckboxGroup
} from "@/components/ui/checkbox"

import {Text} from "@/components/ui"

import { CheckIcon } from '@/components/ui/icon';
import { Song } from "@/interface/song";
import { usePlaylists } from "@/hooks/usePlaylists";



export default  function ModalPlaylist({ modalVisible, setModalVisible, values, setValues, content, handleSavePlaylist }:{
  modalVisible:boolean,
  setModalVisible:React.Dispatch<React.SetStateAction<boolean>>,    
  values:string[],
  setValues:React.Dispatch<React.SetStateAction<string[]>>,
  content:Song[],
  handleSavePlaylist:()=>void
}) {
    const {playlists}=usePlaylists()
    
  return (
    <Modal
           visible={modalVisible}
           transparent
           animationType="fade"
           onRequestClose={()=>setModalVisible(false)}
          >
      <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text className="text-center font-bold  text-2xl mb-12 text-white" >Agregar cancion a una lista de reproduccion</Text>
            <View>
              <CheckboxGroup
                value={values}
                onChange={(keys)=>{
                  setValues(keys)
                }}
              >
                <ScrollView  style={{height:300}}>
                  {playlists.map(item=>(
                    <Checkbox isDisabled={Boolean(content.find(song=>song.playlistId==item.id.toString()))} isChecked={Boolean(content.find(song=>song.playlistId==item.id.toString()))} className="mb-9" size="lg" key={item.id} value={item.id.toString()}>
                      <CheckboxIndicator>
                         <CheckboxIcon  as={CheckIcon}/>
                      </CheckboxIndicator>
                      <CheckboxLabel>{item.nombre}</CheckboxLabel>
                    </Checkbox>
                  ))}
                </ScrollView>
              </CheckboxGroup>
            </View>
            <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setModalVisible(false);
                    setValues([]);
                    
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleSavePlaylist}
                >
                  <Text style={styles.createButtonText}>Agregar</Text>
                </TouchableOpacity>
            </View>
          </View>
      </View>
    </Modal>
  )

}


const styles=StyleSheet.create({

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
     },
    modalTitle: {
       fontSize: 20,
       fontWeight: "bold",
       color: "#fff",
       marginBottom: 20,
     },
     modalContent: {
         width: "85%",
         backgroundColor: "#282828",
         borderRadius: 16,
         padding: 24,
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