import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import InputModal from './Modal';

function EditableTable({ fetchedData, modalVisible, setModalVisible, handleDeleteData, handleAddData, handleFetchData }) {
  const tableHead = ['Date', 'Octopus', 'Prawn', 'Fish', 'Action'];
//   console.log(modalOp)

  const [tableData, setTableData] = useState([]);
  

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (fetchedData) {
      setTableData(fetchedData);
    //   console.log(fetchedData)
    }
  }, [fetchedData]);

  const [editableRow, setEditableRow] = useState(null);

  const AddData = () => {
    setModalVisible(true)
    // handleDeleteData(date)
  };

  const deleteRow = (date) => {
    handleDeleteData(date)
  }

  return (
    <View style={{backgroundColor:'red'}}>
        <InputModal visible={modalVisible} onClose={closeModal} handleAddData={handleAddData} handleFetchData={handleFetchData}/>
      <Table style={{backgroundColor:'red'}} borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
        <Row
          data={tableHead.map((cellData, colIndex) => (
            <Text key={colIndex} style={{ width: 100, textAlign: 'left', paddingLeft:5 }}>
              {cellData}
            </Text>
          ))}
          style={[
            { height: 40, backgroundColor: '#f1f8ff' },
          ]}
          textStyle={{ padding: 10 }}
        />
        {tableData.map((data, index) => (
          <Row
            key={index}
            data={[
              data.date,
              data.octopus,
              data.prawn,
              data.fish,
              <View style={{ flexDirection: 'row' }}>
              {/* <TouchableOpacity
                onPress={() => {
                  // Handle the edit action here
                  AddData()
                //   toggleEditRow(data.date);
                }}
                style={{ margin: 5 }}
              >
                <Text style={{ color: 'blue' }}>Edit</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => {
                  // Handle the delete action here
                  deleteRow(data.date)
                }}
                style={{ margin: 5 }}
              >
                <Text style={{ color: 'red' }}>Delete</Text>
              </TouchableOpacity>
            </View>
            ]}
            style={[
              { height: 40, backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' },
            ]}
            textStyle={{ padding: 10 }}
          />
        ))}
      </Table>
    </View>
  );
}

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

export default EditableTable;
