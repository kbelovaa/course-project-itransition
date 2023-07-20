import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import userReducer from './reducers/userReducer';
import tableReducer from './reducers/tableReducer';
import collectionReducer from './reducers/collectionReducer';
import itemReducer from './reducers/itemReducer';

const rootReducer = combineReducers({
  user: userReducer,
  table: tableReducer,
  collection: collectionReducer,
  item: itemReducer,
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
