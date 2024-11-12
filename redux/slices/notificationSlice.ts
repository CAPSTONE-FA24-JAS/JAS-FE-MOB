// redux/slices/notificationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "@/app/types/notification_type";

interface NotificationState {
  notifications: Notification[];
  totalItems: number;
  loading: boolean;
  loadingMark: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  totalItems: 0,
  loading: false,
  loadingMark: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
    setTotalItems: (state, action: PayloadAction<number>) => {
      state.totalItems = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLoadingMark: (state, action: PayloadAction<boolean>) => {
      state.loadingMark = action.payload;
    },
    markNotificationAsRead: (state, action: PayloadAction<number>) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(
        (notif) => notif.id === notificationId
      );
      if (notification) {
        notification.is_Read = true;
      }
    },
    // Reset notifications when the user logs out
    resetNotifications: (state) => {
      state.notifications = [];
      state.totalItems = 0;
      state.loading = false;
      state.loadingMark = false;
    },
  },
});

export const {
  setNotifications,
  setTotalItems,
  setLoading,
  setLoadingMark,
  markNotificationAsRead,
  resetNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;