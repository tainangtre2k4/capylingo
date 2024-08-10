import {View, Text, StyleSheet, StatusBar as RNStatusBar} from 'react-native'
import React from 'react'
import BackButton from "@/components/BackButton";

const HeaderProgressTracker = ({ current, all }: { current: number, all: number }) => {
  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <BackButton />
      </View>
      <View style={styles.pillsContainer}>
        {[...Array(all)].map((_, index) => (
          <View
            key={index}
            style={index < current ? styles.pillActive : styles.pillInactive}
          />
        ))}
      </View>
    </View>
  )
}

export default HeaderProgressTracker

const styles = StyleSheet.create({
  container: {
    paddingTop: RNStatusBar.currentHeight,
    paddingHorizontal: 20,
    height: (RNStatusBar.currentHeight || 20) + 70,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  backButtonContainer: {
    position: 'absolute',
    top: (RNStatusBar.currentHeight || 20) + 14,
    left: 20,
    zIndex: 1,
  },
  pillsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  pillActive: {
    width: 34,
    height: 8,
    backgroundColor: '#3DB2FF',
    borderRadius: 6,
    marginHorizontal: 2
  },
  pillInactive: {
    width: 34,
    height: 8,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 2,
    borderRadius: 2,
  },
})