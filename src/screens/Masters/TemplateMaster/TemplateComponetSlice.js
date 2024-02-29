import { createSlice } from "@reduxjs/toolkit";
import {
  templateData,
  getParentData,
  getAllTypeData,
  postTemplateData,
  updateBasketModalData,
  basketinEditData,
  addTaskinBasketData,
  getTemplateByIdData,
  exportTempateData,
} from "./TemplateComponetAction";

const initialState = {
  status: "",
  err: "",
  basketId: "",
  newData: {
    template_name: null,
    calculate_from: null,
    template_data: [
      {
        basket_name: null,
        basket_owner: null,
        basket_task: [],
      },
    ],
  },
  templateData: [],
  getParentData: [],
  getAllTypeData: [],
  postTemplateData: [],

  modal: {
    showModal: false,
    modalData: "",
    basketIndex: "",
    taskIndex: "",
    modalHeader: "",
  },
  getTemplateByIdData: [],
  addBasketModal: {
    showModal: false,
    modalAddData: null,
    modalAddHeader: null,
  },
  exportTempateData: [],
  addTaskModal: {
    showModal: false,
    modalAddData: null,
    modalAddHeader: null,
  },
  notify: "",
};

export const templateSlice = createSlice({
  name: "templateSlice",
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
    handleBasketModal: (state, action) => {
      state.addBasketModal = action.payload;
    },

    handleTaskModal: (state, action) => {
      state.basketId = action.payload.modalData.basket_id;

      state.addTaskModal = action.payload;
    },

    // hideNotification(state) {
    //   state.notify = false;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(templateData.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(templateData.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let templateData = payload.data.data;

        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < templateData.length; i++) {
          templateData[i].counter = count++;
        }
        state.templateData = [...templateData];
        console.log("templateData", templateData);

        let exportTemplateData = [];
        console.log("exportTemplateData", exportTemplateData);
        for (const i in templateData) {
          exportTemplateData.push({
            Sr: templateData[i].counter,
            calculate_from: templateData[i].calculate_from,
            template_name: templateData[i].template_name,

            remark: templateData[i].remark,

            Status: templateData[i].is_active ? "Active" : "Deactive",
            created_at: templateData[i].created_at,
            created_by: templateData[i].created_by,
            updated_at: templateData[i].updated_at,
            updated_by: templateData[i].updated_by,
          });
          state.exportTemplateData = exportTemplateData;
        }
      }
    });
    builder.addCase(templateData.rejected, (state) => {
      state.status = "rejected";
    });

    //______________________exportTempateData__________

    builder.addCase(exportTempateData.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(exportTempateData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payloadtemp", payload);

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let exportTempateData = payload.data.data;

        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < exportTempateData.length; i++) {
          exportTempateData[i].counter = count++;
        }
        state.exportTempateData = [...exportTempateData];
        console.log("exportTempateData", exportTempateData);
      }
    });
    builder.addCase(exportTempateData.rejected, (state) => {
      state.status = "rejected";
    });

    //__________________________getParentData_________________

    builder.addCase(getParentData.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getParentData.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getParentData = payload.data.data.map((d) => ({
          value: d.id,
          label: d.type_name,
        }));

        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getParentData.length; i++) {
          getParentData[i].counter = count++;
        }
        state.getParentData = [...getParentData];
      }
    });
    builder.addCase(getParentData.rejected, (state) => {
      state.status = "rejected";
    });
    //__________________________getAllType________________________

    builder.addCase(getAllTypeData.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });

    builder.addCase(getAllTypeData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("typeData", payload);

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getAllTypeData = payload.data.data
          .filter((d) => d.type === "TICKET" && d.is_active == 1)
          .map((d) => ({ value: d.id, label: d.type_name }));

        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getAllTypeData.length; i++) {
          getAllTypeData[i].counter = count++;
        }
        state.getAllTypeData = [...getAllTypeData];
      }
    });
    builder.addCase(getAllTypeData.rejected, (state) => {
      state.status = "rejected";
    });

    //____________________postTemplateComponent______________

    builder.addCase(postTemplateData.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });
    builder.addCase(postTemplateData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let postTemplateData = payload.data.data;
        state.status = "succeded";
        state.showLoaderModal = false;
        state.postTemplateData = postTemplateData;
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };
      } else {
        state.notify = null;
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(postTemplateData.rejected, (state) => {
      state.status = "rejected";
    });
    //__________________________updateBasketModalData______________

    builder.addCase(updateBasketModalData.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });
    builder.addCase(updateBasketModalData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };

        let updateBasketModalData = payload.data.data;
        console.log(updateBasketModalData);
        state.status = "succeded";
        state.showLoaderModal = false;
        state.updateBasketModalData = updateBasketModalData;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(updateBasketModalData.rejected, (state) => {
      state.status = "rejected";
    });

    //_______________________BasketEdit______________________

    builder.addCase(basketinEditData.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });
    builder.addCase(basketinEditData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        state.addBasketModal = {
          showModal: false,
          modalAddData: null,
          modalAddHeader: null,
        };

        let basketinEditData = payload.data.data;
        console.log(basketinEditData);
        state.status = "succeded";
        state.showLoaderModal = false;
        state.basketinEditData = basketinEditData;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(basketinEditData.rejected, (state) => {
      state.status = "rejected";
    });

    //________________________addTaskInBasket______________________________

    builder.addCase(addTaskinBasketData.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });
    builder.addCase(addTaskinBasketData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        state.addTaskModal = {
          showModal: false,
          modalAddData: null,
          modalAddHeader: null,
        };

        let addTaskinBasketData = payload.data.data;
        console.log(addTaskinBasketData);
        state.status = "succeded";
        state.showLoaderModal = false;
        state.addTaskinBasketData = addTaskinBasketData;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(addTaskinBasketData.rejected, (state) => {
      state.status = "rejected";
    });

    //____________________________getTemplateById____________________

    builder.addCase(getTemplateByIdData.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });
    builder.addCase(getTemplateByIdData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      // if (payload?.status === 200 && payload?.data?.status === 1) {
      //   state.notify = { type: "success", message: payload.data.message };
      //   state.addTaskModal = {  showModal: false,
      //     modalAddData: null,
      //     modalAddHeader: null, };

      //   let getTemplateByIdData = payload.data.data;
      //   console.log(getTemplateByIdData);
      //   state.status = "succeded";
      //   state.showLoaderModal = false;
      //   state.getTemplateByIdData = getTemplateByIdData;
      // } else {
      //   state.notify = { type: "danger", message: payload.data.message };
      // }
    });
    builder.addCase(getTemplateByIdData.rejected, (state) => {
      state.status = "rejected";
    });
  },
});

export const {
  handleModalOpen,
  hideNotification,
  handleModalClose,
  handleBasketModal,
  handleTaskModal,
} = templateSlice.actions;

export default templateSlice.reducer;
