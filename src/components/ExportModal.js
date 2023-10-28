import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet, TextInput, ScrollView } from 'react-native';
import DateTimeField from './DateTimePicker';
import moment from 'moment';
import { Table, Row } from 'react-native-table-component';
import CustomButton from './CustomButton';
import CloseIcon from './IconButton';
import { useToast } from "react-native-toast-notifications";
import MultiSelect from './MultipleSelect';

const ExportModal = ({ fetchedData, visible, onClose, tableData, setTableData, handleMultipleUpdateData, stock, loading, closed, handleAddData, handleUpdateData, handleFetchData, handleDeleteData }) => {
    const [date, setDate] = useState(moment.now());
    const [octopus, setOctopus] = useState(null);
    const [prawn, setPrawn] = useState(null);
    const [fish, setFish] = useState(null);
    const [updTableData, setUpdTableData] = useState([]);

    const [selected, setSelected] = useState([]);

    const toast = useToast();

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
        let updateData = [];
        let updIndex = 0;

        if(fetchedData){
            fetchedData.map((item, key) => {
                updTableData.map((updItem, updKey) => {
                    if(item.date === updItem.date){
                        updateData[updIndex] = {
                            updateDate: item.date,
                            newData: {
                                date: item.date,
                                octopus: item.octopus - updItem.octopus,
                                prawn: item.prawn - updItem.prawn,
                                fish: item.fish - updItem.fish,
                                type: item.type
                            }
                        }
                        updIndex++;
                    }
                })
            })
        }
        // console.log(updateData)
        handleMultipleUpdateData(updateData)
        // if((octopus === 0 || !octopus) && (prawn === 0 || !prawn) && (prawn === 0 || !prawn)){
        //     toast.show('Cannot export empty stock');
        // }else{
        //     const data = {
        //         date : convertDateFormat(date),
        //         octopus: octopus??0,
        //         prawn: prawn??0,
        //         fish: fish??0,
        //         type: 'export'
        //     }
        //     await handleAddData(data)
        //     setDate(moment.now())
        //     setOctopus(null);
        //     setPrawn(null);
        //     setFish(null);
        //     onClose();
        // }
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
        setSelected([])
        handleDateChange();
        setTableData([])
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
                    <CloseIcon onPress={onClose} style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 1,
                    }}/>
                    <Text style={styles.heading}>Export Stock</Text>
                    <ScrollView style={{width:'100%', maxHeight:'80%'}} >
                        
                        <MultiSelect fetchedData={fetchedData} selected={selected} updTableData={updTableData} setUpdTableData={setUpdTableData} tableData={tableData} setTableData={setTableData} setSelected={setSelected}/>
                    </ScrollView>

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
