import { StyleSheet, View, Text, Button, ActivityIndicator, TouchableOpacity} from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../config';
import { collection, addDoc, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import EditableTable from './components/Table';
import CustomButton from './components/CustomButton';

const FetchData = () => {

  const [fetchedData, setFetchedData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false)
  const [closed, setClosed] = useState(true);

  const getAllStocksData = async () => {
    setFetchLoading(true)
    try {
      const stocksRef = collection(db, 'stocks');
      const querySnapshot = await getDocs(stocksRef);

      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      setFetchedData(data);
      setFetchLoading(false)
    } catch (error) {
      setFetchedData([]);
      setFetchLoading(false)
      console.error('Error fetching all data from Firestore: ', error);
    }
  };
  
  const handleAddData = async (data) => {
    setLoading(true)
    try {
      const collectionRef = collection(db, 'stocks');
      await addDoc(collectionRef, {
        date: data.date,
        octopus: data.octopus,
        prawn: data.prawn,
        fish: data.fish
      });

      getAllStocksData()
      setLoading(false)
      console.log('Data added successfully!');
    } catch (error) {
      setLoading(false)
      console.error('Error adding data to Firestore: ', error);
    }
  };

  const handleDeleteData = async (deleteDate) => {
    setLoading(true)
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
      setLoading(false)
      
    } catch (error) {
      setLoading(false)
      console.error('Error deleting data from Firestore: ', error);
    }
  };

  const handleUpdateData = async (updateDate, newData) => {
    setLoading(true);
  
    try {
      const stocksRef = collection(db, 'stocks');
      const q = query(stocksRef, where('date', '==', updateDate));
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach(async (doc) => {
        const docRef = doc.ref;
        await updateDoc(docRef, newData);
      });
  
      console.log('Data updated successfully for date:', updateDate);
  
      getAllStocksData();
      setLoading(false);
  
    } catch (error) {
      setLoading(false);
      console.error('Error updating data in Firestore: ', error);
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



  return (
    fetchedData === null ? 
    <View style={styles.container}>
      <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />
    </View> :
    <View style={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>      
      <View style={{marginBottom:10, marginTop: 10, width:'90%'}}>
        <EditableTable fetchedData={fetchedData} modalVisible={modalVisible} loading={loading} setModalVisible={setModalVisible} closed={closed} setClosed={setClosed} handleUpdateData={handleUpdateData} handleDeleteData={handleDeleteData} handleAddData={handleAddData} handleFetchData={handleFetchData}/>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <CustomButton title={'Refresh'} disabled={fetchLoading} onPress={() => getAllStocksData()}  bgcolor={'#ff6600'} />
        <CustomButton title={'Add Data'} onPress={() => {setModalVisible(true); setClosed(false);}}  />
        <CustomButton title={'Export'} onPress={() => {}} />
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
  heading: {
    marginTop: 50,
    fontSize: 25,
    fontWeight: 'bold'
  },
  loading: {
    marginTop: '100%'
  }
});

export default FetchData;
