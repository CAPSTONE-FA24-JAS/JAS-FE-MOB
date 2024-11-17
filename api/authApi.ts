// authApi.ts

import { Data } from "@/app/types/login_type";
import { Response } from "@/app/types/respone_type";
import { DataSignUpResponse, SignUpUser } from "@/app/types/signup_type";
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/FlashMessageHelpers";
import { login, register } from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import { router } from "expo-router";
import * as signalR from "@microsoft/signalr"; // Import SignalR library

let signalRConnection: signalR.HubConnection | null = null; // Global connection instance

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

// authApi.ts
// Thiết lập axios instance với timeout
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 giây
});

// Thiết lập axios instance với timeout
export const LoginApi = async (
  email: string,
  password: string,
  dispatch: AppDispatch
): Promise<Data["user"] | null> => {
  try {
    console.log("Starting login...", email, password);

    const response = await axiosInstance.post<Response<Data>>(
      `/api/Authentication/Login`,
      {
        email,
        password,
      }
    );

    const { data } = response.data;
    console.log("Login Data:", JSON.stringify(data));

    dispatch(
      login({
        token: data.accessToken,
        userResponse: { ...data.user },
      })
    );

    console.log("Login successful.");
    // SignalR connection setup
    if (!signalRConnection) {
      signalRConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${API_URL}/auctionning`) // SignalR Hub URL
        .withAutomaticReconnect()
        .build();

      signalRConnection.on("ReceiveNotification", (notification) => {
        console.log("New notification:", notification);
        // Handle notification (e.g., dispatch to Redux or show toast)
      });

      await signalRConnection.start();
      console.log("SignalR connected");

      // Send accountId to the server
      await signalRConnection.invoke("RegisterAccount", data.user.id);
      showSuccessMessage("SignalR connected and account registered");
      console.log("Account registered with SignalR:", data.user.id);
    }

    return data.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        console.error("Request timed out.");
      } else {
        console.error("Axios error:", error.response?.data || error.toJSON());
      }
    } else {
      console.error("Login error:", error);
    }
    throw error;
  }
};

export const getSignalRConnection = () => signalRConnection;

export const registerApi = async (signupUser: SignUpUser): Promise<void> => {
  try {
    console.log("Starting registration...", signupUser);

    const response = await axiosInstance.post<Response<DataSignUpResponse>>(
      `/api/Authentication/Register`,
      signupUser
    );

    if (response.data.isSuccess === true) {
      console.log("Registration successful. Redirecting to login...");
      router.push("/login");
    } else {
      throw new Error(response.data.message || "Registration failed.");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        console.error("Request timed out.");
      } else {
        console.error("Axios error:", error.response?.data || error.toJSON());
      }
    } else {
      console.error("Registration error:", error);
    }
    throw error;
  }
};
