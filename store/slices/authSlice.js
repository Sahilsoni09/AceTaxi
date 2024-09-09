import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authData: null,
  token: null,
  isAuthenticated: false,
};

const authSLice = createSlice({

  name: "auth",
  initialState,
  reducers: {

    authenticate(state, action) {
      const authData = action.payload;
      state.authData = authData;
      state.token = authData.token;
      state.isAuthenticated = !!authData.token;

      AsyncStorage.setItem("authData", JSON.stringify(authData));
    },

    logout(state){
        state.authData = null;
        state.token = null;
        state.isAuthenticated = false;

        AsyncStorage.removeItem("authData");
    }

  },
  
});

export const {authenticate, logout} = authSLice.actions;

export default authSLice.reducer;
