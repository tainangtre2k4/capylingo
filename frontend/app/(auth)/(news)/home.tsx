import { View, ScrollView, StyleSheet, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Loading from "../../../components/news/Loading";
import Header from "../../../components/news/Header";
import NewsSection from "../../../components/news/NewsSection";
import { useQuery } from "@tanstack/react-query";
import { fetchBreakingNews, fetchRecommendedNews } from "../../../utils/NewsApi";
import MiniHeader from "../../../components/news/MiniHeader";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import BreakingNews from "../../../components/news/BreakingNews";
import { Link, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
export default function HomeScreen() {
  // Breaking News
  const backHandler = () => {
    // put router here
  }

  const { data, isLoading: isBreakingLoading } = useQuery({
    queryKey: ["breakingNewss"],
    queryFn: fetchBreakingNews,
  });

  // Recommended News
  const { data: recommendedNew, isLoading: isRecommendedLoading } = useQuery({
    queryKey: ["recommededNewss"],
    queryFn: fetchRecommendedNews,
  });

  return (
    <View style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: 'News',
        }}
      />
      <StatusBar style="dark" />

      <View>
        {/* Header */}
        <Header backHandler={backHandler} title='News'/>

        

        {/* Breaking News */}
        {isBreakingLoading ? (
          <Loading />
        ) : (
          <View>
            <MiniHeader label="Breaking News" />
            <BreakingNews label="Breaking News" data={data.articles} />
          </View>
        )}


        <View style={styles.linkContainer}>
          <View style={{flexDirection:'row'}}>
            <Link href='/discover'>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap: 5, backgroundColor:'#FF2442',padding: 10,borderRadius: 16,width: 150}}>
                <Ionicons
                  name={'compass-outline'}
                  size={25}
                  color='white'
                />
              <Text style={styles.linkText}>Discovery</Text>
            </View>
            </Link>
          </View>

          <View style={{flexDirection:'row',}}>
            <Link href='/save'>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',gap: 5, backgroundColor:'#16A085',padding: 10,borderRadius: 16,width: 150}}>
                <Ionicons
                  name={'bookmark-outline'}
                  size={25}
                  color='white'
                />
              <Text style={styles.linkText}>Save</Text>
            </View>
            </Link>
          </View>
        </View>

        {/* Recommended News */}
        <View style={styles.recommended}>
          <MiniHeader label="Recommended" />
          <ScrollView
            contentContainerStyle={{
              paddingBottom: hp(80),
            }}
          >
            {isRecommendedLoading ? (
              <Loading />
            ) : (
              <NewsSection newsProps={recommendedNew.articles} />
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  linkText: {
    color: "white",
    fontWeight:'bold',
  },
  recommended: {
    backgroundColor: "white",
  },
});
