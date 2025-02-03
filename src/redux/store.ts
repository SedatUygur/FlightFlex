import { configureStore } from '@reduxjs/toolkit';
import flightsReducer from './FlightsSlice';

const store = configureStore({
  reducer: {
    flights: flightsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
