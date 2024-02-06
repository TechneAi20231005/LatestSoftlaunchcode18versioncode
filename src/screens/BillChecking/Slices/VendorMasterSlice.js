import { createSlice } from "@reduxjs/toolkit";
import { getVendorMasterData } from "./VendorMasterAction";

const initialState = {
  status: "",
  err: "",

  notify: {},
  getVendorMasterData:[],
  exportData:[],
  vendorMasterDropDown:[]
};

export const VendorMasterSlice = createSlice({
  name: "VendorMasterSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get general setting
    builder.addCase(getVendorMasterData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getVendorMasterData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getVendorMasterData = payload.data.data;
        const temp = getVendorMasterData.filter((d) => d.is_active == 1);
        const vendorMasterDropDown = temp.map((d) => ({
            value: d.id,
            label: d.vendor_name,
          }))

    
          
        state.status = "succeded";
        state.showLoaderModal = false;
     
        state.vendorMasterDropDown=vendorMasterDropDown
        }
      
    });
    builder.addCase(getVendorMasterData.rejected, (state) => {
      state.status = "rejected";
    });

    //   // post general setting

    
  },
});

export default VendorMasterSlice.reducer;
