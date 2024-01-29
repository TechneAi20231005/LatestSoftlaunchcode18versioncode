import { createSlice } from "@reduxjs/toolkit";
import { getGeneralSettingData } from "./SettingAction";

const initialState = {
  status: "",
  err: "",
  getAllgeneralSettingData:[]
  
};

export const settingSlice = createSlice({
    
  name: "generalSettingSlice",
  initialState,
  reducers: {
    loaderModal:(state,action)=>{
        state.showLoaderModal = action.payload
        console.log("action of modal",action.payload)
    }
  },
  extraReducers: (builder) => {    

    builder.addCase(getGeneralSettingData.pending, (state) => {
      state.status = "loading";

    });
    builder.addCase(getGeneralSettingData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getAllgeneralSettingData = payload.data.data;
        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getAllgeneralSettingData.length; i++) {
            getAllgeneralSettingData[i].counter = count++;
        }
        state.getAllgeneralSettingData = [...getAllgeneralSettingData];
      }
    });
    builder.addCase(getGeneralSettingData.rejected, (state) => {
      state.status = "rejected";
    });

  


  },


  


});

export default settingSlice.reducer;
