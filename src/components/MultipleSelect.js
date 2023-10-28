import { MultipleSelectList } from "react-native-dropdown-select-list";
import React, { useEffect, useState } from "react";
import { Text, StyleSheet, TextInput, View } from "react-native";
import { Table, Row } from 'react-native-table-component';
import AccordionCard from "./AccordianCard";

const MultiSelect = ({ fetchedData, selected, tableData, updTableData, setUpdTableData, setTableData, setSelected }) => {
  const [data, setData] = useState([]);
  const tableHead = ['Date', 'Octopus', 'Prawn', 'Fish'];
  

  useEffect(() => {
    setData([]);
    if (fetchedData) {
      fetchedData.forEach((item, key) => {
        setData((s) => [
          ...s,
          {
            key: `${key + 1}`,
            value: item.date,
          },
        ]);
      });
    }
  }, [fetchedData]);

  useEffect(() => {
    let selectedIndex = 0;
    let selectedArr = [];
    if (fetchedData) {
      fetchedData.forEach((item, key) => {
        if (selected.includes(item.date) && item.type === 'stock') {
          selectedArr[selectedIndex] = item;
          selectedIndex++;
        }
      });
    }
    let updArr = [];
    if(selected){
        selected.map((item, key) => {
            let tempRow = updTableData.length>0? updTableData[key]??null:null;
            updArr[key] = {
                date: item,
                octopus: tempRow?tempRow.octopus : 0,
                prawn: tempRow?tempRow.prawn: 0,
                fish: tempRow?tempRow.fish: 0,
                type: tempRow?tempRow.type: 'stock',
            }
        })
    }
    setUpdTableData(updArr);
    setTableData(selectedArr);
  }, [selected]);

  const handleQuantityChange = (value, rowIndex, columnName) => {
    setUpdTableData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex][columnName] = value;
      return newData;
    });
  };

  return (
    <>
      <MultipleSelectList
        setSelected={(val) => setSelected(val)}
        data={data}
        save="value"
        label="Export Date/Dates"
        placeholder="Select Date/Dates"
      />
      
      {tableData.map((item, key) => {
        return <>
        <View style={{paddingTop:8}} />
        <AccordionCard data={item} tableIndex={key} updTableData={updTableData} setUpdTableData={setUpdTableData} handleQuantityChange={handleQuantityChange}/>
        </>
      })}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 80,
    padding: 5,
    backgroundColor: 'white',
  },
});

export default MultiSelect;
