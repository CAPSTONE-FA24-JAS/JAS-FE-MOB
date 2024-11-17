import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as signalR from "@microsoft/signalr";
import { AppDispatch, AppThunk } from "../store";
import { Notification } from "@/app/types/notification_type";
import { setNotifications } from "./notificationSlice";

interface SignalRState {
  connection: signalR.HubConnection | null;
  isConnected: boolean;
}

const initialState: SignalRState = {
  connection: null,
  isConnected: false,
};

const signalRSlice = createSlice({
  name: "signalR",
  initialState,
  reducers: {
    setConnection: (
      state,
      action: PayloadAction<signalR.HubConnection | null>
    ) => {
      state.connection = action.payload;
    },
    setIsConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setConnection, setIsConnected } = signalRSlice.actions;

export default signalRSlice.reducer;

export const initializeSignalR =
  (accountId: number): AppThunk =>
  async (dispatch: AppDispatch) => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(
        `${
          process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251"
        }/auctionning`
      )
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (notification: Notification) => {
      console.log("New notification received:", notification);
      dispatch(setNotifications([notification]));
    });

    connection.onreconnecting(() => {
      console.log("Reconnecting to SignalR...");
      dispatch(setIsConnected(false));
    });

    connection.onreconnected(() => {
      console.log("Reconnected to SignalR.");
      dispatch(setIsConnected(true));
      connection.invoke("RegisterAccount", accountId).catch((err) => {
        console.error("Error re-registering account:", err);
      });
    });

    try {
      await connection.start();
      console.log("SignalR connected");
      dispatch(setConnection(connection));
      dispatch(setIsConnected(true));

      await connection.invoke("RegisterAccount", accountId);
      console.log("Account registered with SignalR:", accountId);
    } catch (err) {
      console.error("Error connecting to SignalR:", err);
    }
  };
