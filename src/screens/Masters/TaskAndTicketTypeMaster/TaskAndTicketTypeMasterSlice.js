import { createSlice } from "@reduxjs/toolkit";
import {
  taskAndTicketMaster,
  getParentDropdown,
  postTaskandTicket,
  updateTaskAndTicketType
} from "./TaskAndTicketTypeMasterAction";

const initialState = {
  status: "",
  err: "",
  taskAndTicketMaster: [],
  getParentDropdown: [],
  postTaskandTicket: "",
  notify: "",
  modal: {
    showModal: false,
    modalData: "",
    modalHeader: "",
  },
};

export const taskandticketTypeSlice = createSlice({
  name: "taskandticketTypeSlice",
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
    builder.addCase(taskAndTicketMaster.pending, (state) => {
      state.status = "loading";
      state.notify = null
    });

    builder.addCase(taskAndTicketMaster.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let taskAndTicketMaster = payload.data.data;

        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < taskAndTicketMaster.length; i++) {
          taskAndTicketMaster[i].counter = count++;
        }
        state.taskAndTicketMaster = [...taskAndTicketMaster];
      }
    });
    builder.addCase(taskAndTicketMaster.rejected, (state) => {
      state.status = "rejected";
    });

    //_____________________getPrarent________________

    builder.addCase(getParentDropdown.pending, (state) => {
      state.status = "loading";
      state.notify = null
    });

    builder.addCase(getParentDropdown.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getParentDropdown = payload.data.data.map((d) => ({
          value: d.id,
          label: d.type_name,
        }));

        state.status = "succeded";
        state.showLoaderModal = false;
        // let count = 1;
        // for (let i = 0; i < taskAndTicketMaster.length; i++) {
        //   taskAndTicketMaster[i].counter = count++;
        // }
        state.getParentDropdown = [...getParentDropdown];
      }
    });
    builder.addCase(getParentDropdown.rejected, (state) => {
      state.status = "rejected";
    });

    //____________________postTaskAndTicketType_____________________

    builder.addCase(postTaskandTicket.pending, (state) => {
      state.status = "loading";
      state.notify = null
    });

    builder.addCase(postTaskandTicket.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let postTaskandTicket = payload.data.data;
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };


        state.status = "succeded";
        state.showLoaderModal = false;
       
        state.postTaskandTicket = [...postTaskandTicket];
      }
    });
    builder.addCase(postTaskandTicket.rejected, (state) => {
      state.status = "rejected";
    });

    //__________________updateTaskAndTicketType____________


    builder.addCase(updateTaskAndTicketType.pending, (state) => {
      state.status = "loading";
      state.notify = null
    });

    builder.addCase(updateTaskAndTicketType.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let updateTaskAndTicketType = payload.data.data;
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };


        state.status = "succeded";
        state.showLoaderModal = false;
       
        state.updateTaskAndTicketType = [...updateTaskAndTicketType];
      }
    });
    builder.addCase(updateTaskAndTicketType.rejected, (state) => {
      state.status = "rejected";
    });

  },
});

export const { handleModalOpen, handleModalClose } = taskandticketTypeSlice.actions;
export default taskandticketTypeSlice.reducer;
