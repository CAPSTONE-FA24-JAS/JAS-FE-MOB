import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import notificationReducer from "./slices/notificationSlice";
import signalRReducer from "./slices/signalRSlice";
import { useDispatch } from "react-redux";

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    notifications: notificationReducer,
    signalR: signalRReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true, // Đảm bảo Redux Toolkit xử lý thunk đúng cách
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   Action<string>,

// >;

export type AppThunk = ThunkAction<void, RootState, undefined, Action<string>>;
export default store;

export const useAppDispatch = () => useDispatch<AppDispatch>();
