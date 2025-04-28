import { createSlice } from '@reduxjs/toolkit';
import {
  QueryGroupForm,
  QueryGroupFormUpdate,
  postqueryTypeForm,
  queryTypeData,
  updateQueryTypeData
} from './QueryTypeComponetAction';
import { queryType } from './QueryTypeComponetAction';

const initialState = {
  status: '',
  err: '',
  queryTypeData: [],
  queryType: [],

  loading:{
    queryTypeData: false,
  },
  QueryGroupForm: [],
  notify: '',
  modal: {
    showModal: false,
    modalData: '',
    modalHeader: ''
  },
  updateQueryTypeData: []
};

export const queryTypeSlice = createSlice({
  name: 'queryTypeSlice',
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
    handleFormQueryGroup: (state, action) => {
      state.modal = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(queryTypeData.pending, (state) => {
      state.loading.queryTypeData = true;
      state.status = 'loading';
      state.notify = null;
    });

    builder.addCase(queryTypeData.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let queryTypeData = payload.data.data
        ?.data?.filter((d) => d.is_active === 1)
        let data = [];
        let counter = 1;
         for (const key in queryTypeData) {
          data.push({
            counter: counter++,
            id: queryTypeData[key].id,
            group_name: queryTypeData[key].group_name,
            is_active: queryTypeData[key].is_active,
            created_at: queryTypeData[key].created_at,
            created_by: queryTypeData[key].created_by,
            updated_at: queryTypeData[key].updated_at,
            updated_by: queryTypeData[key].updated_by
          });
        }
        state.status = 'succeded';
        state.showLoaderModal = false;
        state.queryTypeData = data
        state.loading.queryTypeData = false;
      }
    });
    builder.addCase(queryTypeData.rejected, (state) => {
      state.loading.queryTypeData = false;
      state.status = 'rejected';
    });

    //_____________________queryTypeDropDowm_________________________

    builder.addCase(queryType.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
    });

    builder.addCase(queryType.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let queryType = payload.data.data;

        state.status = 'succeded';
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < queryType.length; i++) {
          queryType[i].counter = count++;
        }
        state.queryType = [...queryType];
      }

      let queryTypeData = [];
      payload?.data?.data?.forEach((q) => {
        if (q.query_type_name) {
          queryTypeData.push({ value: q.id, label: q.query_type_name });
        }
      });

      state.queryTypeData = queryTypeData;
    });
    builder.addCase(queryType.rejected, (state) => {
      state.status = 'rejected';
    });

    //____________________________queryTypeForm________________________

    builder.addCase(QueryGroupForm.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
    });
    builder.addCase(QueryGroupForm.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.modal = { showModal: false, modalData: null, modalHeader: '' };

        let QueryGroupForm = payload.data.data;

        state.status = 'succeded';
        state.showLoaderModal = false;
        state.QueryGroupForm = QueryGroupForm;
      } else {
      }
    });
    builder.addCase(QueryGroupForm.rejected, (state) => {
      state.status = 'rejected';
    });

    //_____________________updateQueryGroupForm__________________________

    builder.addCase(QueryGroupFormUpdate.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
    });
    builder.addCase(QueryGroupFormUpdate.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.modal = { showModal: false, modalData: null, modalHeader: '' };

        let QueryGroupFormUpdate = payload.data.data;

        state.status = 'succeded';
        state.showLoaderModal = false;
        state.QueryGroupFormUpdate = QueryGroupFormUpdate;
      } else {
      }
    });
    builder.addCase(QueryGroupFormUpdate.rejected, (state) => {
      state.status = 'rejected';
    });

    //____________________updateQueryType____________________

    builder.addCase(updateQueryTypeData.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
    });
    builder.addCase(updateQueryTypeData.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.modal = { showModal: false, modalData: null, modalHeader: '' };

        let updateQueryTypeData = payload.data.data;

        state.status = 'succeded';
        state.showLoaderModal = false;
        state.updateQueryTypeData = updateQueryTypeData;
      } else {
      }
    });
    builder.addCase(updateQueryTypeData.rejected, (state) => {
      state.status = 'rejected';
    });

    //___________________________postqueryType____________________

    builder.addCase(postqueryTypeForm.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
    });
    builder.addCase(postqueryTypeForm.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.modal = { showModal: false, modalData: null, modalHeader: '' };

        let postqueryTypeForm = payload.data.data;

        state.status = 'succeded';
        state.showLoaderModal = false;
        state.postqueryTypeForm = postqueryTypeForm;
      } else {
      }
    });
    builder.addCase(postqueryTypeForm.rejected, (state) => {
      state.status = 'rejected';
    });
  }
});
export const { handleModalOpen, handleModalClose, handleFormQueryGroup } =
  queryTypeSlice.actions;
export default queryTypeSlice.reducer;
