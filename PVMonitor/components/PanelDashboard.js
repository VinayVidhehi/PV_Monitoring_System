import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; // Vector icons library
import Header from './Header';

const PanelDashboard = ({route}) => {
    const [data, setData] = useState([]);
    const [panel, setPanel] = useState(null);
    const [pMax, setPMax] = useState(null);
    const [latestEfficiency, setLatestEfficiency] = useState(null);
    const [daylight, setDaylight] = useState('');
    const [maintenanceAlerts, setMaintenanceAlerts] = useState([]);
    
    useEffect(() => {
        const fetchPanelName = async () => {
            const panelName = route.params.state.panel_name;
            const pmax = route.params.state.p_max;
            console.log("Panel name is, but here in the set functions:", panelName, typeof(panelName), pmax, typeof(pmax), route.params.state);
            setPanel(panelName);
            setPMax(pmax);
        };
    
        fetchPanelName();
    }, [route.params.state]);
    
    useEffect(() => {
        // Define the area of the solar panel (in square meters, for example)
        const panelArea = 0.0042; // Adjust this value based on your actual solar panel area
    
        // Function to fetch data from the server
        const fetchData = async () => {
            try {
                if (!panel) return; // Don't fetch data if panel is not set
    
                const response = await axios.get(`https://pv-monitoring-system.onrender.com/get-values?panel_name=${panel}`);
                //console.log(`https://pv-monitoring-system.onrender.com/get-values?panel_name=${panel}`);
                const {values} = response.data;
    
                // Calculate efficiency and determine maintenance needs
                const calculatedData = values.map((value, index) => {
                    const lux = value.luxValue;
                    const p = value.pValue;
    
                    // Calculate the power input (Lux * Area)
                    const powerInput = lux * panelArea;
    
                    // Calculate the efficiency
                    const efficiency = (p / powerInput) * 100;
    
                    // Maintenance check logic: if the lux is high and power output is significantly low
                    const maintenanceRequired = lux > 5000 && p < powerInput * 0.1; // Adjust threshold as needed
    
                    return {
                        index,
                        lux,
                        p,
                        pMax,
                        efficiency,
                        maintenanceRequired,
                    };
                });
    
                const latestData = calculatedData[calculatedData.length - 1];
                setLatestEfficiency(latestData.efficiency);
                setDaylight(determineDaylight(latestData.lux));
    
                // Set maintenance alerts
                const alerts = calculatedData.filter(item => item.maintenanceRequired);
                setMaintenanceAlerts(alerts);
    
                setData(calculatedData);
            } catch (error) {
                console.error("Error fetching panel data:", error);
                Alert.alert('Error', 'Failed to fetch panel data.');
            }
        };
    
        if (panel && pMax) {
            // Fetch data initially
            fetchData();
    
            // Set interval to fetch data every 5 seconds
            const interval = setInterval(() => {
                fetchData();
            }, 5000);
    
            // Cleanup interval on component unmount
            return () => clearInterval(interval);
        }
    }, [panel, pMax]);
    
    

    const determineDaylight = (lux) => {
        if (lux > 10000) return 'Sunny';
        if (lux > 1000) return 'Cloudy';
        return 'Dark';
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Efficiency: {item.efficiency.toFixed(2)}%</Text>
            <Text style={styles.itemText}>P Value: {item.p} W</Text>
            {item.maintenanceRequired && (
                <Icon name="exclamation-triangle" size={20} color="red" />
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.topSection}>
                <Text style={styles.efficiencyText}>Latest Efficiency: {latestEfficiency?.toFixed(2)}%</Text>
                <Text style={styles.daylightText}>Daylight: {daylight}</Text>
            </View>
            <FlatList
                inverted
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.index.toString()}
                style={styles.list}
            />
            <View style={styles.alertsContainer}>
                {maintenanceAlerts.length > 0 && (
                    <Text style={styles.alertsText}>
                        <Icon name="bell" size={20} color="orange" /> Maintenance Required
                    </Text>
                )}
            </View>
        </View>
    );
};

export default PanelDashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    topSection: {
        flex: 1 / 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    efficiencyText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    daylightText: {
        fontSize: 16,
        color: '#555',
    },
    list: {
        flex: 2 / 3,
    },
    itemContainer: {
        padding: 15,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    alertsContainer: {
        padding: 15,
        backgroundColor: '#fff3e0',
        borderTopWidth: 1,
        borderColor: '#f0f0f0',
        alignItems: 'center',
    },
    alertsText: {
        fontSize: 16,
        color: '#d9534f',
    },
});
