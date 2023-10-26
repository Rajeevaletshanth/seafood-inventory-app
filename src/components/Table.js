import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import InputModal from './Modal';

function EditableTable({ fetchedData, modalVisible, loading, closed, setClosed, handleUpdateData,  setModalVisible, handleDeleteData, handleAddData, handleFetchData }) {
  const tableHead = ['Date', 'Octopus', 'Prawn', 'Fish'];
//   console.log(modalOp)

  const [tableData, setTableData] = useState([]);
  

  const closeModal = () => {
    setModalVisible(false);
    setClosed(true);
  };

  useEffect(() => {
    if (fetchedData) {
      setTableData(fetchedData);
    //   console.log(fetchedData)
    }
  }, [fetchedData]);

  const [selectedIndex, setSelectedIndex] = useState(null);

  const AddData = () => {
    setModalVisible(true)
    // handleDeleteData(date)
  };

  const deleteRow = (date, index) => {
    handleDeleteData(date)
    setSelectedIndex(index)
  }

  return (
    <View >
        <InputModal visible={modalVisible} onClose={closeModal} closed={closed} loading={loading} handleUpdateData={handleUpdateData} handleAddData={handleAddData} handleFetchData={handleFetchData} handleDeleteData={handleDeleteData}/>
      <Table borderStyle={{ borderWidth: 1, borderColor: '#f1f8ff'}}>
        <Row
          data={tableHead.map((cellData, colIndex) => (
            <Text key={colIndex} style={{ width: 120, textAlign: 'left', paddingLeft:5, fontWeight: 'bold' }}>
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
              <Text key={index} style={{ width: 120, textAlign: 'left', paddingLeft:5, fontWeight: 'bold' }}>
              {data.date}
            </Text>,
              
              data.octopus,
              data.prawn,
              data.fish,
              // <View style={{ flexDirection: 'col', padding:0.1, alignItems:'center' }}>
              //   <Button  disabled={selectedIndex === index && loading} color='red' title={"Del"} onPress={()=> deleteRow(data.date, index)} />
              // </View>
            ]}
            style={[
              { height: 60, backgroundColor: 'white', paddingTop: 5 },
            ]}
            textStyle={{ padding: 10 }}
          />
        ))}
      </Table>
    </View>
  );
}

export default EditableTable;
