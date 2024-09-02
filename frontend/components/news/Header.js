import { Text, TouchableOpacity, View, StyleSheet, Image, Dimensions } from "react-native";
import React from "react";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// Get screen dimensions
const { width } = Dimensions.get('window');

export default function Header({ backHandler,title }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity onPress={backHandler} style={styles.backButton}>
          <Image
            source={require('../../assets/images/Vector.png')}
            style={styles.backButtonImage}
          />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Search Button */}
        <TouchableOpacity
          onPress={() => router.push("/search")}
          style={styles.searchButton}
        >
          <MagnifyingGlassIcon size={25} strokeWidth={2} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#3DB2FF', 
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05, 
    backgroundColor: '#3DB2FF',
    marginTop:10,
  },
  backButton: {
    height: width * 0.1, // 10% of screen width for circular button size
    width: width * 0.1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  backButtonImage: {
    height: width * 0.05, // Adjusted based on screen width
    width: width * 0.03,
  },
  title: {
    fontSize: width * 0.085, // 5% of screen width for font size
    fontWeight: 'bold',
    color: 'white', // White text color for the title
    textAlign: 'center',
    flex: 1, // Center title with flex
  },
  searchButton: {
    height: width * 0.1, // 10% of screen width for circular button size
    width: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: (width * 0.1) / 2, // Half of height/width to make the button circular
    backgroundColor: 'white', // White background for the search button
  },
});
