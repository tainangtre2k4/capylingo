import React, { createContext, useEffect, useState, Dispatch, SetStateAction } from 'react';
import { SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DictionaryContextType {
    history: string[];
    favorite: string[];
    setHistory: Dispatch<SetStateAction<string[]>>;
    setFavorite: Dispatch<SetStateAction<string[]>>;
}

const defaultContextValue: DictionaryContextType = {
    history: [],
    favorite: [],
    setHistory: () => {},
    setFavorite: () => {},
};

export const DictionaryContext = createContext<DictionaryContextType>(defaultContextValue);

const STORAGE_KEYS = {
    history: '@dictionary_history',
    favorite: '@dictionary_favorite',
};

const DictionaryStack = () => {
    const [history, setHistory] = useState<string[]>([]);
    const [favorite, setFavorite] = useState<string[]>([]);

    // Load saved data from AsyncStorage when the component mounts
    useEffect(() => {
        const loadPersistedData = async () => {
            try {
                const savedHistory = await AsyncStorage.getItem(STORAGE_KEYS.history);
                const savedFavorite = await AsyncStorage.getItem(STORAGE_KEYS.favorite);

                if (savedHistory) setHistory(JSON.parse(savedHistory));
                if (savedFavorite) setFavorite(JSON.parse(savedFavorite));
            } catch (error) {
                console.error('Failed to load data from storage', error);
            }
        };

        loadPersistedData();
    }, []);

    // Save history and favorite to AsyncStorage whenever they change
    useEffect(() => {
        const saveToStorage = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
                await AsyncStorage.setItem(STORAGE_KEYS.favorite, JSON.stringify(favorite));
            } catch (error) {
                console.error('Failed to save data to storage', error);
            }
        };

        saveToStorage();
    }, [history, favorite]);

    return (
        <DictionaryContext.Provider value={{ history, favorite, setHistory, setFavorite }}>
            <SafeAreaView style={{ flex: 1 }}>
                <Stack screenOptions={{ animation: 'none' }} />
            </SafeAreaView>
        </DictionaryContext.Provider>
    );
};

export default DictionaryStack;
