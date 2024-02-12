import { createSlice } from "@reduxjs/toolkit";

import { EditCreateticket, getAllQueryGroupData, getCustomerMappingsetting, getDepartmentMappingByEmployeeIdData, getParentData, postCreateticket, queryTypeData, queryTypesData } from "./TicketAction";

const initialState = {
  status: "",
  err: "",
  notify: "",
  customerMappingData:[],
  queryTypeData:[],
  queryGroupData:[],
  queryGroupDropDownData:[]

};

export const createTicketSlice = createSlice({
  name: "rolemasterSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
      console.log("action of modal", action.payload);
    },
    handleModalOpen: (state, action) => {
      state.modal = action.payload;
    },
    handleModalClose: (state, action) => {
      state.modal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCustomerMappingsetting.pending, (state) => {
      state.status = "loading";
      state.notify = null
    });
    builder.addCase(getCustomerMappingsetting.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let customerMappingData = payload.data.data;
        console.log("customerMappingData",customerMappingData);
        state.status = "succeded";
        state.showLoaderModal = false;
        state.customerMappingData = [...customerMappingData];

      }
    });
    builder.addCase(getCustomerMappingsetting.rejected, (state) => {
      state.status = "rejected";
    });


    builder.addCase(queryTypesData.pending, (state) => {
        state.status = "loading";
        state.notify = null
      });
      builder.addCase(queryTypesData.fulfilled, (state, action) => {
        const { payload } = action;
  
        if (payload?.status === 200 && payload?.data?.status === 1) {
        //   let queryData = payload.data.data;
          state.status = "succeded";
          state.showLoaderModal = false;
        //   state.queryData = [...queryData];
  
        }
      });
      builder.addCase(queryTypesData.rejected, (state) => {
        state.status = "rejected";
      });



      builder.addCase(getAllQueryGroupData.pending, (state) => {
        state.status = "loading";
        state.notify = null
      });
      builder.addCase(getAllQueryGroupData.fulfilled, (state, action) => {
        const { payload } = action;
  
        if (payload?.status === 200 && payload?.data?.status === 1) {
            console.log("payload",payload)
         let queryGroupData= payload.data.data.filter((d) => d.is_active == 1)
         let queryGroupDropDownData=payload.data.data
         .filter((d) => d.is_active == 1)
         .map((d) => ({ value: d.id, label: d.group_name }))
    state.queryGroupData=queryGroupData;
    state.queryGroupDropDownData=queryGroupDropDownData;
          state.status = "succeded";
          state.showLoaderModal = false;
  
        }
      });
      builder.addCase(getAllQueryGroupData.rejected, (state) => {
        state.status = "rejected";
      });


      builder.addCase(getParentData.pending, (state) => {
        state.status = "loading";
        state.notify = null
      });
      builder.addCase(getParentData.fulfilled, (state, action) => {
        const { payload } = action;
  
        if (payload?.status === 200 && payload?.data?.status === 1) {
        
          state.status = "succeded";
          state.showLoaderModal = false;
  
        }
      });
      builder.addCase(getParentData.rejected, (state) => {
        state.status = "rejected";
      });


      builder.addCase(getDepartmentMappingByEmployeeIdData.pending, (state) => {
        state.status = "loading";
        state.notify = null
      });
      builder.addCase(getDepartmentMappingByEmployeeIdData.fulfilled, (state, action) => {
        const { payload } = action;
  
        if (payload?.status === 200 && payload?.data?.status === 1) {
        
          state.status = "succeded";
          state.showLoaderModal = false;
  
        }
      });
      builder.addCase(getDepartmentMappingByEmployeeIdData.rejected, (state) => {
        state.status = "rejected";
      });

      builder.addCase(postCreateticket.pending, (state) => {
        state.status = "loading";
        state.notify = null
      });
      builder.addCase(postCreateticket.fulfilled, (state, action) => {
        const { payload } = action;
  
        if (payload?.status === 200 && payload?.data?.status === 1) {
        
          state.status = "succeded";
          state.notify = null;
        state.notify = { type: "success", message: payload.data.message };
      } else {
        // let notify = { type: "danger", message: payload.data.message };
        state.notify = null;
        state.notify = { type: "danger", message: payload.data.message };
      
        }
      });
      builder.addCase(postCreateticket.rejected, (state) => {
        state.status = "rejected";
      });


      builder.addCase(EditCreateticket.pending, (state) => {
        state.status = "loading";
        state.notify = null
      });
      builder.addCase(EditCreateticket.fulfilled, (state, action) => {
        const { payload } = action;
  
        if (payload?.status === 200 && payload?.data?.status === 1) {
          state.status = "succeded";
          state.notify = null;
          
        state.notify = { type: "success", message: payload.data.message };
      } else {
        // let notify = { type: "danger", message: payload.data.message };
        state.notify = null;
        state.notify = { type: "danger", message: payload.data.message };
      
        }
      });
      builder.addCase(EditCreateticket.rejected, (state) => {
        state.status = "rejected";
      });

  },
});

export default createTicketSlice.reducer;
