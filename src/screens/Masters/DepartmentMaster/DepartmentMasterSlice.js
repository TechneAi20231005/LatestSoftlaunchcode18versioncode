import { createSlice } from "@reduxjs/toolkit";
import {
  departmentData,
  postdepartment,
  updateDepartment,
} from "./DepartmentMasterAction";

const initialState = {
  status: "",
  err: "",
  departmentData: [],
  exportDepartmentData:[],
  sortDepartmentData:[],
  modal: {
    showModal: false,
    modalData: "",
    modalHeader: "",
  },
};

export const departmentMasterSlice = createSlice({
  name: "departmentMasterSlice",
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
    builder.addCase(departmentData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(departmentData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let departmentData = payload.data.data;
        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < departmentData.length; i++) {
          departmentData[i].counter = count++;
        }
        state.departmentData = [...departmentData];
        let exportDepartmentData = [];

let filterdata=payload.data.data.filter((d) => d.is_active == 1)
        let sortDepartmentData=[]
        for (const key in filterdata) {
          if (filterdata[key].department) {
            sortDepartmentData.push({
              value: filterdata[key].id,
              label: filterdata[key].department,
            });
          }
        }

        state.sortDepartmentData=sortDepartmentData

        for (const i in departmentData) {
          exportDepartmentData.push({
            Sr: departmentData[i].counter,
            Department: departmentData[i].department,
            Status: departmentData[i].is_active ? "Active" : "Deactive",
            Remark: departmentData[i].remark,
            created_at: departmentData[i].created_at,
            created_by: departmentData[i].created_by,
            updated_at: departmentData[i].updated_at,
            updated_by: departmentData[i].updated_by,
          });
        }
        state.exportDepartmentData=exportDepartmentData




      }
    });
    builder.addCase(departmentData.rejected, (state) => {
      state.status = "rejected";
    });

    //__________________________post____________________________

    builder.addCase(postdepartment.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(postdepartment.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };

        let postdepartment = payload.data.data;
        console.log(postdepartment);
        state.status = "succeded";
        state.showLoaderModal = false;
        state.postdepartment = postdepartment;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(postdepartment.rejected, (state) => {
      state.status = "rejected";
    });

    //_____________________________updateData______________________________
    builder.addCase(updateDepartment.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updateDepartment.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };

        let updateDepartment = payload.data.data;
        console.log(updateDepartment);
        state.status = "succeded";
        state.showLoaderModal = false;
        state.updateDepartment = updateDepartment;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(updateDepartment.rejected, (state) => {
      state.status = "rejected";
    });
  },
});

export const { handleModalOpen, handleModalClose } =
  departmentMasterSlice.actions;

export default departmentMasterSlice.reducer;
