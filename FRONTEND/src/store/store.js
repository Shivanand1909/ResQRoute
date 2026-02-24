import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import medicalReducer from './slices/medicalSlice';
import trackingReducer from './slices/trackingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    medical: medicalReducer,
    tracking: trackingReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;