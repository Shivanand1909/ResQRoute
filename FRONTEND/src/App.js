import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {store} from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import {requestLocationPermission} from './src/utils/permissions';
import PushNotificationService from './src/services/notifications/PushNotificationService';

const App = () => {
  useEffect(() => {
    // Initialize app
    const initialize = async () => {
      // Request permissions
      await requestLocationPermission();
      
      // Initialize push notifications
      PushNotificationService.initialize();
    };

    initialize();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <AppNavigator />
        </SafeAreaView>
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;