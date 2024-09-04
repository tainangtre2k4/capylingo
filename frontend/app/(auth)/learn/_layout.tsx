import React from 'react'
import {Stack} from 'expo-router'
import {StatusBar} from 'expo-status-bar';
import {SafeAreaView, View} from "react-native";

const LearnStack = () => {

    return (
        <View style={{flex: 1, backgroundColor: '#3DB2FF'}}>
            
                <StatusBar style='light' backgroundColor='#3DB2FF'/>
                <Stack screenOptions={{headerShown: false}}/>
         
        </View>

    )
}

export default LearnStack
