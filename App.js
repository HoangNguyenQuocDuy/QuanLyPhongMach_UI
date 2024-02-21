import React from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import Wrapper from './Page/Wrapper/Wrapper';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Wrapper />
      </PersistGate>
    </Provider>
  );
}
