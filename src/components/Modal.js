import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet, TextInput } from 'react-native';
import DateTimeField from './DateTimePicker';
import moment from 'moment';
import CustomButton from './CustomButton';

const InputModal = ({ visible, onClose, loading, closed, handleAddData, handleUpdateData, handleFetchData, handleDeleteData }) => {
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
            fish: fish??0
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

    const deleteData = async(date) => {
        await handleDeleteData(convertDateFormat(date));
        setDate(moment.now())
        setOctopus(null);
        setPrawn(null);
        setFish(null);
        onClose();
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

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.heading}>Add/Update Stock</Text>
                    <Text>
                        <DateTimeField
                            mode={'date'}
                            value={date}
                            onChange={date => handleDateChange(date)}
                            containerStyle={styles.input}
                        />
                    </Text>
                    {!checking && exist && !toUpdate? <>
                        <Text style={styles.subtitle}>Octopus : {octopus}</Text>
                        <Text style={styles.subtitle}>Prawn : {prawn}</Text>
                        <Text style={styles.subtitle}>Fish : {fish}</Text>
                    </> : !checking ? <>
                    <TextInput
                        style={styles.input}
                        keyboardType='number-pad'
                        placeholder="Octopus"
                        // value={octopus}
                        onChangeText={(cnt) => {
                            if (!isNaN(cnt)) {
                                setOctopus(parseFloat(cnt));
                            }
                        }}
                    />
                    <TextInput
                        style={styles.input}
                        keyboardType='number-pad'
                        placeholder="Prawn"
                        // value={prawn}
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
                        // value={fish}
                        onChangeText={(cnt) => {
                            if (!isNaN(cnt)) {
                                setFish(parseFloat(cnt));
                            }
                        }}
                    /></>:<></>}
                    <View style={{ flexDirection: 'row',  marginTop: 20 }}>
                        {exist && !toUpdate ? <CustomButton title={"Update"} onPress={() => setToUpdate(true)}/> :
                        <CustomButton disabled={loading} title={toUpdate? loading? 'Updating...' : 'Update' : loading? "Saving..." : "Save"} onPress={() => toUpdate? updateData(date) : saveData()}/>}
                        <CustomButton disabled={loading} bgcolor={'red'} title={loading? "Removing..." : "Remove"} onPress={() => deleteData(date)}/>
                        <CustomButton title={"Close"} bgcolor={'black'} onPress={onClose} style={{ marginHorizontal: 10 }}/>
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
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        padding: 10,
        width: '80%',
    },
});



export default InputModal;
