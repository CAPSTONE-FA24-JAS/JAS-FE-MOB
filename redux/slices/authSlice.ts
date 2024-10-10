// redux/slices/authSlice.ts

import { UserAccount } from "@/app/types/login_type";
import { DataSignUpResponse } from "@/app/types/signup_type";
import { createSlice, isPending, PayloadAction } from "@reduxjs/toolkit";
import { FulfilledAction, PendingAction, RejectedAction } from "../reduxType";
import { signup } from "../actions/authAction";

interface AuthState {
  isAuthenticated: boolean;
  token?: string;
  userResponse?: UserAccount; // Update this to match your types
  signUpResponse?: DataSignUpResponse;
  isPending?: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isPending: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ token: string; userResponse: any }>
    ) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userResponse = action.payload.userResponse;
    },
    register(state, action: PayloadAction<DataSignUpResponse>) {
      state.signUpResponse = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = undefined;
      state.userResponse = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signup.fulfilled, (state, action) => {
      state.isPending = false;
      console.log("data res", action.payload);
      state.signUpResponse = action.payload;
    });
    builder.addCase(signup.pending, (state) => {
      state.isPending = true;
      console.log("pending");
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.isPending = false;
      console.log("rejected", action.error.message);
    });
  },
});

export const { login, register, logout } = authSlice.actions;

export default authSlice.reducer;
