import { createSlice } from "@reduxjs/toolkit";
import { getCity, getRole, postCityComponent } from "./CityAction";
import { act } from "react-dom/test-utils";

const initialState = {
  status: "",
  error: "",
  cityDetails: {},
  data: [],
  message: "",
  modal: {
    showModal: false,
    modalData: "",
    modalHeader: "",
  },
};

export const citySlice = createSlice({
  name: "citySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(postCityComponent.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(postCityComponent.fulfilled, (state, action) => {
      state.status = "succeded";
      state.data = action.payload;
      state.message = action.payload;


    });
    builder.addCase(postCityComponent.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
    builder.addCase(getCity.fulfilled, (state, action) => {
      state.status = "loading";
      state.data = action.payload.data;
      console.log("hhe", action.payload);
    });
    builder.addCase(getRole.fulfilled, (state, action) => {
      state.status = "loading";
      state.data = action.payload;
      console.log("act", action.payload);
      console.log("hhssss", action.payload);
    });
  },
});
export const { setModal, setNotify } = citySlice.actions;
export default citySlice.reducer;
