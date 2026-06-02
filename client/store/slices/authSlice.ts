// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { User } from "@/types";

// interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
// }

// const initialState: AuthState = {
//   user: null,
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<User>) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//     },
//     clearUser: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//     },
//   },
// });

// export const { setUser, clearUser } = authSlice.actions;
// export default authSlice.reducer; //fixed redux on hot reloading while on local host 

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// load from localStorage on startup
const savedUser = typeof window !== "undefined"
  ? JSON.parse(localStorage.getItem("user") || "null")
  : null;

const initialState: AuthState = {
  user: savedUser,
  isAuthenticated: !!savedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;