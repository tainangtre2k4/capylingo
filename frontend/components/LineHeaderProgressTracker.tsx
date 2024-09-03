import React, { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

const HeaderProgressTracker = ({ current, all }: { current: number, all: number }) => {
    const [progress, setProgress] = useState(0);
    const { width } = useWindowDimensions();

    useEffect(() => {
        // Calculate progress based on current and all values
        setProgress((current / all) * 100);
    }, [current, all]);

    return (
        <View style={styles.container}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
    );
};

export default HeaderProgressTracker;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
        height: 8,
        backgroundColor: '#E5E5E5',
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#3DB2FF',
    },
});
