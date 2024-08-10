import { View, Text, StyleSheet, TextInput, Image } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons'
import WOTDCard from '@/components/learn/WOTDCard';
import SubjectCard from '@/components/learn/SubjectCard';
import { StatusBar } from 'expo-status-bar';

const Learn = () => {
  const { user } = useUser();

  return (
    <>
      <StatusBar style='light' backgroundColor='#3DB2FF' />
      <View style={styles.container}>
        <View style={styles.headBanner}>
          <View style={styles.dictionaryContainer}>
            <View style={styles.GreetingContainer}>
              <Text style={styles.greeting}>Welcome, {user?.fullName} !</Text>
              <Text style={styles.dictionaryLabel}>Capybara Dictionary</Text>
              <View style={styles.searchBox}>
                <TextInput style={styles.searchInput} placeholder='Quick Search' />
                <Ionicons name='search-outline' size={18} />
              </View>
            </View>
            <Image
              source={require('../../../assets/images/learn/learn-greeter.png')}
              style={styles.image}
            />
          </View>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.indicator} />
          <Text style={styles.bodyTitle}>Your Learning Progress</Text>
          <View style={styles.trackingCardsContainer}>
            <WOTDCard word='Fever' />
            <WOTDCard word='Fever' />
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
    paddingTop: 30,
    justifyContent: 'center',
  },
  GreetingContainer: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    marginBottom: 20
  },
  dictionaryContainer: {
    flexDirection: 'row',
  },
  dictionaryLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 14
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    elevation: 4
  },
  searchInput: {
    width: 160,
    fontSize: 14,
    fontStyle: 'italic'
  },
  image: {
    marginTop: 20,
    width: 130,
    height: 130
  },
  bodyContainer: {
    flex: 1,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  indicator: {
    width: 100,
    borderWidth: 2,
    borderColor: '#A2A7A9',
    alignSelf: 'center'
  },
  bodyTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 16,
    alignSelf: 'center'
  },
  trackingCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  SubjectCardsContainer: {
    flex: 1,
    marginVertical: 30,
    justifyContent: 'space-between',
  }
})
