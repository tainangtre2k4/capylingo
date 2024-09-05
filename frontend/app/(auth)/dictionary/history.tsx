import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {Audio} from 'expo-av';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useRouter} from 'expo-router';
import {DictionaryContext, WordData} from "./_layout";

const {width, height} = Dimensions.get('window')

const History = () => {
    const navigation = useNavigation();
    const router = useRouter();
    const [checkedWord, setCheckedWord] = useState<string>('');
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [data, setData] = useState<WordData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const {history, favorite, cache, setHistory, setFavorite, setCache} = useContext(DictionaryContext);

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: () => (
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>History</Text>
                    <View style={styles.headerIconsContainer}>
                        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.6} onPress={() => {
                            router.back()
                        }}>
                            <Ionicons name='timer' size={20} color='#0693F1'/>
                        </TouchableOpacity>
                        <View style={{marginHorizontal: 8}}/>
                        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.6} onPress={() => {
                            setHistory([])
                        }}>
                            <Ionicons name='trash' size={20} color='#0693F1'/>
                        </TouchableOpacity>
                    </View>
                </View>
            ),
            headerTitleStyle: {
                color: 'white'
            },
        });
    }, [navigation]);

    const getInfo = async (item: string) => {
        if (!item.trim()) {
            return;
        }

        // Check if the word is in the cache
        if (cache[item]) {
            setData(cache[item]);
            setCheckedWord(item);
            setError(null);
            return;
        }

        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${item}`;

        try {
            const response = await fetch(url);
            const fetchedData = await response.json();

            if (response.status === 200) {
                const wordData: WordData = fetchedData[0];
                setData(wordData);
                setCheckedWord(wordData.word);

                // Add the word data to the cache
                setCache(prevCache => ({...prevCache, [wordData.word]: wordData}));

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

    const handleFavorite = () => {
        if (checkedWord) {
            setFavorite((prevFavorites) => {
                if (prevFavorites.includes(checkedWord)) {
                    return prevFavorites.filter(word => word !== checkedWord);
                } else {
                    return [...prevFavorites, checkedWord];
                }
            });
        }
    };

    const renderHistoryItem = ({item}: { item: string }) => {
        const isExpanded = expandedItem === item;

        const handleToggle = () => {
            if (isExpanded) {
                setExpandedItem(null);
            } else {
                setExpandedItem(item);
                getInfo(item);
            }
        };

        return (
            <View style={isExpanded ? styles.historyItemsExpanded : {}}>
                {!isExpanded && <TouchableOpacity onPress={handleToggle} activeOpacity={0.6} style={styles.historyItem}>
                    <Text style={styles.historyText}>{item}</Text>
                </TouchableOpacity>}
                {isExpanded && checkedWord === item && !error && (
                    <View style={styles.resultsContainer}>
                        <View style={styles.resultHeaderContainer}>
                            <TouchableOpacity onPress={handleToggle} activeOpacity={0.6}>
                                <Text style={styles.word}>{checkedWord}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cardButton} onPress={playAudio}>
                                <Ionicons name="volume-high" size={24} color="#0693F1"/>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cardButton} onPress={handleFavorite}>
                                <Ionicons
                                    name={favorite.includes(checkedWord) ? "star" : "star-outline"}
                                    size={24}
                                    color="#0693F1"
                                />
                            </TouchableOpacity>
                        </View>
                        <ScrollView overScrollMode='never' style={{height: height * 0.3}}>
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
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={history}
                renderItem={renderHistoryItem}
                keyExtractor={(item, index) => index.toString()}
                overScrollMode='never'
            />
        </View>
    );
};

export default History;


const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical: 6,
        paddingHorizontal: 20,
        // marginTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 20) : 0,
        backgroundColor: '#3DB2FF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: 'white'
    },
    headerIconsContainer: {
        flexDirection: 'row',
    },
    headerIcon: {
        padding: 8,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 4,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowColor: 'black',
    },
    container: {
        flex: 1,
        backgroundColor: '#F3F3F3',
        paddingBottom: 70,
        paddingTop: 10
    },
    errorText: {
        color: 'red',
        fontSize: 20,
        marginTop: 10,
    },
    button: {
        backgroundColor: '#0693F1',
        padding: 8,
        marginRight: 4,
        borderRadius: 10,
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
        padding: 10,
    },
    resultHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    word: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginRight: 4
    },
    cardButton: {
        padding: 4,
        marginLeft: 6
    },
    resultText: {
        fontSize: 14,
        marginBottom: 10,
    },
    historyItemsExpanded: {
        flexDirection: 'row',
        flex: 1,
        padding: 10
    },
    historyItem: {
        flexDirection: 'row',
        flex: 1,
        backgroundColor: 'white',
        elevation: 4,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowColor: 'black',
        borderRadius: 12,
        padding: 10,
        marginVertical: 4,
        marginHorizontal: 10,
    },
    historyText: {
        fontSize: 16,
        fontWeight: '500',
    },
    partOfSpeech: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10
    }
});
