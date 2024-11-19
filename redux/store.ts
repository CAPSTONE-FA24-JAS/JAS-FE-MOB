import { configureStore } from "@reduxjs/toolkit";
import authReducer, { logout } from "./slices/authSlice";
import profileReducer from "./slices/profileSlice"; // Import profileReducer
import notificationReducer from "./slices/notificationSlice"; // Import notificationReducer

import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer, // Add profile reducer to store
    notifications: notificationReducer, // Add notification reducer to store
  },
});
// store.dispatch(logout());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

export const useAppDispatch = () => useDispatch<AppDispatch>();
