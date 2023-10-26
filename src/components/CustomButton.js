import { Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomButton = ({bgcolor, title, onPress, color, disabled=false}) => {
  return (
    <TouchableOpacity style={{
        backgroundColor: bgcolor ?? '#0000ff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginHorizontal: 10,
    }}
    disabled={disabled}
    onPress={onPress}>
          <Text style={{
            color: color?? 'white'
          }}>{title??'Button'}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton