import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import { XMarkIcon } from "react-native-heroicons/outline";
import { fetchSearchNews } from "../../../utils/NewsApi";
import { debounce } from 'lodash';
import NewsSection from "../../../components/news/NewsSection";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Header from "@/components/news/Header";

export default function SearchScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState(""); // State to control TextInput value

  const handleSearch = async (search: string) => {
    if (search && search.length > 2) {
      setLoading(true);
      setResults([]);
      setSearchTerm(search);

      try {
        const data = await fetchSearchNews(search);
        setLoading(false);

        if (data && data.articles) {
          setResults(data.articles);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  // Clear search input but keep results and searchTerm unchanged
  const handleClearInput = () => {
    setInputValue(""); // Clear TextInput value
  };

  return (
    <View style={styles.container}>
      <Header title='Search' backHandler={() => router.back()} />
      <View style={styles.searchContainer}>
        <TextInput
          value={inputValue} // Controlled TextInput value
          onChangeText={(text) => {
            setInputValue(text);
            handleTextDebounce(text);
          }}
          placeholder="Search for your news"
          placeholderTextColor="gray"
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={handleClearInput}>
          <XMarkIcon size={25} color="#9BD2FC" strokeWidth={3} />
        </TouchableOpacity>
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {results?.length} News for {searchTerm}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <NewsSection newsProps={results} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 18,
    flexDirection: "row",
    padding: 8,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f3f4f6", // neutral-100 equivalent
    borderRadius: 8,
  },
  searchInput: {
    fontSize: 16,
    fontFamily: "SpaceGroteskMedium",
    color: "black",
    letterSpacing: 0.5,
    padding: 8,
    paddingVertical: 4,
    width: "90%",
  },
  resultsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 20,
    color: "black",
    fontFamily: "SpaceGroteskBold",
  },
  scrollViewContent: {
    paddingBottom: hp(5),
  },
});
