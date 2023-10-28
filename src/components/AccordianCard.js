import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

const AccordionCard = ({ data, content, tableIndex, handleQuantityChange, updTableData, setUpdTableData }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleAccordion = () => {
    setExpanded(!expanded);
  };

  function capitalizeFirstLetter(str) {
    if (typeof str !== 'string' || str.length === 0) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  

  const renderInput = (type) => {
    return <View style={{ flexDirection: "row" }}>
    <Text style={{ marginTop: 13, width: "25%" }}>{capitalizeFirstLetter(type)}</Text>
    <TextInput
      style={styles.input}
      keyboardType="number-pad"
      placeholder={capitalizeFirstLetter(type)}
      value={`${updTableData[tableIndex][type]??''}`}
      onChangeText={(cnt) => {
        if (!isNaN(cnt)) {
            handleQuantityChange(parseFloat(cnt) < data[type] ? parseFloat(cnt) : cnt? data[type]: '' , tableIndex, type)
        }
        
      }}
    />
    <View style={{ marginTop: 10, marginBottom:13, borderRadius: 10, padding:3, width: "35%", borderWidth:2, borderColor: 'red' }}>
        <Text style={{textAlign:'center', color: 'red'}}>Max - {data[type]}</Text>
    </View>
  </View>
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={toggleAccordion} style={styles.header}>
        <Text style={styles.title}>{data.date}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>

          {renderInput('octopus')}
          {renderInput('prawn')}
          {renderInput('fish')}
          

        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    margin: 0,
    borderRadius: 5,
    overflow: "hidden",
  },
  header: {
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    padding: 10,
  },
  input: {
        height: 30,
        borderColor: 'gray',
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        padding: 5,
        width: '30%',
    },
});

export default AccordionCard;
