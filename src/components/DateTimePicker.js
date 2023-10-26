import RNDateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import React, {useEffect, useState, useCallback} from 'react'
import {SafeAreaView, Text, TouchableWithoutFeedback, View} from 'react-native'

const DateTimeField = props => {
  const {label, containerStyle, mode, onChange, errorMessage, value, style} = props

  const [dateLabel, setDateLabel] = useState('')
  const [dateValue, setDateValue] = useState(
    value ? new Date(value).getTime() : new Date().getTime(),
  )
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => {
    setDateLabel(getDisplayValue(value))
  }, [value])

  const getDisplayValue = useCallback(
    dateValueToCheck => {
      if (!dateValueToCheck) {
        return ''
      }
      if (mode === 'date') {
        return moment(dateValueToCheck).format('DD MMM YYYY')
      } else {
        return moment(dateValueToCheck).format('hh:mm A');
      }
    },
    [mode],
  )

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setShowPicker(true)
      }} >
      <View >
        {label ? (
          <View
            style={{
              marginBottom: label ? 5 : 0,
            }}>
            <Text>{label}</Text>
          </View>
        ) : null}

        <View
          style={{
            paddingVertical: 5,
            paddingLeft: 15,
            paddingRight: 10,
            justifyContent: 'flex-start',
            // borderWidth: 1,
            borderRadius: 8,
            backgroundColor: 'blue',
            height: 40,
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
          <View style={{flex: 1}}>
            {dateLabel ? (
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontWeight: 'bold'
                }}>
                {dateLabel}
              </Text>
            ) : (
              <Text>Select Date</Text>
            )}
          </View>
          

          {showPicker ? (
            <SafeAreaView>
              <RNDateTimePicker
                is24Hour={false} 
                display={'default'}
                mode={mode}
                value={new Date(dateValue)}
                onChange={event => {
                  setShowPicker(false)
                  if (event.type === 'set') {
                    if (event.nativeEvent.timestamp === 0) {
                      event.nativeEvent.timestamp = new Date().getTime()
                    }

                    setDateValue(event.nativeEvent.timestamp)
                    setDateLabel(getDisplayValue(event.nativeEvent.timestamp))
                    if (onChange) {
                      onChange(event.nativeEvent.timestamp)
                    }
                  }
                }}
                onError={() => {
                  setShowPicker(false)
                }}
              />
            </SafeAreaView>
          ) : null}
        </View>

        {/* {errorMessage ? (
          <View>
            <Text
              style={{
                color: 'red',
              }}>
              {errorMessage}
            </Text>
          </View>
        ) : null} */}
      </View>
    </TouchableWithoutFeedback>
  )
}

export default DateTimeField