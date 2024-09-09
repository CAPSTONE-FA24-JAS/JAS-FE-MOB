// authApi.ts

import { LoginResponse } from "@/app/types/login_type";
import { Response } from "@/app/types/respone_type";
import { DataSignUpResponse, SignUpUser } from "@/app/types/signup_type";
import { showErrorMessage } from "@/components/FlashMessageHelpers";
import { login, register } from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";
import { router } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:7251";

// Define a mock response for register
const mockRegisterResponse = {
  message: "User registered successfully",
  user: {
    userId: "002",
    userName: "Jane Doe",
    email: "jane@example.com",
    roles: ["user"], // Add other properties if needed
  },
};

// authApi.ts

export const LoginApi = async (
  email: string,
  password: string,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    console.log("Bắt đầu đăng nhập...", email, password);

    const response = await axios.post<LoginResponse>(
      `${API_URL}/api/Authentication/Login`,
      {
        email,
        password,
      }
    );

    const { data } = response.data;

    dispatch(
      login({
        token: data.accessToken,
        userResponse: {
          userId: data.account.email,
          userName: `${data.account.firstName} ${data.account.lastName}`,
          email: data.account.email,
          roles: ["user"],
        },
      })
    );
    console.log("Đăng nhập thành công.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.toJSON()); // Thêm log chi tiết về lỗi Axios
    } else {
      console.error("Lỗi đăng nhập:", error);
    }
    throw error;
  }
};

export const registerApi = async (
  signupUser: SignUpUser,
  dispatch: AppDispatch
): Promise<void> => {
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
      // Nếu đăng ký không thành công, ném ra lỗi với thông báo từ API
      throw new Error(response.data.message || "Registration failed.");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const apiResponse = error.response.data as Response<any>;
      console.error("Registration error:", apiResponse.message);
      throw new Error(apiResponse.message || "An unexpected error occurred.");
    } else if (error instanceof Error) {
      console.error("Registration error:", error.message);
      throw error;
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};
