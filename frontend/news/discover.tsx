import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import Loading from "../components/news/Loading";
import { useQuery } from "@tanstack/react-query";
import { categories } from "../constants/Colors";
import CategoriesCard from "../components/news/CategoriesCard";
import NewsSection from "../components/news/NewsSection";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { fetchDiscoverNews } from "../utils/NewsApi";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { router, useRouter } from "expo-router";
import Header from "@/components/news/Header";

export default function DiscoverScreen() {
  const { colorScheme } = useColorScheme();
  const [activeCategory, setActiveCategory] = useState("business");
  const [withoutRemoved, setWithoutRemoved] = useState([]);

  useEffect(() => {}, [activeCategory]);

  const { data: discoverNew, isLoading: isDiscoverLoading } = useQuery({
    queryKey: ["discoverNews", activeCategory],
    queryFn: () => fetchDiscoverNews(activeCategory),
  });

  const handleChangeCategory = (category: string) => {
    setActiveCategory(category);

    const filteredArticles = discoverNew?.articles.filter(
      (article) => article.title !== "[Removed]"
    );

    setWithoutRemoved(filteredArticles || []);
  };
  const router = useRouter();
  const backHandler = ()  =>  {
    router.back();
  }
  return (
    <View>
    <Header title='Discover' backHandler={backHandler} />
      
      <View>

        {/* <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchIconContainer}>
            <MagnifyingGlassIcon size={25} color="gray" />
          </TouchableOpacity>
          <TextInput
            onPressIn={() => router.push('search')}
            placeholder="Search for news"
            placeholderTextColor="gray"
            style={styles.searchInput}
          />
        </View> */}

        <View style={styles.categoriesContainer}>
          <CategoriesCard
            categories={categories}
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>

        <View style={styles.newsHeader}>
          <Text style={[styles.newsTitle, { color: colorScheme === "dark" ? "white" : "black" }]}>
            Discover
          </Text>
          <Text style={[styles.viewAll, { color: colorScheme === "dark" ? "#d1d5db" : "#898989" }]}>
            View all
          </Text>
        </View>

        {isDiscoverLoading ? (
          <View style={styles.loadingContainer}>
            <Loading />
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: hp(70) }}>
            <NewsSection newsProps={withoutRemoved} />
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaLight: {
    backgroundColor: 'white',
  },
  safeAreaDark: {
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'SpaceGroteskMedium',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 32,
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    borderRadius: 9999,
    marginTop: 10,
  },
  searchIconContainer: {
    paddingLeft: 8,
  },
  searchInput: {
    paddingLeft: 16,
    flex: 1,
    fontFamily: 'SpaceGroteskMedium',
    color: 'black',
    letterSpacing: 1.1,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 10,
  },
  newsHeader: {
    marginVertical: 16,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsTitle: {
    fontSize: 20,
    fontFamily: 'SpaceGroteskBold',
  },
  viewAll: {
    fontSize: 16,
    fontFamily: 'SpaceGroteskBold',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
