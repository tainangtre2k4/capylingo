import {Dimensions, Image, StatusBar as RNStatusBar, StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native'
import React, {useEffect, useState, useContext } from 'react'
import {useNavigation} from 'expo-router'
import BackButton from "@/components/BackButton";
import HeaderProgressTracker from "@/components/learn/HeaderProgressTracker";
import {RenderHTML} from 'react-native-render-html';
import Ionicons from '@expo/vector-icons/Ionicons';
import {ReadingContext} from './_layout';

const {width, height} = Dimensions.get('window')

const ReadingArticle = () => {
  const navigation = useNavigation();
  const MIN_FONT_SIZE = 14;
  const MAX_FONT_SIZE = 28;
  const DEFAULT_FONT_SIZE = 14;
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const {curIndex, maxIndex, passage, prevPassage, nextPassage} = useContext(ReadingContext);

  const increaseFontSize = () => {
    if (fontSize < MAX_FONT_SIZE) {
      setFontSize(prevSize => prevSize + 2);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > MIN_FONT_SIZE) {
      setFontSize(prevSize => prevSize - 2);
    }
  };

  useEffect(() => {
      navigation.setOptions({
          header: () => (
              <View style={styles.headerContainer}>
                  <BackButton/>
                  <HeaderProgressTracker current={curIndex + 1} all={maxIndex + 1}/>
                  <TouchableOpacity style={styles.headerRightIconContainer} activeOpacity={0.6}>
                      <Image source={require('../../../../../assets/images/skillcheck/article.png')}
                             style={styles.headerRightIcon}/>
                  </TouchableOpacity>
              </View>
          ),
          headerTitleStyle: {
              color: 'white'
          },
      });
  }, [navigation, curIndex, maxIndex]);

  return (
      <>
          <ScrollView style={styles.container}>
              <RenderHTML defaultTextProps={{selectable: true, style: { fontSize } }} source={passage} contentWidth={width}/>
          </ScrollView>
          <View style={styles.footer}>
              <TouchableOpacity style={styles.footerIconContainer} onPress={increaseFontSize}>
                  <Image source={require('../../../../../assets/images/skillcheck/text_up.png')}
                         style={styles.footerText}/>
                  <Text style={styles.footerLabel}>Zoom in</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerIconContainer} onPress={decreaseFontSize}>
                  <Image source={require('../../../../../assets/images/skillcheck/text_down.png')}
                         style={styles.footerText}/>
                  <Text style={styles.footerLabel}>Zoom out</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerIconContainer}>
                  <Ionicons name="arrow-back" size={24} color="black" onPress={prevPassage}/>
                  <Text style={styles.footerLabel}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerIconContainer}>
                  <Ionicons name="arrow-forward" size={24} color="black" onPress={nextPassage}/>
                  <Text style={styles.footerLabel}>Next</Text>
              </TouchableOpacity>
          </View>
      </>

  )
}

export default ReadingArticle

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: RNStatusBar.currentHeight || 20,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20
    },
    headerRightIcon: {
        height: 22,
        width: 20,
    },
    headerRightIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4
    },
    footer: {
        flexDirection: 'row',
        paddingVertical: 14,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderColor: '#A0A0A0'
    },
    footerIconContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    footerText: {
        height: 15,
        width: 24,
    },
    footerHighlight: {
        height: 18,
        width: 16,
        resizeMode: 'contain',
    },
    footerLabel: {
        fontSize: 12,
    }
})
