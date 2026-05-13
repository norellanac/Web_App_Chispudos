import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';
import authReducer from '../slices/authSlice';
import serviceStepperReducer from '../slices/serviceStepperSlice';
import roleSwitcherReducer from '../slices/roleSwitcherSlice';
import filterProductsReducer from '../slices/filterProductsSlice';
import brandingReducer from '../slices/brandingSlice';
import { authApi } from '../../services/authApi';
import { productApi } from '../../services/productApi';
import { categoryApi } from '../../services/categoryApi';
import { userApi } from '../../services/userApi';
import { ordersApi } from '../../services/ordersApi';
import { locationsApi } from '../../services/locationsApi';
import { chatApi } from '../../services/chatApi';
import { mailchimpApi } from '../../services/mailchimpApi';

const rootReducer = combineReducers({
  auth: authReducer,
  serviceStepper: serviceStepperReducer,
  roleSwitcher: roleSwitcherReducer,
  filter: filterProductsReducer,
  branding: brandingReducer,
  [authApi.reducerPath]: authApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
  [locationsApi.reducerPath]: locationsApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [mailchimpApi.reducerPath]: mailchimpApi.reducer,
  // Add other reducers here
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'serviceStepper', 'roleSwitcher', 'filterProducts', 'branding'], // Persist the filter state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authApi.middleware,
      productApi.middleware,
      categoryApi.middleware,
      userApi.middleware,
      ordersApi.middleware,
      locationsApi.middleware,
      chatApi.middleware,
      mailchimpApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;