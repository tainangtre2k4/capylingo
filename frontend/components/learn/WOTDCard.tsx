import React, {useState} from 'react';
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

type Meaning = {
    partOfSpeech: string;
    definitions: { definition: string; example?: string }[];
};

type WordData = {
    word: string;
    phonetics: { audio: string }[];
    meanings: Meaning[];
};

const WOTDCard = ({word}: { word: string }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [data, setData] = useState<WordData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchWordData = async () => {
        if (!word.trim()) return;

        setLoading(true);
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        try {
            const response = await fetch(url);
            const fetchedData = await response.json();

            if (response.status === 200) {
                setData(fetchedData[0]);
                setError(null);
            } else {
                setError('Word not found in the database');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
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
                            <Text style={styles.label}>{word}</Text>
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
