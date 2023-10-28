import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import InputModal from './AddModal';
import ExportModal from './ExportModal';

function EditableTable({ fetchedData, stock, modalVisible, handleMultipleUpdateData, exportModalVisible, setExportModalVisible, loading, closed, setClosed, expClosed, setExpClosed, handleUpdateData,  setModalVisible, handleDeleteData, handleAddData, handleFetchData }) {
  const tableHead = ['Date', 'Octopus', 'Prawn', 'Fish'];
//   console.log(modalOp)

  const [tableData, setTableData] = useState([]);
  const [exportTableData, setExportTableData] = useState([]);
  const [expTableData, setExpTableData] = useState([]);
  const [options, setOptions] = useState([])

  const closeModal = () => {
    setModalVisible(false);
    setClosed(true);
  };

  const closeExpModal = () => {
    setExportModalVisible(false);
    setExpClosed(true);
    setExpTableData([])
  };

  useEffect(() => {
    if (fetchedData) {
      setTableData(fetchedData);
      let stockData = [];
      let stockKey = 0;
      let exportData = [];
      let exportKey = 0;

      let optArr = [];
      let optInd = 0;
      fetchedData.map((item) => {
        if(item.type === 'stock'){          
          stockData[stockKey] = item
          stockKey++;
        }else{
          exportData[exportKey] = item
          exportKey++;
        }

        if(item.octopus !== 0 || item.fish !== 0 || item.prawn !== 0){
          optArr[optInd] = item
          optInd++;
        }
      })
      setTableData(stockData)
      setExportTableData(exportData)   
      setOptions(optArr)
    }
  }, [fetchedData]);

  const renderRowText = (text, header = false) => {
    return <Text style={{ width: 120, textAlign: 'center', padding:5, fontWeight: 'bold', backgroundColor: header? '#f1f8ff' : 'white' }}>{text}</Text>
  }

  return (
    <View >
        <ExportModal fetchedData={options} tableData={expTableData} handleMultipleUpdateData={handleMultipleUpdateData} setTableData={setExpTableData} visible={exportModalVisible} onClose={closeExpModal}  stock={stock} closed={expClosed} loading={loading} handleAddData={handleAddData}/>
        <InputModal visible={modalVisible} onClose={closeModal} stock={stock} closed={closed} loading={loading} handleUpdateData={handleUpdateData} handleAddData={handleAddData} handleFetchData={handleFetchData} handleDeleteData={handleDeleteData}/>
      <Text style={{fontWeight:'bold', textAlign:'center',}}>Stock Table</Text>
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
          data.octopus === 0 && data.prawn === 0 && data.fish === 0 ? <></> : <Row
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
      <View style={{paddingBottom:20}} />
      {exportTableData.length > 0 && <Text style={{fontWeight:'bold', textAlign:'center',}}>Export Table</Text>}
      {exportTableData.length > 0 && <Table borderStyle={{ borderWidth: 1, borderColor: '#f1f8ff'}}>
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
        {exportTableData.map((data, index) => (
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
      </Table>}

      <View style={{paddingBottom:20}} />
      <Text style={{fontWeight:'bold', textAlign:'center',}}>Remaining Stock</Text>
      <Table  borderStyle={{ borderWidth: 1, borderColor: '#f1f8ff'}}>
        <Row 
          data={[
            renderRowText('Octopus', true),renderRowText('Prawn', true),renderRowText('Fish', true)
          ]}
        />
        <Row 
          data={[
            renderRowText(stock.octopus),renderRowText(stock.prawn),renderRowText(stock.fish)
          ]}
        />
      </Table>
      <View style={{paddingBottom:20}} />
    </View>
  );
}

export default EditableTable;
