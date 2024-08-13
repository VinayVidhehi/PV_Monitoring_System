import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';

const ChoosePanel = () => {
    const [panels, setPanels] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchPanels = async () => {
           // await AsyncStorage.clear();
            try {
                const storedPanels = await AsyncStorage.getItem('panels');
                if (storedPanels !== null) {
                    setPanels(JSON.parse(storedPanels));
                }
            } catch (error) {
                console.error("Error fetching panels from AsyncStorage:", error);
            }
        };

        fetchPanels();
    }, []);

    const renderPanel = ({ item }) => (
        <TouchableOpacity
            style={styles.panelItem}
            onPress={() => navigation.navigate('Paneldashboard', { state: { panel_name: item.panel_name, p_max: item.p_max } })}
        >
            <Text style={styles.panelName}>{item.panel_name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.content}>
                {panels.length > 0 ? (
                    <>
                    <Text style={{color:"#777", fontSize:18, textAlign:'center', fontFamily:'sans-serif', paddingBottom:6}}> List of Panels</Text>
                    <FlatList
                        data={panels}
                        renderItem={renderPanel}
                        keyExtractor={(item) => item.panel_id}
                    />
                    </>
                ) : (
                    <Text style={styles.noPanelsText}>
                        No panels found. Try adding a new panel.
                    </Text>
                )}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('Paneldetails')}
                >
                    <Text style={styles.addButtonText}>+ Add Panel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChoosePanel;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:20
    },
    content: {
        flex: 1,
        padding: 20,
    },
    panelItem: {
        backgroundColor: '#0A84FF', // Primary color for button
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        elevation: 3, // For shadow on Android
        shadowColor: '#000', // For shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
    },
    panelName: {
        color: '#eee', // White text color for contrast
        fontSize: 18,
        fontWeight: 'semibold',
    },
    noPanelsText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
    },
    addButton: {
        padding: 15,
        backgroundColor: '#007bff',
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        fontSize: 16,
        color: '#fff',
    },
});
