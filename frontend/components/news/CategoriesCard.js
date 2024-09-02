import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import colors from "@/constants/Colors";
export default function CategoriesCard({
  categories,
  activeCategory,
  handleChangeCategory,
}) {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        {categories.map((category, index) => {
          let isActive = category.title == activeCategory;
          let activeButtonStyle = isActive ? styles.activeButton : styles.inactiveButton;
          let activeTextStyle = isActive ? styles.activeText : styles.inactiveText;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleChangeCategory(category.title)}
              style={styles.touchableOpacity}
            >
              <View style={[styles.categoryButton, activeButtonStyle]}>
                <Text style={[styles.categoryText, activeTextStyle]}>
                  {category.title}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingRight: 20,
  },
  touchableOpacity: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryButton: {
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeButton: {
    backgroundColor: colors.primary.primary80,
  },
  inactiveButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  activeText: {
    color: 'white',
  },
  inactiveText: {
    color: '#4b5563',
  },
  categoryText: {
    fontSize: hp(1.6),
    textTransform: 'capitalize',
  },
});
