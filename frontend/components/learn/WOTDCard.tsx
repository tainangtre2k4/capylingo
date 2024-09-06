import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const WOTDCard = ({ word }: { word: string }) => {
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.title}>Word of the day</Text>
        <View style={styles.wordContainer}>
          <View>
            <Text style={styles.label}>{word}</Text>
            <Text style={styles.text}>Time to review !</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Ionicons name='play' size={20} color='#0074CE' />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default WOTDCard

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#27AE60',
    width: 170,
    height: 100,
    padding: 12,
    borderRadius: 12
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  label: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 6
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: '400',
  },
  wordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }
})
