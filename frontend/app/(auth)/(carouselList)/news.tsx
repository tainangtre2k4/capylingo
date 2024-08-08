// Ai muon test thi hide cai header di nhe !
import * as React from 'react';
import { StatusBar, Animated, Text, Image, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get('screen');

const bgs = [ '#FF4B4C', '#FFC107', '#99CC29', '#0074CE'];

import capyNews from '../../../assets/images/resources/capyNews.png';
import capyGames from '../../../assets/images/resources/capyGames.png';
import capyCommunity from '../../../assets/images/resources/capyCommunity.png';
import capyAI from '../../../assets/images/resources/capyAI.png';

const DATA = [
  {
    key: "1",
    title: "Daily English News",
    description: "Catch up on the latest news and enhance your English skills with our daily reading feature. Improve your vocabulary and comprehension with every article.",
    image: capyNews
  },
  {
    key: "2",
    title: "Play Games",
    description: "Play exciting games that make learning English fun. Improve your language skills through entertaining and interactive challenges.",
    image: capyGames
  },
  {
    key: "3",
    title: "Community",
    description: "Play exciting games that make learning English fun. Improve your language skills through entertaining and interactive challenges.",
    image: capyCommunity
  },
  {
    key: "4",
    title: "AI Chatbot",
    description: "Chat with our quirky digital buddy, Cabybot! He will be a great company for your journey. Our beloved Cabybot sometimes turns into Dumdumbara though...",
    image: capyAI
  }
];

const Indicator = ({scrollX}) => {
    return(
        <View style={{flexDirection: 'row', position: 'absolute', bottom: 150}}>
            {DATA.map((_, i) => {
                const inputRange = [(i-1)*width, i*width, (i+1)*width]
                const scale = scrollX.interpolate({  // interpolate để chuyển đổi một thuộc tính trong style dần dần (mượt mà: màu, opacity, width, height, rotation,..)
                  inputRange,
                  outputRange: [0.8, 1.4, 0.8], // mảng gtri ouput ứng với input
                  extrapolate: 'clamp',
                })
                const opacity = scrollX.interpolate({  // interpolate để chuyển đổi một thuộc tính trong style dần dần (mượt mà: màu, opacity, width, height, rotation,..)
                  inputRange,
                  outputRange: [0.6, 0.9, 0.6], // mảng gtri ouput ứng với input
                  extrapolate: 'clamp',
                })
                return <Animated.View
                    key={`indicator-${i}`}
                    style={{
                        height: 10,
                        width: 10,
                        borderRadius: 5,
                        backgroundColor: "#fff",
                        margin: 10,
                        opacity,
                        transform: [
                          {
                          scale,
                          }
                        ],
                    }}
                />
            })}
        </View>
    )
}

const Backdrop = ({scrollX}) => {
    const backgroundColor = scrollX.interpolate({  // interpolate để chuyển đổi một thuộc tính trong style dần dần (mượt mà: màu, opacity, width, height, rotation,..)
        inputRange: bgs.map((_,i) => i*width),
        outputRange: bgs.map((bg)=>bg), // mảng gtri ouput ứng với input
    })
    return (
        <Animated.View
            style={[StyleSheet.absoluteFillObject, {backgroundColor,}]} //absoluteFillObject để chiếm hết ko gian cha của nó
        />
    )
}

const Square = ({scrollX}) => {
  const YOLO = Animated.divide(
    Animated.modulo(scrollX, width),      // Dam bao YOLO luon nam tu 0-1 sai khi divide
    new Animated.Value(width)
  )
  const rotate = YOLO.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['35deg', '0deg', '35deg']
  })
  const translateX = YOLO.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -height, 0],
  })
  return (
    <Animated.View
      style = {{
        width: height,
        height: height,
        backgroundColor: '#fff',
        borderRadius: 86,
        position: 'absolute',
        top: -height * 0.68,
        left: -height *0.32,
        transform: [
          {
            rotate,
          },
          {
            translateX,
          }
        ]
      }}
    />
  )
}

export default function App() {
  const scrollX=React.useRef(new Animated.Value(0)).current //useRef de giu gtri , ko can re-render
  return (
    <View style={styles.container}>
      <Backdrop scrollX={scrollX} />

      <Square scrollX={scrollX} />

      <Animated.FlatList 
        data={DATA}
        keyExtractor={item => item.key}
        horizontal
        scrollEventThrottle={16}
        onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}], // gtri X trong content Offset se dc cap nhat vao scrollX
            {useNativeDriver: false} //do NativeDriver ko support backgrounColor
        )}
        contentContainerStyle={{paddingBottom: 100}}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        renderItem={({ item }) => {
          return (
          <View style={{width: width, alignItems: 'center'}}>
            <View style={{flex: 0.6, justifyContent: 'center', padding: 20 }}>
                <Image source={item.image}
                style={{
                    width: width / 2,
                    height: height / 2,
                    resizeMode: 'contain'
                }}
                />
            </View>
            
            <View style={{flex: 0.2, alignItems: 'center'}}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 30, marginBottom: 40, marginTop: 16}}>
                  {item. title}
              </Text>

              <Text style={{ color: '#fff', fontWeight: '500', fontSize: 16, marginHorizontal: 30}}>
                  {item.description}</Text>
            </View>
          </View>
          )
        }}
        />
      <Indicator scrollX={scrollX}/>
      <TouchableOpacity
        style={{
          height: 60,
          width: 273,
          position:'absolute',
          bottom: 70,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '30',
        }}>
            <Text style={{fontWeight: '600', fontSize: '18', color: '#707070'}}>Yes, Captain Capybara !</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
     alignItems: 'center',
    // justifyContent: 'center',
  },
});
