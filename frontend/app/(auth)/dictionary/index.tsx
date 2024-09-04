import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    Platform,
    ScrollView,
    StatusBar as RNStatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {Audio} from 'expo-av';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useRouter} from 'expo-router'
import {DictionaryContext} from "./_layout";

type Meaning = {
    partOfSpeech: string;
    definitions: { definition: string; example?: string }[];
};

type WordData = {
    word: string;
    phonetics: { audio: string }[];
    meanings: Meaning[];
};

const Dictionary = () => {
    const router = useRouter();
    const navigation = useNavigation();
    const [newWord, setNewWord] = useState<string>('');
    const [checkedWord, setCheckedWord] = useState<string>('');
    const [lastSearchedWord, setLastSearchedWord] = useState<string>('');
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [data, setData] = useState<WordData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<TextInput | null>(null);
    const {history, favorite, setHistory, setFavorite} = useContext(DictionaryContext);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: () => (
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Dictionary</Text>
                    <View style={styles.headerIconsContainer}>
                        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.6} onPress={() => {router.push('/dictionary/history')}}>
                            <Ionicons name='timer-outline' size={24} color='#0693F1'/>
                        </TouchableOpacity>
                        <View style={{marginHorizontal: 10}}/>
                        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.6} onPress={() => {router.push('/dictionary/favorite')}}>
                            <Ionicons name='star-outline' size={24} color='#0693F1'/>
                        </TouchableOpacity>
                    </View>
                </View>
            ),
            headerTitleStyle: {
                color: 'white'
            },
        });
    }, [navigation]);

    const getInfo = async () => {
        // Prevent search if input is empty or if the word hasn't changed
        if (!newWord.trim() || newWord === lastSearchedWord) {
            return;
        }

        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${newWord}`;

        try {
            const response = await fetch(url);
            const fetchedData = await response.json();

            if (response.status === 200) {
                const wordData: WordData = fetchedData[0];
                setData(wordData);
                setCheckedWord(wordData.word);
                setLastSearchedWord(newWord);  // Update last searched word

                // Update history: remove old entry if exists, then add new word at the top
                setHistory((prevHistory) => {
                    const filteredHistory = prevHistory.filter(word => word !== wordData.word);
                    return [wordData.word, ...filteredHistory];
                });

                setError(null);
            } else {
                setError('Word not found in the database');
                setTimeout(() => setError(null), 3000);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('An error occurred while fetching data');
            setTimeout(() => setError(null), 3000);
        }
    };

    const playAudio = async () => {
        if (data && data.phonetics[0]?.audio) {
            if (sound) {
                await sound.unloadAsync();
            }

            const audioUri = data.phonetics[0].audio;
            const {sound: newSound, status} = await Audio.Sound.createAsync({uri: audioUri});

            if (status.isLoaded) {
                setSound(newSound);
                await newSound.playAsync();
            }
        }
    };

    const clear = async () => {
        setCheckedWord('');
        setNewWord('');
        setData(null);
        setLastSearchedWord('');  // Reset the last searched word
        inputRef.current?.clear();  // Clear the input field

        if (sound) {
            await sound.unloadAsync();
        }
    };

    const handleFavorite = () => {
        if (checkedWord) {
            setFavorite((prevFavorites) => {
                if (prevFavorites.includes(checkedWord)) {
                    // Remove the word if it already exists in favorites
                    return prevFavorites.filter(word => word !== checkedWord);
                } else {
                    // Add the word if it does not exist in favorites
                    return [...prevFavorites, checkedWord];
                }
            });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder="Search..."
                    value={newWord}
                    onChangeText={setNewWord}
                />
                <TouchableOpacity style={styles.button} onPress={getInfo} activeOpacity={0.6}>
                    <Ionicons name='search' size={24} color='white'/>
                </TouchableOpacity>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
            {checkedWord && !error && (
                <View style={styles.resultsContainer}>
                    <View style={styles.resultHeaderContainer}>
                        <Text style={styles.word}>{checkedWord}</Text>
                        <View style={styles.headerIconsContainer}>
                            <TouchableOpacity style={styles.cardButton} onPress={playAudio}>
                                <Ionicons name="volume-high" size={28} color="white"/>
                            </TouchableOpacity>
                            <View style={{marginHorizontal: 10}}/>
                            <TouchableOpacity style={styles.cardButton} onPress={handleFavorite}>
                                <Ionicons
                                    name={favorite.includes(checkedWord) ? "star" : "star-outline"}
                                    size={28}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView overScrollMode='never' style={{flexGrow: 0}}>
                        {data?.meanings.map((meaning, index) => (
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
            )}
            {newWord ? (
                <TouchableOpacity style={styles.clearButton} onPress={clear} activeOpacity={0.6}>
                    <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

export default Dictionary;


const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        // marginTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 20) : 0,
        backgroundColor: '#3DB2FF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: 'white'
    },
    headerIconsContainer: {
        flexDirection: 'row',
    },
    headerIcon: {
        padding: 10,
        borderRadius: 12,
        backgroundColor: 'white',
        elevation: 4,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowColor: 'black',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F3F3F3',
        padding: 20,
        paddingBottom: 170,
    },
    errorText: {
        color: 'red',
        fontSize: 24,
        marginTop: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#FFF',
        borderRadius: 14,
        shadowColor: 'black',
        elevation: 4,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    input: {
        flex: 1,
        padding: 16,
        fontSize: 18,
    },
    button: {
        backgroundColor: '#0693F1',
        padding: 12,
        marginRight: 4,
        borderRadius: 12,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    resultsContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        padding: 20,
    },
    resultHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    word: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cardButton: {
        backgroundColor: '#0693F1',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    resultText: {
        fontSize: 18,
        marginBottom: 10,
    },
    clearButton: {
        backgroundColor: '#FF4B4C',
        padding: 16,
        marginTop: 20,
        borderRadius: 12,
    },
    clearButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    partOfSpeech: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10
    }
});
