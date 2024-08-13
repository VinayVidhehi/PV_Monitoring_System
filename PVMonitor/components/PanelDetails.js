import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const PanelDetails = () => {
    const [panelName, setPanelName] = useState('');
    const [imax, setImax] = useState('');
    const [vmax, setVmax] = useState('');

    const navigation = useNavigation();

    const handleSubmit = async () => {
        if (!panelName || !imax || !vmax) {
            Alert.alert('Validation Error', 'All fields are required.');
            return;
        }

        try {
            const response = await axios.post('https://pv-monitoring-system.onrender.com/panel-details', {
                panel_name: panelName,
                i_max:imax,
                v_max:vmax,
            });

            if (response.data.key === 1) {
                const panels = await AsyncStorage.getItem('panels');
                const parsedPanels = JSON.parse(panels);
                const newPanel = {
                    panel_name:panelName,
                    i_max:imax,
                    v_max:vmax,
                    p_max:imax*vmax,
                }
                const updatedPanels = [...parsedPanels || [], newPanel]
                await AsyncStorage.setItem('panels', JSON.stringify(updatedPanels))
                Alert.alert('Success', 'Panel details submitted successfully.');
                navigation.goBack(); // Navigate back after successful submission
            } else {
                Alert.alert('Error', 'Failed to submit panel details.');
            }
        } catch (error) {
            console.error("Error submitting panel details:", error);
            Alert.alert('Error', 'An error occurred while submitting the details.');
        }
    };

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.form}>
                <Text style={styles.label}>Panel Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter panel name"
                    value={panelName}
                    onChangeText={setPanelName}
                />

                <Text style={styles.label}>I Max (A)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter max current in Amperes"
                    value={imax}
                    onChangeText={setImax}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>V Max (V)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter max voltage in Volts"
                    value={vmax}
                    onChangeText={setVmax}
                    keyboardType="numeric"
                />

                <Button title="Submit" onPress={handleSubmit} />
            </View>
        </View>
    );
};

export default PanelDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    form: {
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
    },
});
