import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {generate} from "random-words";

type Meaning = {
    partOfSpeech: string;
    definitions: { definition: string; example?: string }[];
};

type WordData = {
    word: string;
    phonetics: { audio: string }[];
    meanings: Meaning[];
};

const STORAGE_KEYS = {
    word: '@word_of_the_day',
    date: '@word_of_the_day_date',
};

const FALLBACK_WORD = 'apple';

const WOTDCard = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [data, setData] = useState<WordData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [wordOfTheDay, setWordOfTheDay] = useState('');

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
            return FALLBACK_WORD; // Fallback word in case of error
        }
    };

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

    const fetchWordData = async () => {
        if (!wordOfTheDay.trim()) return;

        setLoading(true);
        let word = wordOfTheDay;
        const startTime = Date.now();
        const timeout = 3000; // 3 seconds timeout

        while (Date.now() - startTime < timeout) {
            try {
                const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
                const response = await fetch(url);
                const fetchedData = await response.json();

                if (response.status === 200) {
                    setData(fetchedData[0]);
                    setError(null);
                    return; // Exit loop if a valid word is found
                } else {
                    word = generate()[0]; // Generate a new random word
                    setWordOfTheDay(word);
                    await AsyncStorage.setItem(STORAGE_KEYS.word, word);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('An error occurred while fetching data');
                break; // Exit loop on fetch error
            }
        }

        // Fallback to 'apple' if timeout reached or persistent errors occur
        setWordOfTheDay(FALLBACK_WORD);
        setError('Word not found, fallback to default word.');
        setLoading(false);
    };

    const handleOpenModal = () => {
        fetchWordData();
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setData(null);
        setError(null);
    };

    const { height: screenHeight } = Dimensions.get('window');
    const maxHeight = screenHeight * 0.7;

    return (
        <>
            <TouchableOpacity onPress={handleOpenModal}>
                <View style={styles.container}>
                    <Text style={styles.title}>Word of the day</Text>
                    <View style={styles.wordContainer}>
                        <View>
                            <Text style={styles.label}>{wordOfTheDay}</Text>
                            <Text style={styles.text}>Time to review!</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Ionicons name='play' size={20} color='#0074CE'/>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType='slide'
                transparent={true}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { maxHeight }]}>
                        {loading ? (
                            <ActivityIndicator size='large' color='#0693F1'/>
                        ) : error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : data ? (
                            <View style={styles.resultsContainer}>
                                <View style={styles.resultHeaderContainer}>
                                    <Text style={styles.word}>{data.word}</Text>
                                    <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal} activeOpacity={0.6}>
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                                <ScrollView overScrollMode='never' style={{flexGrow: 0}}>
                                    {data.meanings.map((meaning, index) => (
                                        <View key={index}>
                                            <Text style={styles.partOfSpeech}>{meaning.partOfSpeech}</Text>
                                            {meaning.definitions.map((definition, defIndex) => (
                                                <View key={defIndex}>
                                                    <Text style={styles.resultText}>
                                                        Definition: {definition.definition}
                                                    </Text>
                                                    {definition.example && (
                                                        <Text style={styles.resultText}>
                                                            Example: {definition.example}
                                                        </Text>
                                                    )}
                                                </View>
                                            ))}
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        ) : null}
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default WOTDCard;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#27AE60',
        width: 170,
        height: 100,
        padding: 12,
        borderRadius: 12,
    },
    title: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    label: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 6,
    },
    text: {
        color: 'white',
        fontSize: 12,
        fontWeight: '400',
    },
    wordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    modalContent: {
        width: '80%',
        borderRadius: 12,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 10,
    },
    resultsContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    word: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    partOfSpeech: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    resultText: {
        fontSize: 18,
        marginBottom: 10,
    },
    resultHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#FF4B4C',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
