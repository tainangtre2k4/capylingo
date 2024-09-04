import {StatusBar as RNStatusBar, StyleSheet, Text, View} from 'react-native'
import React, {useEffect} from 'react'
import {Link, useNavigation} from 'expo-router'
import BackButton from "@/components/BackButton";

const VocabularyLesson = () => {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            header: () => (
                <View style={styles.header}>
                    <BackButton/>
                    <Text style={styles.title}>Vocabulary</Text>
                </View>
            ),
            headerTitleStyle: {
                color: 'white'
            },
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Link href='/learn/vocabulary/exercises'>exercises</Link>
        </View>
    )
}

export default VocabularyLesson

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        // marginTop: (RNStatusBar.currentHeight || 20),
        backgroundColor: '#3DB2FF',
        alignItems: 'center',
        flexDirection: 'row'
    },
    title: {
        marginHorizontal: 20,
        color: 'white',
        fontSize: 24,
        fontWeight: '500'
    }
})
