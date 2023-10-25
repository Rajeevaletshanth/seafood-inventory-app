import { StyleSheet, View, Text, TextInput, Button, FlatList, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';


const getCurrentDate = () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
};


const FetchData = () => {
  
  const [date, setDate] = useState(getCurrentDate());
  const [octopus, setOctopus] = useState(null);
  const [prawn, setPrawn] = useState(null);
  const [fish, setFish] = useState(null);
  const [fetchedData, setFetchedData] = useState([]);
  
  const handleAddData = async () => {
    try {
      const collectionRef = collection(db, 'stocks');
      await addDoc(collectionRef, {
        date: date,
        octopus: octopus,
        prawn: prawn,
        fish: fish
      });

      setDate(getCurrentDate());
      setOctopus(null);
      setPrawn(null);
      setFish(null);

      console.log('Data added successfully!');
    } catch (error) {
      console.error('Error adding data to Firestore: ', error);
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
  console.log(fetchedData)
 },[fetchedData])

 const handleDate = async(val) => {
  setDate(val)
  console.log(await handleFetchData(val))
  
 }


  return (
    <View style={styles.container}>
      <Text>Add Data to Firestore</Text>
      <TextInput
        style={styles.input}
        placeholder="Date"
        value={date}
        onChangeText={(val) => handleDate(val)}
      />
      <TextInput
        style={styles.input}
        keyboardType='number'
        placeholder="Octopus"
        value={octopus}
        onChangeText={(cnt) => setOctopus(Number(cnt))}
      />
      <TextInput
        style={styles.input}
        keyboardType='number'
        placeholder="Prawn"
        value={prawn}
        onChangeText={(cnt) => setPrawn(Number(cnt))}
      />
      <TextInput
        style={styles.input}
        keyboardType='number'
        placeholder="Fish"
        value={fish}
        onChangeText={(cnt) => setFish(Number(cnt))}
      />
      <Button title="Add Data" onPress={handleAddData} />
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
