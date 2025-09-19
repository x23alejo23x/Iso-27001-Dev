import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authDTO: null,
  userDTO: null,
  personalDTO: null,
};

const userInfoSlice = createSlice({
  name: "userInfoState",
  initialState,
  reducers: {
    setInfoUser: (state, action) => {
      state.authDTO = action.payload.authDTO;
      state.userDTO = action.payload.userDTO;
      state.personalDTO = action.payload.personalDTO;
    },
  },
});

export const { setInfoUser } = userInfoSlice.actions;
export default userInfoSlice.reducer;
