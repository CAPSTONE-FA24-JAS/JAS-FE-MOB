import apiClient from "@/api/config";
import { Response } from "@/app/types/respone_type";
import { DataSignUpResponse, SignUpUser } from "@/app/types/signup_type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { router } from "expo-router";

export const signup = createAsyncThunk(
  "auth/login",
  async (SignUpUser: SignUpUser, thunkAPI) => {
    console.log("data", SignUpUser);

    const url = "/api/Authentication/Register";
    console.log(`URL ${apiClient.getUri()}${url}`);

    try {
      const response = await apiClient.post<Response<DataSignUpResponse>>(url, {
        firstName: SignUpUser.registerCustomerDTO.firstName,
        lastName: SignUpUser.registerCustomerDTO.lastName,
        email: SignUpUser.email,
        gender: "male",
        passwordHash: SignUpUser.passwordHash,
        phoneNumber: SignUpUser.phoneNumber,
      });

      if (response.data.isSuccess === true) {
        router.push("/login");
      }
    } catch (error: any) {
      if (error.response && error.response.data.error_message) {
        return thunkAPI.rejectWithValue(error.response.data.error_message);
      } else {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  }
);
