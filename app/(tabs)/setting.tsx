
import { View, StyleSheet,Pressable,Text} from 'react-native';
// import { Text } from "@/components/ui";
import {useState} from 'react';




export default function Setting() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Aún esta en desarrollo, estará listo muy pronto</Text>  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FF6A1A',
  },
});