import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function MiniHeader({ label }) {
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.labelText,
          { color: "black" }, 
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.viewAllText,
          { color: "#4b5563" }, 
        ]}
      >
        View all
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16, 
    marginVertical: 16, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 20, 
  },
  viewAllText: {
    fontSize: 16, 
    color: '#4b5563', 
  },
});
