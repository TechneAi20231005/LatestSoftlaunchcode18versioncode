// import { createSlice } from "@reduxjs/toolkit";
// import { getAllTaskData, getBasketTaskData } from "./TaskComponentAction";


// const initialState = {
//   status: "",
//   err: "",
//   basketData:[],
//   taskData:[]
  
// };

// export const TaskcomponentSlice = createSlice({
//   name: "TaskcomponentSlice",
//   initialState,
//   reducers: {
//     loaderModal: (state, action) => {
//       state.showLoaderModal = action.payload;
//       console.log("action of modal", action.payload);
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(getBasketTaskData.pending, (state) => {
//       state.status = "loading";
//     });
//     builder.addCase(getBasketTaskData.fulfilled,(state, action) => {
//       const { payload } = action;
//       console.log("p",payload)
//       if (payload?.status === 200 && payload?.data?.status === 1) {
//         let basketData = payload
//         console.log("bas",basketData)
//         state.basketData = basketData
//         state.status = "succeded"
//       }
//     });
//     builder.addCase(getBasketTaskData.rejected, (state) => {
//       state.status = "rejected";
//     });

//     builder.addCase(getAllTaskData.pending, (state) => {
//         state.status = "loading";
//       });
//       builder.addCase(getAllTaskData.fulfilled,(state, action) => {
//         const { payload } = action;
//         console.log("p",payload)
//         if (payload?.status === 200 && payload?.data?.status === 1) {
//           let taskData = payload.data.data
//           console.log("bas",taskData)

//           state.taskData = taskData
//           state.status = "succeded"
//         }
//       });
//       builder.addCase(getAllTaskData.rejected, (state) => {
//         state.status = "rejected";
//       });
  

// }
// });
// export default TaskcomponentSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";
import {
  PostTimerDataChange,
  getAllTaskData,
  getBasketByIdData,
  getBasketTaskData,
  getmoduleSetting,
  moduleSetting,
  postSubTask,
  taskModal,
  updateBasketDetails,
  updatetaskModal,
} from "./TaskComponentAction";

const initialState = {
  status: "",
  err: "",
  basketData: [],
  taskData: [],
  taskDetails: [],
  notify: {},
  updateTaskDetails: [],
  updateBasketDetail: [],
  postTimer: [],
  timeState: null,
  basketData:[],
  moduleSettingData:""
};

export const TaskcomponentSlice = createSlice({
  name: "TaskcomponentSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
    },
    handleModalInStore: (state, action) => {
      state.modal = action.payload;
    },
    handleModalClose: (state, action) => {
      state.modal = action.payload;
    },
    handleTimerStatus: (state, action) => {
     
      state.timeState = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getBasketTaskData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getBasketTaskData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let basketData = payload;
        state.basketData = basketData;
        state.status = "succeded";
      }
    });
    builder.addCase(getBasketTaskData.rejected, (state) => {
      state.status = "rejected";
    });

    // get task data

    builder.addCase(getAllTaskData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getAllTaskData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let taskData = payload.data.data;

        state.taskData = taskData;
        state.status = "succeded";
      }
    });
    builder.addCase(getAllTaskData.rejected, (state) => {
      state.status = "rejected";
    });

    // post Task details
    builder.addCase(taskModal.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(taskModal.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let taskDetails = payload.data.data;

        state.taskDetails = taskDetails;
        state.status = "succeded";
        state.notify = null;
        state.notify = { type: "success", message: payload.data.message };
        let modal = { showModal: false, modalData: "", modalHeader: "" };
        state.modal = modal;
      } else {
        let notify = { type: "danger", message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(taskModal.rejected, (state) => {
      state.status = "rejected";
    });

    // Update Task Details

    builder.addCase(updatetaskModal.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updatetaskModal.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let updateTaskDetails = payload.data.data;

        state.updateTaskDetails = updateTaskDetails;
        state.status = "succeded";
        state.notify = null;
        state.notify = { type: "success", message: payload.data.message };
        let modal = { showModal: false, modalData: "", modalHeader: "" };
        state.modal = modal;
      } else {
        let notify = { type: "danger", message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(updatetaskModal.rejected, (state) => {
      state.status = "rejected";
    });

    //update Basket details

    builder.addCase(updateBasketDetails.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updateBasketDetails.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let updateBasketDetail = payload.data.data;

        state.updateBasketDetail = updateBasketDetail;
        state.status = "succeded";
        state.notify = null;
        state.notify = { type: "success", message: payload.data.message };
        let modal = { showModal: false, modalData: "", modalHeader: "" };
        state.modal = modal;
      } else {
        let notify = { type: "danger", message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(updateBasketDetails.rejected, (state) => {
      state.status = "rejected";
    });

    // post timer data

    builder.addCase(PostTimerDataChange.pending, (state,action) => {
      console.log("action payload pending" ,action.payload.data.data )
      state.status = "loading";
     
    });
    builder.addCase(PostTimerDataChange.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
       
        state.timeState = payload.data.data
        state.status = "succeded";
        state.notify = null;
        state.notify = { type: "success", message: payload.data.message };
        // let modal = { showModal: false, modalData: "", modalHeader: "" };
        // state.modal = modal;
      } else {
        let notify = { type: "danger", message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(PostTimerDataChange.rejected, (state) => {
      state.status = "rejected";
    });



    builder.addCase(getBasketByIdData.pending, (state,action) => {
      console.log("action payload pending" ,action.payload.data.data )
      state.status = "loading";
     
    });
    builder.addCase(getBasketByIdData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
       
        let basketData = payload.data.data
        state.status = "succeded";
        state.notify = null;
        state.notify = { type: "success", message: payload.data.message };
        state.basketData= [...basketData]
        // let modal = { showModal: false, modalData: "", modalHeader: "" };
        // state.modal = modal;
      } else {
        let notify = { type: "danger", message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(getBasketByIdData.rejected, (state) => {
      state.status = "rejected";
    });




    builder.addCase(getmoduleSetting.pending, (state,action) => {
      state.status = "loading";
     
    });
    builder.addCase(getmoduleSetting.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
       
        let moduleSettingData = payload.data.data
        state.moduleSettingData= moduleSettingData
        console.log("module",moduleSettingData)
        state.status = "succeded";
        state.notify = null;
        state.notify = { type: "success", message: payload.data.message };
        // let modal = { showModal: false, modalData: "", modalHeader: "" };
        // state.modal = modal;
      } else {
        let notify = { type: "danger", message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(getmoduleSetting.rejected, (state) => {
      console.log("hello")
      state.status = "rejected";
    });
  },
});
export const {
  handleModalInStore,
  handleModalClose,
  loaderModal,
  handleTimerStatus,
} = TaskcomponentSlice.actions;
export default TaskcomponentSlice.reducer;
