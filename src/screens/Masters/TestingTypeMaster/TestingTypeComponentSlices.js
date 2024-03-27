import { createSlice } from "@reduxjs/toolkit";
import {
  postTesting,
  testingData,
  updateTesting,
} from "./TestingTypeComponentAction";

const initialState = {
  status: "",
  err: "",
  testingData: [],
  notify: "",
  exportTestingData: [],
  modal: {
    showModal: false,
    modalData: "",
    modalHeader: "",
  },
};

export const testingtypeSlice = createSlice({
  name: "testingtypeSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
    },
    handleModalOpen: (state, action) => {
      state.modal = action.payload;
    },
    handleModalClose: (state, action) => {
      state.modal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(testingData.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });

    builder.addCase(testingData.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let testingData = payload.data.data;
        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < testingData.length; i++) {
          testingData[i].counter = count++;
        }
        state.testingData = [...testingData];
        let exportTestingData = [];

        for (const i in testingData) {
          exportTestingData.push({
            Sr: testingData[i].counter,
            testing_type: testingData[i].testing_type,
            Status: testingData[i].is_active ? "Active" : "Deactive",
            Remark: testingData[i].remark,
            created_at: testingData[i].created_at,
            created_by: testingData[i].created_by,
            updated_at: testingData[i].updated_at,
            updated_by: testingData[i].updated_by,
          });
        }

        state.exportTestingData = exportTestingData;
      }
    });
    builder.addCase(testingData.rejected, (state) => {
      state.status = "rejected";
    });
    //_________________________________PostTesing___________

    builder.addCase(postTesting.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });
    builder.addCase(postTesting.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };

        let postTesting = payload.data.data;

        state.status = "succeded";
        state.showLoaderModal = false;
        state.postTesting = postTesting;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(postTesting.rejected, (state) => {
      state.status = "rejected";
    });

    //_____________________________updateTesing_____________________

    builder.addCase(updateTesting.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });
    builder.addCase(updateTesting.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };

        let updateTesting = payload.data.data;

        state.status = "succeded";
        state.showLoaderModal = false;
        state.updateTesting = updateTesting;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(updateTesting.rejected, (state) => {
      state.status = "rejected";
    });
  },
});
export const { handleModalClose, handleModalOpen } = testingtypeSlice.actions;

export default testingtypeSlice.reducer;
