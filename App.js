import { StyleSheet, Text, View, ScrollView } from 'react-native';
import FetchData from './src';
import { ToastProvider } from 'react-native-toast-notifications'


export default function App() {
  return (
    <ToastProvider>
      <ScrollView style={styles.container}>
        <FetchData />
      </ScrollView>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
