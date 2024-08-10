import { TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { useRouter } from 'expo-router'

const BackButton = () => {
  const router = useRouter()

  return (
    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
      <Ionicons name="chevron-back" size={24} color="#0693F1" />
    </TouchableOpacity>
)
}

export default BackButton

const styles = StyleSheet.create({
  backButton: {
    height: 42,
    width: 42,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4
  },
})