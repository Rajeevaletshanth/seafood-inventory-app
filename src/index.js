import { StyleSheet, View, Text, Button, ActivityIndicator, TouchableOpacity} from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../config';
import { collection, addDoc, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import EditableTable from './components/Table';
import CustomButton from './components/CustomButton';
import { useToast } from "react-native-toast-notifications";


const FetchData = () => {
  const toast = useToast();
  const [fetchedData, setFetchedData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false)
  const [closed, setClosed] = useState(true);
  const [expClosed, setExpClosed] = useState(true);

  const [stock, setStock] = useState({
    octopus: 0,
    prawn: 0,
    fish: 0
  })

  const getAllStocksData = async () => {
    setFetchLoading(true)
    try {
      const stocksRef = collection(db, 'stocks');
      const querySnapshot = await getDocs(stocksRef);

      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      let octoCnt = 0; 
      let praCnt = 0; 
      let fisCnt = 0;
      if(data.length > 0){
        data.forEach((item) => {
          if(item.type === 'stock'){
            octoCnt += parseFloat(item.octopus);
            praCnt += parseFloat(item.prawn);
            fisCnt += parseFloat(item.fish);
          }
          // else{
          //   octoCnt -= parseFloat(item.octopus);
          //   praCnt -= parseFloat(item.prawn);
          //   fisCnt -= parseFloat(item.fish);
          // }
        })
      }
      setStock({
        octopus: octoCnt,
        prawn: praCnt,
        fish: fisCnt
      })
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
        fish: data.fish,
        type: data.type??'stock'
      });

      getAllStocksData()
      setLoading(false)
      toast.show('Data added successfully ')
    } catch (error) {
      setLoading(false)
      console.error('Error adding data to Firestore: ', error);
    }
  };

  const handleDeleteData = async (deleteDate) => {
    setLoading(true)
    try {
      const stocksRef = collection(db, 'stocks');
      const q = query(stocksRef, where('date', '==', deleteDate), where('type', '==', 'stock'));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        const docRef = doc.ref;
        await deleteDoc(docRef);
      });

      console.log('Data deleted successfully for date:', deleteDate);
      toast.show('Data deleted successfully ')
      getAllStocksData();
      setLoading(false)
      
    } catch (error) {
      setLoading(false)
      console.error('Error deleting data from Firestore: ', error);
    }
  };

  const deleteAll = async() => {
    try {
      const stocksRef = collection(db, 'stocks');
      const q = query(stocksRef);
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        const docRef = doc.ref;
        await deleteDoc(docRef);
      });

      toast.show('All Data deleted successfully ')
      getAllStocksData();
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('Error deleting data from Firestore: ', error);
    }
  }

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
      toast.show('Data updated successfully ')
      getAllStocksData();
      setLoading(false);
  
    } catch (error) {
      setLoading(false);
      console.error('Error updating data in Firestore: ', error);
    }
  };

  const handleMultipleUpdateData = async (updateDataArray) => {
    setLoading(true);
    try {
      const stocksRef = collection(db, 'stocks');
  
      for (const updateData of updateDataArray) {
        const { updateDate, newData } = updateData;
  
        const q = query(stocksRef, where('date', '==', updateDate));
        const querySnapshot = await getDocs(q);
  
        querySnapshot.forEach(async (doc) => {
          const docRef = doc.ref;
          await updateDoc(docRef, newData);
        });
  
        console.log('Data updated successfully for date:', updateDate);
      }
  
      toast.show('Data updated successfully');
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
      const q = query(stocksRef, where('date', '==', date), where('type', '==', 'stock'));
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
        <EditableTable fetchedData={fetchedData} stock={stock} modalVisible={modalVisible} handleMultipleUpdateData={handleMultipleUpdateData} exportModalVisible={exportModalVisible} loading={loading} setModalVisible={setModalVisible} setExportModalVisible={setExportModalVisible} closed={closed} setClosed={setClosed} expClosed={expClosed} setExpClosed={setExpClosed} handleUpdateData={handleUpdateData} handleDeleteData={handleDeleteData} handleAddData={handleAddData} handleFetchData={handleFetchData}/>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: 20 }}>
        <CustomButton title={'Refresh'} disabled={fetchLoading} onPress={() => getAllStocksData()}  bgcolor={'#ff6600'} />
        <CustomButton title={'Add Data'} onPress={() => {setModalVisible(true); setClosed(false);}}  />
        {fetchedData.length > 0 && <CustomButton title={'Export'} onPress={() => {setExportModalVisible(true); setExpClosed(false);}} />}
      </View>
      {fetchedData.length > 0 && <CustomButton title={'Delete All'} bgcolor={'#fafafa'} color={'black'} onPress={() => deleteAll()} />}
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
