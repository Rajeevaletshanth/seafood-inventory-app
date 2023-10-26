import { StyleSheet, Text, View, ScrollView } from 'react-native';
import FetchData from './src';

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <FetchData />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
