import {Dimensions, Image, StatusBar as RNStatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import {useState, useEffect} from 'react';
import {useUser} from '@clerk/clerk-expo';
import {Ionicons} from '@expo/vector-icons'
import WOTDCard from '@/components/learn/WOTDCard';
import SubjectCard from '@/components/learn/SubjectCard';
import {StatusBar} from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generate } from "random-words";

const { width, height } = Dimensions.get('window');

const STORAGE_KEYS = {
    word: '@word_of_the_day',
    date: '@word_of_the_day_date',
};

const getWordOfTheDay = async () => {
    try {
        const storedWord = await AsyncStorage.getItem(STORAGE_KEYS.word);
        const storedDate = await AsyncStorage.getItem(STORAGE_KEYS.date);
        const today = new Date().toDateString();

        if (storedWord && storedDate === today) {
            // Return the stored word if it's the same day
            return storedWord;
        } else {
            // Generate a new word and store it with today's date
            const newWord = generate()[0];
            await AsyncStorage.setItem(STORAGE_KEYS.word, newWord);
            await AsyncStorage.setItem(STORAGE_KEYS.date, today);
            return newWord;
        }
    } catch (error) {
        console.error('Failed to fetch or set word of the day', error);
        return 'apple'; // Fallback word in case of error
    }
};

const Learn = () => {
    const { user } = useUser();
    const [wordOfTheDay, setWordOfTheDay] = useState('');

    useEffect(() => {
        const fetchWord = async () => {
            const word = await getWordOfTheDay();
            setWordOfTheDay(word);
        };

        fetchWord();

        // Set a timeout to reset the word at midnight
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        const timeUntilMidnight = midnight.getTime() - now.getTime();

        const timer = setTimeout(fetchWord, timeUntilMidnight);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <StatusBar style='light' backgroundColor='#3DB2FF' />
            <View style={styles.container}>
                <View style={styles.headBanner}>
                    <View style={styles.GreetingContainer}>
                        <Text style={styles.greeting}>Welcome, {user?.fullName}!</Text>
                        <Text style={styles.dictionaryLabel}>Capybara Dictionary</Text>
                        <View style={styles.searchBox}>
                            <TextInput style={styles.searchInput} placeholder='Quick Search' />
                            <Ionicons name='search-outline' size={20} color='#3DB2FF' />
                        </View>
                    </View>
                    <Image
                        source={require('../../../assets/images/learn/learn-greeter.png')}
                        style={styles.image}
                    />
                </View>
                <View style={styles.bodyContainer}>
                    <View style={styles.indicator} />
                    <Text style={styles.bodyTitle}>Your Learning Progress</Text>
                    <View style={styles.trackingCardsContainer}>
                        <WOTDCard word={wordOfTheDay} />
                    </View>
                    <View style={styles.SubjectCardsContainer}>
                        <SubjectCard type='vocabulary' />
                        <SubjectCard type='grammar' />
                        <SubjectCard type='skillcheck' />
                    </View>
                </View>
            </View>
        </>
    );
};

export default Learn;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#3DB2FF"
    },
    headBanner: {
        backgroundColor: "#3DB2FF",
        paddingTop: RNStatusBar.currentHeight || height * .042,
        justifyContent: 'space-between',
        paddingHorizontal: width * .047,
        flexDirection: 'row',
    },
    GreetingContainer: {
        paddingTop: height * .025,
        paddingBottom: height * .042

    },
    greeting: {
        fontSize: 18,
        fontWeight: '500',
        color: 'white',
        marginBottom: height * .02,
        marginHorizontal: width * .011
    },
    dictionaryLabel: {
        fontSize: 20,
        fontWeight: '700',
        color: 'white',
        marginBottom: height * .02,
        marginHorizontal: width * .011
    },
    searchBox: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: width * .04,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: height * .004,
        paddingHorizontal: width * .03,
        elevation: 4
    },
    searchInput: {
        width: width * .42,
        fontSize: 14,
        fontStyle: 'italic'
    },
    image: {
        marginTop: height * .034,
        height: height * .17,
        width: width * .33,
        resizeMode: 'contain'
    },
    bodyContainer: {
        flex: 1,
        borderTopRightRadius: width * .04,
        borderTopLeftRadius: width * .04,
        backgroundColor: 'white',
        paddingHorizontal: width * .042,
        paddingVertical: width * .042,
    },
    indicator: {
        width: width * .2,
        borderWidth: 2,
        borderColor: '#A2A7A9',
        alignSelf: 'center'
    },
    bodyTitle: {
        fontSize: 22,
        fontWeight: '600',
        marginVertical: height * .02,
        alignSelf: 'center'
    },
    trackingCardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    SubjectCardsContainer: {
        flex: 1,
        marginVertical: 30, // not finish yet
        justifyContent: 'space-between',
    }
})
