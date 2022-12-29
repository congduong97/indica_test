import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {userReducer} from './userSlice';

const rootReducer = combineReducers({
  userReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
