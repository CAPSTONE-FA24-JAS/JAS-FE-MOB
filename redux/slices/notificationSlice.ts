// redux/slices/notificationSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "@/app/types/notification_type";
import { getNotificationByAccountId } from "@/api/notificationApi";

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

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (
    args: { accountId: number; page: number; pageSize: number },
    thunkAPI
  ) => {
    const { accountId, page, pageSize } = args;
    try {
      console.log("====================================");
      console.log("Fetching notifications for account:", accountId);
      console.log("====================================");
      const response = await getNotificationByAccountId(
        accountId,
        page,
        pageSize
      );
      return {
        notifications: response.dataResponse || [],
        totalItems: response.totalItemRepsone || 0,
      };
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return thunkAPI.rejectWithValue("Failed to fetch notifications");
    }
  }
);

const notificationSlice = createSlice({
  name: "Notification",
  initialState,
  reducers: {
    // In notificationSlice.ts, add logging in setNotifications if needed
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      console.log("setNotifications payload:", action.payload); // Log payload
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
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
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
  addNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
