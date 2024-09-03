import {Dimensions, Image, StatusBar as RNStatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import {useUser} from '@clerk/clerk-expo';
import {Ionicons} from '@expo/vector-icons'
import WOTDCard from '@/components/learn/WOTDCard';
import SubjectCard from '@/components/learn/SubjectCard';
import {StatusBar} from 'expo-status-bar';

const {width, height} = Dimensions.get('window')

const Learn = () => {
    const {user} = useUser();

    return (
        <>
            <StatusBar style='light' backgroundColor='#3DB2FF'/>
            <View style={styles.container}>
                <View style={styles.headBanner}>
                    <View style={styles.GreetingContainer}>
                        <Text style={styles.greeting}>Welcome, {user?.fullName} !</Text>
                        <Text style={styles.dictionaryLabel}>Capybara Dictionary</Text>
                        <View style={styles.searchBox}>
                            <TextInput style={styles.searchInput} placeholder='Quick Search'/>
                            <Ionicons name='search-outline' size={20} color='#3DB2FF'/>
                        </View>
                    </View>
                    <Image
                        source={require('../../../assets/images/learn/learn-greeter.png')}
                        style={styles.image}
                    />
                </View>
                <View style={styles.bodyContainer}>
                    <View style={styles.indicator}/>
                    <Text style={styles.bodyTitle}>Your Learning Progress</Text>
                    <View style={styles.trackingCardsContainer}>
                        <WOTDCard word='Fever'/>
                        <WOTDCard word='Fever'/>
                    </View>
                    <View style={styles.SubjectCardsContainer}>
                        <SubjectCard type='vocabulary'/>
                        <SubjectCard type='grammar'/>
                        <SubjectCard type='skillcheck'/>
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
