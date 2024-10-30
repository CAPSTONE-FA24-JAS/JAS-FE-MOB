// redux/slices/authSlice.ts
import { UserAccount } from "@/app/types/login_type";
import { DataSignUpResponse } from "@/app/types/signup_type";
import { createSlice, isPending, PayloadAction } from "@reduxjs/toolkit";
import { signup } from "../actions/authAction";

interface AuthState {
  isAuthenticated: boolean;
  token?: string;
  userResponse?: UserAccount;
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
      action: PayloadAction<{ token: string; userResponse: UserAccount }>
    ) => {
      console.log("Login action dispatched with payload:", action.payload);
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userResponse = action.payload.userResponse;
    },
    register(state, action: PayloadAction<DataSignUpResponse>) {
      state.signUpResponse = action.payload;
    },
    logout: (state) => {
      // Reset the entire state upon logout
      state.isAuthenticated = false;
      state.token = undefined;
      state.userResponse = undefined;
      state.signUpResponse = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signup.fulfilled, (state, action) => {
      state.isPending = false;
      state.signUpResponse = action.payload;
    });
    builder.addCase(signup.pending, (state) => {
      state.isPending = true;
    });
    builder.addCase(signup.rejected, (state) => {
      state.isPending = false;
    });
  },
});

export const { login, register, logout } = authSlice.actions;

export default authSlice.reducer;
