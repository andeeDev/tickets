import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers/rootReducer';
import { persistenStore, saveState } from './persistentStore/persistenStore';
import logger from 'redux-logger';

const persistentStore = persistenStore();
const store = createStore(rootReducer, persistentStore, applyMiddleware(logger));

store.subscribe(() => {
    saveState(store.getState().auth);
})
export default store;
