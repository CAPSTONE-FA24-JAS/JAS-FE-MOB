// authApi.ts

import { Data } from "@/app/types/login_type";
import { Response } from "@/app/types/respone_type";
import { DataSignUpResponse, SignUpUser } from "@/app/types/signup_type";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import { login } from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import { router } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

// authApi.ts

export const LoginApi = async (
  email: string,
  password: string,
  dispatch: AppDispatch
): Promise<Data["user"] | null> => {
  // Adjusted return type
  try {
    console.log("Starting login...", email, password);

    const response = await axios.post<Response<Data>>(
      `${API_URL}/api/Authentication/Login`,
      {
        email,
        password,
      }
    );

    const { data } = response.data;
    console.log("====================================");
    console.log("Login Data:", JSON.stringify(data));
    console.log("====================================");

    dispatch(
      login({
        token: data.accessToken,
        userResponse: { ...data.user },
      })
    );
    console.log("Login successful.");

    return data.user; // Return user data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.toJSON());
    } else {
      console.error("Login error:", error);
    }
    throw error;
  }
};

export const registerApi = async (signupUser: SignUpUser): Promise<void> => {
  try {
    console.log("Starting registration...", signupUser);

    const url = `${API_URL}/api/Authentication/Register`;
    const response = await axios.post<Response<DataSignUpResponse>>(
      url,
      signupUser
    );

    if (response.data.isSuccess === true) {
      console.log("Registration successful. Redirecting to login...");
      router.push("/login"); // Chuyển hướng đến trang đăng nhập
    } else {
      showErrorMessage(response.data.message || "Registration failed.");
      // Nếu đăng ký không thành công, ném ra lỗi với thông báo từ API
      throw new Error(response.data.message || "Registration failed.");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.toJSON());
    } else {
      console.error("Registration error:", error);
    }
    throw error;
  }
};
