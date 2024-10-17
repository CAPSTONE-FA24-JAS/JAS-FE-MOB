import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice"; // Import profileReducer
import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer, // Add profile reducer to store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

export const useAppDispatch = () => useDispatch<AppDispatch>();
