import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store, persistedStore } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App';

ReactDOM.render(
   <Provider store={store}>
      <BrowserRouter>
         <PersistGate persistor={persistedStore}>
            <App />
         </PersistGate>
      </BrowserRouter>
   </Provider>,
   document.getElementById('root')
);
