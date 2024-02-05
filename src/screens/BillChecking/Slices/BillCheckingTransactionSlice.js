// import { createSlice } from "@reduxjs/toolkit";
// import { getGeneralSettingData } from "./SettingAction";

// const initialState = {
//   status: "",
//   err: "",
//   getAllgeneralSettingData:[]
  
// };

// export const settingSlice = createSlice({
    
//   name: "generalSettingSlice",
//   initialState,
//   reducers: {
//     loaderModal:(state,action)=>{
//         state.showLoaderModal = action.payload
//         console.log("action of modal",action.payload)
//     }
//   },
//   extraReducers: (builder) => {    

//     builder.addCase(getGeneralSettingData.pending, (state) => {
//       state.status = "loading";

//     });
//     builder.addCase(getGeneralSettingData.fulfilled, (state, action) => {
//       const { payload } = action;
//       if (payload?.status === 200 && payload?.data?.status === 1) {
//         let getAllgeneralSettingData = payload.data.data;
//         state.status = "succeded";
//         state.showLoaderModal = false;
//         let count = 1;
//         for (let i = 0; i < getAllgeneralSettingData.length; i++) {
//             getAllgeneralSettingData[i].counter = count++;
//         }
//         state.getAllgeneralSettingData = [...getAllgeneralSettingData];
//       }
//     });
//     builder.addCase(getGeneralSettingData.rejected, (state) => {
//       state.status = "rejected";
//     });

  


//   },


  


// });

// export default settingSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "",
  err: "",
  
  notify: {},

  
};

export const BillCheckingTransactionSlice = createSlice({
    
  name: "BillCheckingTransactionSlice",
  initialState,
  reducers: {
    
      loaderModal: (state, action) => {
        state.showLoaderModal = action.payload;
      },
      handleGeneralModal: (state, action) => {
        state.modal = action.payload;
      },
      handleModalClose: (state, action) => {
        state.modal = action.payload;
      },
    
  },
  extraReducers: (builder) => {    

    // get general setting
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

//   // post general setting

//   builder.addCase(postGeneralSettingData.pending, (state) => {
//     state.status = "loading";

//   });
//   builder.addCase(postGeneralSettingData.fulfilled, (state, action) => {
//     const { payload } = action;
//     if (payload?.status === 200 && payload?.data?.status === 1) {
//       let postGeneralSetting = payload.data.data;
//       state.status = "succeded";
//       state.showLoaderModal = false;
     
//       state.postGeneralSetting = postGeneralSetting;
//       state.notify = null;
//       state.notify = { type: "success", message: payload.data.message };
//       let modal = { showModal: false, modalData: "", modalHeader: "" };
//       state.modal = modal;
//     } else {
//       let notify = { type: "danger", message: payload.data.message };
//       state.notify = null;
//       state.notify = notify;
    
//     }
//   });
//   builder.addCase(postGeneralSettingData.rejected, (state) => {
//     state.status = "rejected";
//   });


//   //update general setting
//   builder.addCase(updateGeneralSettingData.pending, (state) => {
//     state.status = "loading";

//   });

//   builder.addCase(updateGeneralSettingData.fulfilled, (state, action) => {
//     const { payload } = action;
//     if (payload?.status === 200 && payload?.data?.status === 1) {
//       let updateGeneralSetting = payload.data.data;
//       state.status = "succeded";
//       state.showLoaderModal = false;
     
//       state.updateGeneralSetting = updateGeneralSetting;
//       state.notify = null;
//       state.notify = { type: "success", message: payload.data.message };
//       let modal = { showModal: false, modalData: "", modalHeader: "" };
//       state.modal = modal;
//     } else {
//       let notify = { type: "danger", message: payload.data.message };
//       state.notify = null;
//       state.notify = notify;
    
//     }
//   });
//   builder.addCase(updateGeneralSettingData.rejected, (state) => {
//     state.status = "rejected";
//   });


  },


  


});
export const { handleGeneralModal, handleModalClose, loaderModal } =
BillCheckingTransactionSlice.actions;
export default BillCheckingTransactionSlice.reducer;

