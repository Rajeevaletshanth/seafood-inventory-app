import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet, TextInput } from 'react-native';
import DateTimeField from './DateTimePicker';
import moment from 'moment';
import { Table, Row } from 'react-native-table-component';
import CustomButton from './CustomButton';
import CloseIcon from './IconButton';

const ExportModal = ({ visible, onClose, stock, loading, closed, handleAddData, handleUpdateData, handleFetchData, handleDeleteData }) => {
    const [date, setDate] = useState(moment.now());
    const [octopus, setOctopus] = useState(null);
    const [prawn, setPrawn] = useState(null);
    const [fish, setFish] = useState(null);
    const [checking, setChecking] = useState(true);
    const [exist, setExist] = useState(false);
    const [toUpdate, setToUpdate] = useState(false);

    const handleDateChange = async (date) => {
        setDate(moment(date));
        setChecking(true)
        setToUpdate(false)
        setExist(false)
        const data = await handleFetchData(convertDateFormat(moment(date)));
        if(data.length > 0){
            setOctopus(`${data[0].octopus}`)
            setPrawn(`${data[0].prawn}`)
            setFish(`${data[0].fish}`)
            setExist(true)
        }else{
            setOctopus(null)
            setPrawn(null)
            setFish(null)
            setExist(false)
        }
        setChecking(false)
    }

    const saveData = async() => {
        const data = {
            date : convertDateFormat(date),
            octopus: octopus??0,
            prawn: prawn??0,
            fish: fish??0,
            type: 'export'
        }
        await handleAddData(data)
        setDate(moment.now())
        setOctopus(null);
        setPrawn(null);
        setFish(null);
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

    const updateData = async(date) => {
        const data = {
            date : convertDateFormat(date),
            octopus: octopus??0,
            prawn: prawn??0,
            fish: fish??0
        }
        await handleUpdateData(convertDateFormat(date), data);
        setDate(moment.now())
        setOctopus(null);
        setPrawn(null);
        setFish(null);
        onClose();
    }

    useEffect(() => {
        handleDateChange();
    },[closed])

    const renderRowText = (text, header = false) => {
        return <Text style={{ width: 120, textAlign: 'center', padding:5, fontWeight: 'bold', backgroundColor: header? '#f1f8ff' : 'white' }}>{text}</Text>
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
                    <CloseIcon onPress={onClose} style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 1,
                    }}/>
                    <Text style={styles.heading}>Export Stock</Text>
                    <Text>
                        <DateTimeField
                            mode={'date'}
                            value={date}
                            onChange={date => handleDateChange(date)}
                            containerStyle={styles.input}
                        />
                    </Text>
                    
                    <View style={{paddingTop:5}}/>
                    
                    <View style={{ flexDirection: 'row',  marginTop: 20 }}>
                        <Text style={{marginTop:13, width: '25%'}}>Octopus</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType='number-pad'
                            placeholder="Octopus"
                            value={`${octopus??''}`}
                            onChangeText={(cnt) => {
                                if (!isNaN(cnt)) {
                                    setOctopus(parseFloat(cnt) < stock.octopus ? parseFloat(cnt) : cnt? stock.octopus: '');
                                }
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{marginTop:13, width: '25%'}}>Prawn</Text>
                        <TextInput
                        style={styles.input}
                        keyboardType='number-pad'
                        placeholder="Prawn"
                        value={`${prawn??''}`}
                            onChangeText={(cnt) => {
                                if (!isNaN(cnt)) {
                                    setPrawn(parseFloat(cnt) < stock.prawn ? parseFloat(cnt) : cnt? stock.prawn: '');
                                }
                            }}
                    />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{marginTop:13, width: '25%'}}>Fish</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType='number-pad'
                            placeholder="Fish"
                            value={`${fish??''}`}
                            onChangeText={(cnt) => {
                                if (!isNaN(cnt)) {
                                    setFish(parseFloat(cnt) < stock.fish ? parseFloat(cnt) : cnt? stock.fish: '');
                                }
                            }}
                        />
                    </View>

                    <View style={{ flexDirection: 'row',  marginTop: 20 }}>
                        <CustomButton title={"Export"} onPress={() => saveData()}/>
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
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    heading: {
        marginTop: 5,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    subtitle: {
        marginTop: 3,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    input: {
        height: 30,
        borderColor: 'gray',
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        padding: 5,
        width: '40%',
    },
});



export default ExportModal;
