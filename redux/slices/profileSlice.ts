import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProfile, deleteAccount, updateProfile } from "@/api/profileApi";
import { UserInfo } from "@/app/types/profilte_type";
import { logout } from "./authSlice";

// Thunks
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (userId: number) => {
    return await getProfile(userId);
  }
);

export const removeAccount = createAsyncThunk(
  "profile/removeAccount",
  async (userId: number) => {
    return await deleteAccount(userId);
  }
);

export const modifyProfile = createAsyncThunk(
  "profile/modifyProfile",
  async ({ userId, profileData }: { userId: number; profileData: any }) => {
    return await updateProfile(userId, profileData);
  }
);

// Slice
interface ProfileState {
  profile: UserInfo | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.data;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(removeAccount.fulfilled, (state) => {
        state.profile = null;
      })
      .addCase(logout, (state) => {
        // Reset the profile state upon logout
        state.profile = null;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export default profileSlice.reducer;
