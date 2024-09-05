import {Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useUser} from '@clerk/clerk-expo';
import {Ionicons} from '@expo/vector-icons'
import WOTDCard from '@/components/learn/WOTDCard';
import SubjectCard from '@/components/learn/SubjectCard';
import {StatusBar} from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const Learn = () => {
    const { user } = useUser();

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
                            <TouchableOpacity style={styles.searchButton}>
                                <Ionicons name='search-outline' size={18} color='white' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Image
                        source={require('../../../assets/images/learn/learn-greeter.png')}
                        style={styles.image}
                    />
                </View>
                <View style={styles.bodyContainer}>
                    {/*<View style={styles.indicator} />*/}
                    <Text style={styles.bodyTitle}>Your Learning Progress</Text>
                    <View style={styles.trackingCardsContainer}>
                        <WOTDCard />
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
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        flexDirection: 'row',
        paddingTop: 20
    },
    GreetingContainer: {
        paddingTop: height * .025,
        paddingBottom: height * .04

    },
    greeting: {
        fontSize: 18,
        fontWeight: '500',
        color: 'white',
        marginBottom: height * .02,
        marginHorizontal: 10
    },
    dictionaryLabel: {
        fontSize: 20,
        fontWeight: '700',
        color: 'white',
        marginBottom: height * .02,
        marginLeft: 10,
        marginRight: 30
    },
    searchBox: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        elevation: 4
    },
    searchButton: {
        backgroundColor: '#3DB2FF',
        padding: 4,
        borderRadius: 8
    },
    searchInput: {
        flexDirection: 'row',
        flex: 1,
        fontSize: 16,
        fontStyle: 'italic',
        paddingLeft: 8
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
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    // indicator: {
    //     width: width * .2,
    //     borderWidth: 2,
    //     borderColor: '#A2A7A9',
    //     alignSelf: 'center'
    // },
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
