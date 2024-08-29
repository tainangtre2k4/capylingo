import React, {createContext, useState} from 'react'
import { Stack } from 'expo-router'
import {StatusBar} from 'expo-status-bar';
import {passages} from "@/app/(auth)/learn/skillcheck/reading/Resources";

export interface ReadingContextType {
    curIndex: number;
    maxIndex: number;
    passage: {html: string};
    prevPassage: () => void;
    nextPassage: () => void;
}

const defaultContextValue: ReadingContextType = {
    curIndex: 0,
    maxIndex: 2,
    passage: passages[0],
    prevPassage: () => {},
    nextPassage: () => {},
};

export const ReadingContext = createContext<ReadingContextType>(defaultContextValue);

const SkillCheckReadingStack = () => {
    const [currentPassageIndex, setCurrentPassageIndex] = useState(0);

    const nextPassage = () => {
        setCurrentPassageIndex((index) => Math.min(index + 1, passages.length - 1));
    };

    const prevPassage = () => {
        setCurrentPassageIndex((index) => Math.max(index - 1, 0));
    };

    return (
    <ReadingContext.Provider value={{curIndex: currentPassageIndex, maxIndex: passages.length - 1, passage: passages[currentPassageIndex], prevPassage, nextPassage }}>
        <StatusBar style='dark' backgroundColor='white' />
        <Stack />
    </ReadingContext.Provider>


  )
}

export default SkillCheckReadingStack
