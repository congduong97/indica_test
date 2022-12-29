import {createSlice} from '@reduxjs/toolkit';

// Define the initial state using that type
const initialState = {
  isLoggedIn: false,
  loginType: null,
  token: null,
  userInfo: null,
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.loginType = action.payload.loginType;
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
    },
    logout: state => {
      state.isLoggedIn = false;
      state.loginType = null;
      state.userInfo = null;
      state.token = null;
    },
  },
});

// Other code such as selectors can use the imported `RootState` type
export const selectUser = state => state.userReducer;

// Action creators are generated for each case reducer function
export const {setLogin, logout} = userSlice.actions;
export const userReducer = userSlice.reducer;
