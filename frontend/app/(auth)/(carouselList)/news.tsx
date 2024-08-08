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
    description: "I'll back up the multi-byte XSS matrix, that should feed the SCSI application!",
    image: capyNews
  },
  {
    key: "2",
    title: "Play Games",
    description: "Use the optical SAS system, then you can navigate the auxiliary alarm!",
    image: capyGames
  },
  {
    key: "3",
    title: "Community",
    description: "The ADP array is down, compress the online sensor so we can input the HTTP panel!",
    image: capyCommunity
  },
  {
    key: "4",
    title: "AI Chatbot",
    description: "We need to program the open-source IB interface!",
    image: capyAI
  }
];

const Indicator = ({scrollX}) => {
    return(
        <View style={{flexDirection: 'row', position: 'absolute', bottom: 100}}>
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
        top: -height * 0.633,
        left: -height *0.3,
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
            <View style={{flex: 0.7, justifyContent: 'center', padding: 20 }}>
                <Image source={item.image}
                style={{
                    width: width / 2,
                    height: height / 2,
                    resizeMode: 'contain'
                }}
                />
            </View>
            
            <View style={{flex: 0.3, alignItems: 'center'}}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 28, marginBottom: 10}}>
                  {item. title}
              </Text>

              <Text style={{ color: '#fff', fontWeight: '300'}}>
                  {item.description}</Text>
            </View>
          </View>
          )
        }}
        />
      <Indicator scrollX={scrollX}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
