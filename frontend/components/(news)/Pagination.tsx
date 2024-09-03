import { Animated, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NewsDataType } from '@/app/(auth)/(news)/types'
import { SharedValue } from 'react-native-reanimated'
import { colors } from 'react-native-elements'

type Props = {
    items: NewsDataType[];
    paginationIndex: number;
    scrollX: SharedValue<number>
}

const Pagination = ({items, paginationIndex, scrollX}: Props) => {
  return (
    <View style = {styles.container}>
        {items.map((_, index) => {      
         return <Animated.View style = {[styles.dot, {backgroundColor: paginationIndex === index ? "#FFAC1C" : colors.grey0}]} key = {index} />
        })}

    </View>
  )
}

export default Pagination

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    dot: {
        backgroundColor: "#333",
        height: 8,
        width: 8,
        marginHorizontal: 2,
        borderRadius: 8,
    },
})