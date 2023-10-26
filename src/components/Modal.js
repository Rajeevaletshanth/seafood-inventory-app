import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet, TextInput } from 'react-native';
import DateTimeField from './DateTimePicker';
import moment from 'moment';

const InputModal = ({ visible, onClose, handleAddData, handleFetchData }) => {
    const [date, setDate] = useState(moment.now());
    const [octopus, setOctopus] = useState(null);
    const [prawn, setPrawn] = useState(null);
    const [fish, setFish] = useState(null);

    useEffect(() => {
        console.log(date)
    }, [date])

    const handleDateChange = async (date) => {
        setDate(moment(date));
        const data = await handleFetchData(convertDateFormat(moment(date)));
        if(data.length > 0){
            console.log(data)
        }
    }

    const saveData = async() => {
        const data = {
            date : convertDateFormat(date),
            octopus: octopus,
            prawn: prawn,
            fish: fish
        }
        await handleAddData(data)
        onClose();
    }

    const convertDateFormat = (dateString) => {
        // Parse the input date string
        const date = new Date(dateString);

        // Get the day, month, and year components
        const day = date.getDate();
        const month = date.getMonth() + 1; // Month is 0-based, so add 1
        const year = date.getFullYear();

        // Create the formatted date string
        const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

        return formattedDate;
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text>Modal Content Goes Here</Text>
                    <Text>
                        <DateTimeField
                            label={'Date'}
                            mode={'date'}
                            value={date}
                            onChange={date => handleDateChange(date)}
                            // errorMessage={'dfdf'}
                            containerStyle={styles.container}
                        />
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Date"
                        value={date}
                        onChangeText={(val) => handleDate(val)}
                    />
                    <TextInput
                        style={styles.input}
                        keyboardType='number-pad'
                        placeholder="Octopus"
                        value={octopus}
                        onChangeText={(cnt) => {
                            if (!isNaN(cnt)) {
                                setOctopus(parseFloat(cnt));
                            }
                        }}
                    />
                    <TextInput
                        style={styles.input}
                        keyboardType='number-pad' // 'number-pad' is another option to show the numeric keyboard
                        placeholder="Prawn"
                        value={prawn} // Ensure the input value is always a string
                        onChangeText={(cnt) => {
                            if (!isNaN(cnt)) {
                                setPrawn(parseFloat(cnt));
                            }
                        }}
                    />
                    <TextInput
                        style={styles.input}
                        keyboardType='number-pad'
                        placeholder="Fish"
                        value={fish}
                        onChangeText={(cnt) => {
                            if (!isNaN(cnt)) {
                                setFish(parseFloat(cnt));
                            }
                        }}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Button title="Save" onPress={saveData} style={{ marginHorizontal: 10 }} />
                        <Button title="Close" color={'red'} onPress={onClose} style={{ marginHorizontal: 10 }} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
});



export default InputModal;
