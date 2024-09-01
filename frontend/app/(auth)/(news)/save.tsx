import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet,Dimensions } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { BookmarkSquareIcon } from "react-native-heroicons/solid";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
const { width } = Dimensions.get('window');

export default function SavedScreen() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [bookmarkStatus, setBookmarkStatus] = useState<boolean[]>([]);
  const [urlList, setUrlList] = useState<string[]>([]);

  // Function to handle click on an item
  const handleClick = (item: any) => {
    router.push({ pathname: "/details", params: { ...item } });
  };

  // Effect to update URL list whenever saved articles change
  useEffect(() => {
    const urls = savedArticles.map((item) => item.url);
    setUrlList(urls);
  }, [savedArticles]);

  // Function to format the date
  function formatDate(isoDate: string) {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, options);
  }

  // Function to toggle bookmark status and save/remove article from AsyncStorage
  const toggleBookmarkAndSave = async (item: any, index: number) => {
    try {
      const savedArticles = await AsyncStorage.getItem("savedArticles");
      let savedArticlesArray = savedArticles ? JSON.parse(savedArticles) : [];

      const isArticleBookmarked = savedArticlesArray.some(
        (savedArticle: any) => savedArticle.url === item.url
      );

      if (!isArticleBookmarked) {
        savedArticlesArray.push(item);
        await AsyncStorage.setItem("savedArticles", JSON.stringify(savedArticlesArray));
        const updatedStatus = [...bookmarkStatus];
        updatedStatus[index] = true;
        setBookmarkStatus(updatedStatus);
      } else {
        const updatedSavedArticlesArray = savedArticlesArray.filter(
          (savedArticle: any) => savedArticle.url !== item.url
        );
        await AsyncStorage.setItem("savedArticles", JSON.stringify(updatedSavedArticlesArray));
        const updatedStatus = [...bookmarkStatus];
        updatedStatus[index] = false;
        setBookmarkStatus(updatedStatus);
      }
    } catch (error) {
      console.log("Error Saving/Removing Article", error);
    }
  };

  // Load saved articles from AsyncStorage when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      const loadSavedArticles = async () => {
        try {
          const savedArticles = await AsyncStorage.getItem("savedArticles");
          const savedArticlesArray = savedArticles ? JSON.parse(savedArticles) : [];
          setSavedArticles(savedArticlesArray);
        } catch (error) {
          console.log("Error loading saved articles", error);
        }
      };

      loadSavedArticles();
    }, [urlList])
  );

  // Function to clear all saved articles
  const clearSavedArticles = async () => {
    try {
      await AsyncStorage.removeItem("savedArticles");
      setSavedArticles([]);
      console.log("Clear all saved articles");
    } catch (error) {
      console.log("Error clearing saved articles", error);
    }
  };

  // Render each saved article item
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity style={styles.articleContainer} key={index} onPress={() => handleClick(item)}>
        <View style={styles.articleInnerContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: item.urlToImage || "https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmV3c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
              }}
              style={styles.articleImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.articleContent}>
            <Text style={[styles.authorText, colorScheme === "dark" && styles.darkText]}>
              {item.author}
            </Text>

            <Text style={[styles.titleText, colorScheme === "dark" && styles.darkText]}>
              {item.title.length > 50 ? item.title.slice(0, 50) + "..." : item.title}
            </Text>

            <Text style={[styles.dateText, colorScheme === "dark" && styles.darkDateText]}>
              {formatDate(item.publishedAt)}
            </Text>
          </View>

          <View style={styles.bookmarkContainer}>
            <TouchableOpacity onPress={() => toggleBookmarkAndSave(item, index)}>
              <BookmarkSquareIcon color="green" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Saved',
          headerStyle: { backgroundColor: '#3DB2FF', },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: width * 0.075,
          },
          headerShown: true,
        }}
      />
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { color: colorScheme === "dark" ? "white" : "black" }]}>
          Saved Articles
        </Text>
        <TouchableOpacity onPress={clearSavedArticles} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* List of saved articles */}
      <View style={styles.articlesListContainer}>
        {savedArticles.length === 0 ? (
          <Text style={styles.noArticlesText}>No saved articles</Text> // Show message if no articles
        ) : (
          <FlatList
            data={savedArticles}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()} // Use index as key if titles are not unique
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 24,
  },
  clearButton: {
    backgroundColor: "#FF2442",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 18,
    color: "white",
    fontFamily: "SpaceGroteskBold",
  },
  articlesListContainer: {
    marginTop: hp(2),
    flex: 1,
    paddingHorizontal: 16,
  },
  flatListContent: {
    paddingBottom: hp(2),
  },
  noArticlesText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "gray",
  },
  articleContainer: {
    marginBottom: 16,
  },
  articleInnerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
  },
  imageContainer: {
    width: "20%",
  },
  articleImage: {
    width: hp(9),
    height: hp(10),
    borderRadius: 8,
  },
  articleContent: {
    width: "70%",
    paddingLeft: 16,
    justifyContent: "center",
  },
  authorText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4b5563",
  },
  titleText: {
    fontSize: hp(1.7),
    fontFamily: "SpaceGroteskBold",
    color: "#1f2937",
  },
  dateText: {
    fontSize: 12,
    color: "#4b5563",
  },
  darkText: {
    color: "#e5e7eb",
  },
  darkDateText: {
    color: "#d1d5db",
  },
  bookmarkContainer: {
    width: "10%",
    justifyContent: "center",
  },
});
