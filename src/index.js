import { StyleSheet, View, Text, TextInput, Button, FlatList, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../config';
import { collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import EditableTable from './components/Table';
// import Calendar from './components/Calendar';
import moment from 'moment'
import DateTimeField from './components/DateTimePicker';


const getCurrentDate = () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
};


const FetchData = () => {
  
  const [date, setDate] = useState(moment.now());
  const [octopus, setOctopus] = useState(null);
  const [prawn, setPrawn] = useState(null);
  const [fish, setFish] = useState(null);
  const [fetchedData, setFetchedData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);

  const getAllStocksData = async () => {
    try {
      const stocksRef = collection(db, 'stocks');
      const querySnapshot = await getDocs(stocksRef);

      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      setFetchedData(data);
    } catch (error) {
      console.error('Error fetching all data from Firestore: ', error);
    }
  };
  
  const handleAddData = async (data) => {
    try {
      const collectionRef = collection(db, 'stocks');
      await addDoc(collectionRef, {
        date: data.date,
        octopus: data.octopus,
        prawn: data.prawn,
        fish: data.fish
      });

      getAllStocksData()

      console.log('Data added successfully!');
    } catch (error) {
      console.error('Error adding data to Firestore: ', error);
    }
  };

  const handleDeleteData = async (deleteDate) => {
    try {
      const stocksRef = collection(db, 'stocks');
      const q = query(stocksRef, where('date', '==', deleteDate));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        const docRef = doc.ref;
        await deleteDoc(docRef);
      });

      console.log('Data deleted successfully for date:', deleteDate);
      getAllStocksData();
    } catch (error) {
      console.error('Error deleting data from Firestore: ', error);
    }
  };

  const handleFetchData = async (date) => {
    try {
      const stocksRef = collection(db, 'stocks');
      const q = query(stocksRef, where('date', '==', date));
      const querySnapshot = await getDocs(q);

      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      // setFetchedData(data)
      return data;
    } catch (error) {
      return false;
    }
  };

 useEffect(() => {
  getAllStocksData();
 },[])

 const handleDate = async(val) => {
  setDate(val)
  console.log(await handleFetchData(val))
  
 }


  return (
    <View style={styles.container}>
      <Text>Seafood Inventory</Text>
      <View style={{marginTop:10, width:'90%'}}>
      <Text><DateTimeField 
        label={'Date'}
        mode={'date'}
        value={date}
        onChange={date => onChange(moment(date))}
        errorMessage={'dfdf'}
        containerStyle={styles.container}
      />  </Text>    
      </View>
      
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
      <Button title="Add Data" onPress={() => setModalVisible(true)} />
      <View style={{marginTop:10, width:'90%'}}>
        <EditableTable fetchedData={fetchedData} modalVisible={modalVisible} setModalVisible={setModalVisible} handleDeleteData={handleDeleteData} handleAddData={handleAddData} handleFetchData={handleFetchData}/>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    width: '80%',
  },
});

export default FetchData;
