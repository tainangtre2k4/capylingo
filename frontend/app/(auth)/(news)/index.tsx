import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from '@/components/(news)/Header'
import SearchBar from '@/components/(news)/SearchBar'
import axios from 'axios'
import { NewsDataType } from '../../../constants/types'
import BreakingNews from '@/components/(news)/BreakingNews'
import Categories from '@/components/(news)/Categories'
import NewsList from '@/components/(news)/NewsList'
import Loading from '@/components/(news)/Loading'

type Props = {}

const index = (props: Props) => {
  //const {top: safeTop} = useSafeAreaInsets();
  const [breakingNews, setBreakingNews] = useState<NewsDataType[]>([]);
  const [news, setNews] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(()=> {
    getBreakingNews();
    getNews();
  }, []);

  const getBreakingNews = async() => {
    try {
      const URL = 'https://newsdata.io/api/1/news?apikey=pub_52598c53df161fd8e22d6d5e64f37f8410d13&country=us&language=en&image=1&removeduplicate=1&size=5'
      const response = await axios .get(URL);

      //console.log("News Data: ", response.data);
      if (response && response.data){
        setBreakingNews(response.data.results);
        setIsLoading(false);
      }
    } catch (err: any){
      console.log('Error Message: ', err.message);
    }
  }
  const getNews = async(category:string = '') => {
    try {
      let categoryString = '';
      if (category.length !== 0){
        categoryString = `&category=${category}`
      }
      const URL = `https://newsdata.io/api/1/news?apikey=pub_52598c53df161fd8e22d6d5e64f37f8410d13&country=us&language=en&image=1&removeduplicate=1&size=10${categoryString}`      
      const response = await axios .get(URL);

      //console.log("News Data: ", response.data);
      if (response && response.data){
        setNews(response.data.results);
        setIsLoading(false);
      }
    } catch (err: any){
      console.log('Error Message: ', err.message);
    }
  }

  const onCatChanged = (category: string) => {
    console.log('Category: ', category)
    setNews([]);
    getNews(category);
  }
  return (
    <ScrollView style = {[styles.container, {paddingTop: 10}]}>
      <Header />
      <SearchBar />
      {isLoading ? (
        <Loading size = {'large'} />
      ) : (
      <BreakingNews newsList={breakingNews} />
    )}
    <Categories onCategoryChanged={onCatChanged}/>
    <NewsList newsList={news}/>
    </ScrollView>
  )
}

export default index

const styles = StyleSheet.create(
  {
    container: {
      //flex:1,
    },
  }
)
