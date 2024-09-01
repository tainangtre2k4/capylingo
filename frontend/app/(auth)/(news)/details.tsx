import {
    View,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { useRouter, useLocalSearchParams } from "expo-router";
  import { WebView } from "react-native-webview";
  import { ChevronLeftIcon, ShareIcon } from "react-native-heroicons/outline";
  import { BookmarkSquareIcon } from "react-native-heroicons/solid";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  const { height, width } = Dimensions.get("window");
  
  export default function NewsDetails() {
    const item = useLocalSearchParams();
    const [visible, setVisible] = useState(false);
    const router = useRouter();
    const [isBookmarked, toggleBookmark] = useState(false);
  
    const toggleBookmarkAndSave = async () => {
      try {
        const savedArticles = await AsyncStorage.getItem("savedArticles");
        let savedArticlesArray = savedArticles ? JSON.parse(savedArticles) : [];
  
        const isArticleBookmarked = savedArticlesArray.some(
          (savedArticle: any) => savedArticle.url === item.url
        );
  
        if (!isArticleBookmarked) {
          savedArticlesArray.push(item);
          await AsyncStorage.setItem(
            "savedArticles",
            JSON.stringify(savedArticlesArray)
          );
          toggleBookmark(true);
        } else {
          const updatedSavedArticlesArray = savedArticlesArray.filter(
            (savedArticle: any) => savedArticle.url !== item.url
          );
          await AsyncStorage.setItem(
            "savedArticles",
            JSON.stringify(updatedSavedArticlesArray)
          );
          toggleBookmark(false);
        }
      } catch (error) {
        console.log("Error Saving Article", error);
      }
    };
  
    useEffect(() => {
      const loadSavedArticles = async () => {
        try {
          const savedArticles = await AsyncStorage.getItem("savedArticles");
          const savedArticlesArray = savedArticles
            ? JSON.parse(savedArticles)
            : [];
  
          const isArticleBookmarked = savedArticlesArray.some(
            (savedArticle: any) => savedArticle.url === item.url
          );
  
          toggleBookmark(isArticleBookmarked);
        } catch (error) {
          console.log("Error Loading Saved Articles", error);
        }
      };
  
      loadSavedArticles();
    }, [item.url]);
  
    return (
      <>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeftIcon size={25} strokeWidth={3} color="gray" />
            </TouchableOpacity>
          </View>
  
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <ShareIcon size={25} color="gray" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={toggleBookmarkAndSave}>
              <BookmarkSquareIcon
                size={25}
                color={isBookmarked ? "green" : "gray"}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>
        </View>
  
        {typeof item.url === 'string' && (
          <WebView
            source={{ uri: item.url }}
            onLoadStart={() => setVisible(true)}
            onLoadEnd={() => setVisible(false)}
          />
        )}
  
        {visible && (
          <ActivityIndicator
            size={"large"}
            color={"green"}
            style={styles.loader}
          />
        )}
      </>
    );
  }
  
  const styles = StyleSheet.create({
    header: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 40,
      paddingBottom: 16,
      backgroundColor: "white",
    },
    iconContainer: {
      backgroundColor: "#f3f4f6",
      padding: 8,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    actionContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    actionButton: {
      backgroundColor: "#f3f4f6",
      padding: 8,
      borderRadius: 50,
      marginLeft: 8,
    },
    loader: {
      position: "absolute",
      top: height / 2,
      left: width / 2 - 15,
    },
  });
  