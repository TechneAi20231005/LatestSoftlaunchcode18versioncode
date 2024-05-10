import { createSlice } from '@reduxjs/toolkit';
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
} from './TemplateComponetAction';

const initialState = {
  status: '',
  err: '',
  basketId: '',
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
  isLoading: {
    templateDataList: false,
  },
  templateData: [],
  getParentData: [],
  getAllTypeData: [],
  postTemplateData: [],

  modal: {
    showModal: false,
    modalData: '',
    basketIndex: '',
    taskIndex: '',
    modalHeader: '',
  },
  getTemplateByIdData: [],
  addBasketModal: {
    showModal: false,
    modalAddData: null,
    modalAddHeader: null,
  },
  exportData: [],
  addTaskModal: {
    showModal: false,
    modalAddData: null,
    modalAddHeader: null,
  },
  notify: '',
};

export const templateSlice = createSlice({
  name: 'templateSlice',
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
    handleBasketModal: (state, action) => {
      state.addBasketModal = action.payload;
    },

    handleTaskModal: (state, action) => {
      state.basketId = action.payload.modalData.basket_id;

      state.addTaskModal = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(templateData.pending, state => {
      state.status = 'loading';
      state.isLoading.templateDataList = true;
    });

    builder.addCase(templateData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.templateDataList = false;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let templateData = payload.data.data;

        state.status = 'succeded';
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < templateData.length; i++) {
          templateData[i].counter = count++;
        }
        state.templateData = [...templateData];
      }
    });
    builder.addCase(templateData.rejected, state => {
      state.status = 'rejected';
      state.isLoading.templateDataList = false;
    });

    //______________________exportTempateData__________

    builder.addCase(exportTempateData.pending, state => {
      state.status = 'loading';
      state.isLoading.templateDataList = true;
    });

    builder.addCase(exportTempateData.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let exportTempateData = payload.data.data;
        state.isLoading.templateDataList = false;

        state.status = 'succeded';
        state.showLoaderModal = false;

        let exportData = [];
        let count = 1;
        for (let i = 0; i < exportTempateData.length; i++) {
          exportTempateData[i].counter = count++;
        }

        for (const i in exportTempateData) {
          exportData.push({
            Sr: exportTempateData[i].counter,
            template_name: exportTempateData[i].template_name,
            calculate_from: exportTempateData[i].calculate_from,
            basket_name: exportTempateData[i].basket_name,
            'Assign To': exportTempateData[i].basket_owner,
            task: exportTempateData[i].task,

            'Day Required': exportTempateData[i].days,
            'Hours Required': exportTempateData[i].total_hours,
            start_days: exportTempateData[i].start_days,
            end_days: exportTempateData[i].end_days,

            remark: exportTempateData[i].remark,

            Status: exportTempateData[i].is_active ? 'Active' : 'Deactive',
            created_at: exportTempateData[i].created_at,
            created_by: exportTempateData[i].created_by,
            updated_at: exportTempateData[i].updated_at,
            updated_by: exportTempateData[i].updated_by,
          });
          state.exportData = exportData;
        }
      }
    });
    builder.addCase(exportTempateData.rejected, state => {
      state.status = 'rejected';
      state.isLoading.templateDataList = false;
    });

    //__________________________getParentData_________________

    builder.addCase(getParentData.pending, state => {
      state.status = 'loading';
      state.isLoading.templateDataList = true;
    });

    builder.addCase(getParentData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.templateDataList = false;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getParentData = payload.data.data.map(d => ({
          value: d.id,
          label: d.type_name,
        }));

        state.status = 'succeded';
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getParentData.length; i++) {
          getParentData[i].counter = count++;
        }
        state.getParentData = [...getParentData];
      }
    });
    builder.addCase(getParentData.rejected, state => {
      state.status = 'rejected';
      state.isLoading.templateDataList = false;
    });
    //__________________________getAllType________________________

    builder.addCase(getAllTypeData.pending, state => {
      state.status = 'loading';
      state.isLoading.templateDataList = true;
      state.notify = null;
    });

    builder.addCase(getAllTypeData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.templateDataList = false;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getAllTypeData = payload.data.data
          .filter(d => d.type === 'TICKET' && d.is_active == 1)
          .map(d => ({ value: d.id, label: d.type_name }));

        state.status = 'succeded';
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getAllTypeData.length; i++) {
          getAllTypeData[i].counter = count++;
        }
        state.getAllTypeData = [...getAllTypeData];
      }
    });
    builder.addCase(getAllTypeData.rejected, state => {
      state.status = 'rejected';
      state.isLoading.templateDataList = false;
    });

    //____________________postTemplateComponent______________

    builder.addCase(postTemplateData.pending, state => {
      state.status = 'loading';
      state.isLoading.templateDataList = false;
      state.notify = null;
    });
    builder.addCase(postTemplateData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.templateDataList = false;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let postTemplateData = payload.data.data;
        state.status = 'succeded';
        state.showLoaderModal = false;
        state.postTemplateData = postTemplateData;
        state.notify = { type: 'success', message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: '' };
      } else {
        state.notify = null;
        state.notify = { type: 'danger', message: payload.data.message };
      }
    });
    builder.addCase(postTemplateData.rejected, state => {
      state.status = 'rejected';
      state.isLoading.templateDataList = false;
    });
    //__________________________updateBasketModalData______________

    builder.addCase(updateBasketModalData.pending, state => {
      state.status = 'loading';
      state.notify = null;
      state.isLoading.templateDataList = true;
    });
    builder.addCase(updateBasketModalData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.templateDataList = false;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: 'success', message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: '' };

        let updateBasketModalData = payload.data.data;
        state.status = 'succeded';
        state.showLoaderModal = false;
        state.updateBasketModalData = updateBasketModalData;
      } else {
        state.notify = { type: 'danger', message: payload.data.message };
      }
    });
    builder.addCase(updateBasketModalData.rejected, state => {
      state.status = 'rejected';
      state.isLoading.templateDataList = false;
    });

    //_______________________BasketEdit______________________

    builder.addCase(basketinEditData.pending, state => {
      state.status = 'loading';
      state.isLoading.templateDataList = true;
      state.notify = null;
    });
    builder.addCase(basketinEditData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.templateDataList = false;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: 'success', message: payload.data.message };
        state.addBasketModal = {
          showModal: false,
          modalAddData: null,
          modalAddHeader: null,
        };

        let basketinEditData = payload.data.data;
        state.status = 'succeded';
        state.showLoaderModal = false;
        state.basketinEditData = basketinEditData;
      } else {
        state.notify = { type: 'danger', message: payload.data.message };
      }
    });
    builder.addCase(basketinEditData.rejected, state => {
      state.status = 'rejected';
      state.isLoading.templateDataList = false;
    });

    //________________________addTaskInBasket______________________________

    builder.addCase(addTaskinBasketData.pending, state => {
      state.status = 'loading';
      state.notify = null;
      state.isLoading.templateDataList = true;
    });
    builder.addCase(addTaskinBasketData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.templateDataList = false;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: 'success', message: payload.data.message };
        state.addTaskModal = {
          showModal: false,
          modalAddData: null,
          modalAddHeader: null,
        };

        let addTaskinBasketData = payload.data.data;
        state.status = 'succeded';
        state.showLoaderModal = false;
        state.addTaskinBasketData = addTaskinBasketData;
      } else {
        state.notify = { type: 'danger', message: payload.data.message };
      }
    });
    builder.addCase(addTaskinBasketData.rejected, state => {
      state.status = 'rejected';
      state.isLoading.templateDataList = false;
    });

    //____________________________getTemplateById____________________

    builder.addCase(getTemplateByIdData.pending, state => {
      state.status = 'loading';
      state.notify = null;
      state.isLoading.templateDataList = true;
    });
    builder.addCase(getTemplateByIdData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.templateDataList = false;
    });
    builder.addCase(getTemplateByIdData.rejected, state => {
      state.status = 'rejected';
      state.isLoading.templateDataList = false;
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
