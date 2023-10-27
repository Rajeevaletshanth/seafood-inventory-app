import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can choose a different icon library or use a custom icon.

const CloseIcon = ({ onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Icon name="times" size={30} color="#666666" />
    </TouchableOpacity>
  );
};

export default CloseIcon;
