import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiError, PostgrestError, Session, User } from "@supabase/supabase-js";
import { RootState } from "lib/store";
import {
  IProfileDetails,
  SignInOptions,
  SignUpOptions,
  UserState,
} from "lib/types";
import { supabase } from "lib/util/supabase/supabase-client";
import userProfileQuery from "lib/util/supabase/userProfileQuery";

export const initialUserState: UserState = {
  session: null,
  user: null,
  errorMessage: null,
  profileDetails: null,
  siteConfig: null,
  userLoaded: false,
};

export const signInUser = createAsyncThunk<
  { user: User; session: Session },
  SignInOptions,
  { rejectValue: ApiError }
>("users/signin", async (options: SignInOptions, { rejectWithValue }) => {
  try {
    const { user, session, error } = await supabase.auth.signIn(options);
    if (error === null) {
      return { user, session };
    } else {
      return rejectWithValue(error);
    }
  } catch (error) {
    console.error("signIn user: ", error);
    return rejectWithValue(error);
  }
});

export const signUpUser = createAsyncThunk<
  { user: User; session: Session },
  SignUpOptions,
  { rejectValue: ApiError }
>("users/signup", async (options: SignUpOptions, { rejectWithValue }) => {
  try {
    const { user, session, error } = await supabase.auth.signUp(options);
    if (error === null) {
      return { user, session };
    } else {
      return rejectWithValue(error);
    }
  } catch (error) {
    console.error("signUp user: ", error);
    return rejectWithValue(error);
  }
});

export const fetchUserProfile = createAsyncThunk<
  { data: IProfileDetails; error: PostgrestError; status: number },
  string,
  { rejectValue: { error: PostgrestError; status: number } }
>("users/fetchProfile", async (userId: string, { rejectWithValue }) => {
  try {
    const { data, error, status } = await userProfileQuery({ userId });
    if (data) {
      return { data, error, status };
    } else {
      return rejectWithValue({ error, status });
    }
  } catch (error) {
    console.error("fetchUserProfile: ", error);
    rejectWithValue(error);
  }
});

export const updateUserProfile = createAsyncThunk<
  { formData: IProfileDetails },
  IProfileDetails,
  { rejectValue: PostgrestError }
>(
  "users/updateProfile",
  async (formData: IProfileDetails, { rejectWithValue }) => {
    try {
      const user = supabase.auth.user();

      const update = {
        id: user.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        company_name: formData.company_name,
        avatar_url: formData.avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(update, { returning: "minimal" });

      if (error) {
        return rejectWithValue(error);
      } else {
        return { formData };
      }
    } catch (error) {
      console.error("updateUserProfile: ", error);
      return rejectWithValue(error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signInUser.fulfilled, (state, { payload }) => {
      state.user = payload.user;
      state.session = payload.session;
      state.userLoaded = true;
    });
    builder.addCase(signInUser.rejected, (state, { payload }) => {
      state.errorMessage = payload.message;
      state.userLoaded = false;
    });
    builder.addCase(signUpUser.fulfilled, (state, { payload }) => {
      state.user = payload.user;
      state.session = payload.session;
      state.userLoaded = true;
    });
    builder.addCase(signUpUser.rejected, (state, { payload }) => {
      state.errorMessage = payload.message;
      state.userLoaded = false;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, { payload }) => {
      state.profileDetails = payload.data;
    });
    builder.addCase(fetchUserProfile.rejected, (state, { payload }) => {
      state.errorMessage = payload.error.message;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, { payload }) => {
      state.profileDetails = payload.formData;
    });
    builder.addCase(updateUserProfile.rejected, (state, { payload }) => {
      state.errorMessage = payload.message;
    });
  },
});

export const selectUser = (state: RootState): UserState => state.user;
export const selectUserSession = (state: RootState): Session =>
  state.user.session;
export const selectUserProfile = (state: RootState): IProfileDetails =>
  state.user.profileDetails;

export default userSlice.reducer;
