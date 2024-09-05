import React from 'react'
import {SafeAreaView} from 'react-native'
import {Stack} from 'expo-router'

const ResourcesStack = () => {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <Stack screenOptions={{headerShown: false, statusBarColor: 'white', statusBarStyle: 'dark'}}/>
        </SafeAreaView>
    )
}

export default ResourcesStack
