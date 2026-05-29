import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import App from './src/App';

export default function RootApp() {
  return (
    <Provider store={store}>
      <StatusBar style="dark" backgroundColor="#fff" />
      <App />
    </Provider>
  );
}
