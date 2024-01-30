import { createSlice } from "@reduxjs/toolkit";
import { subModuleMaster } from "./SubModuleMasterAction";

const initialState = {
  status: "",
  err: "",
  subModuleMaster: [],
};

export const submoduleSlice = createSlice({
  name: "submoduleSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
      console.log("action of modal", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(subModuleMaster.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(subModuleMaster.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let subModuleMaster = payload.data.data;

        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < subModuleMaster.length; i++) {
            subModuleMaster[i].counter = count++;
        }
        state.subModuleMaster = [...subModuleMaster];
      }
    });
    builder.addCase(subModuleMaster.rejected, (state) => {
      state.status = "rejected";
    });
  },
});

export default submoduleSlice.reducer;
