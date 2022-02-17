import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { persistStore } from 'redux-persist';
import rootReducer from './root-reducer';

const middlewares = [logger, thunk];
// if (process.env.NODE_ENV === 'development') middlewares.push(logger);
middlewares.shift();

export const store = createStore(
   rootReducer,
   composeWithDevTools(applyMiddleware(...middlewares))
);

export const persistedStore = persistStore(store);

// export default { store, persistedStore };
