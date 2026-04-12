import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../sildes/loginSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
  },
});

export default store;
