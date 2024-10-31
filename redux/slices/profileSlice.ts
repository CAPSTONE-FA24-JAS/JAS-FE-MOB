import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProfile, deleteAccount, updateProfile } from "@/api/profileApi";
import { UserInfo } from "@/app/types/profilte_type";
import { logout } from "./authSlice";

// Thunks
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await getProfile(userId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch profile");
    }
  }
);

export const removeAccount = createAsyncThunk(
  "profile/removeAccount",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await deleteAccount(userId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete account");
    }
  }
);

export const modifyProfile = createAsyncThunk(
  "profile/modifyProfile",
  async (
    { userId, profileData }: { userId: number; profileData: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateProfile(userId, profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
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
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
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
