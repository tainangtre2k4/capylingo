import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from '@/components/(news)/Header'
import SearchBar from '@/components/(news)/SearchBar'
import axios from 'axios'
import { NewsDataType } from '../../../constants/types'
import BreakingNews from '@/components/(news)/BreakingNews'

type Props = {}

const index = (props: Props) => {
  //const {top: safeTop} = useSafeAreaInsets();
  const [breakingNews, setBreakingNews] = useState<NewsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(()=> {
    getBreakingNews()
  }, []);

  const getBreakingNews = async() => {
    try {
      const URL = 'https://newsdata.io/api/1/news?apikey=pub_52598c53df161fd8e22d6d5e64f37f8410d13&country=vi&language=en&image=1&removeduplicate=1&size=5'
      const response = await axios .get(URL);

      if (response && response.data){
        setBreakingNews(response.data.results);
        setIsLoading(false);
      }
    } catch (err: any){
      console.log('Error Message: ', err.message);
    }
  }
  return (
    <View style = {[styles.container, {paddingTop: 10}]}>
      <Header />
      <SearchBar />
      {isLoading ? (
        <ActivityIndicator size = {"large"} />
      ) : (
      <BreakingNews newsList={breakingNews} />
    )}
    </View>
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
