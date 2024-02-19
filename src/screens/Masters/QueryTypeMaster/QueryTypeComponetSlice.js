import { createSlice } from "@reduxjs/toolkit";
import { QueryGroupForm, QueryGroupFormUpdate, postqueryTypeForm, queryTypeData, updateQueryTypeData } from "./QueryTypeComponetAction";
import { queryType } from "./QueryTypeComponetAction";

const initialState = {
  status: "",
  err: "",
  queryTypeData: [],
  queryType: [],
  queryTypeData:[],
  QueryGroupForm: [],
  notify:'',
  modal: {
    showModal: false,
    modalData: "",
    modalHeader: "",
  },
  updateQueryTypeData:[]
  
};

export const queryTypeSlice = createSlice({
  name: "queryTypeSlice",
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
    handleFormQueryGroup: (state, action) => {
      state.modal = action.payload;
    },





  },
  extraReducers: (builder) => {
    builder.addCase(queryTypeData.pending, (state) => {
      state.status = "loading";
      state.notify =null
    });

    builder.addCase(queryTypeData.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let queryTypeData = payload.data.data
          .filter((d) => d.is_active == 1)
          .map((d) => ({ value: d.id, label: d.group_name }));

        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < queryTypeData.length; i++) {
          queryTypeData[i].counter = count++;
        }
        state.queryTypeData = [...queryTypeData];
      }
    });
    builder.addCase(queryTypeData.rejected, (state) => {
      state.status = "rejected";
    });

    //_____________________queryTypeDropDowm_________________________

    builder.addCase(queryType.pending, (state) => {
      state.status = "loading";
      state.notify =null
    });

    builder.addCase(queryType.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let queryType = payload.data.data;

        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < queryType.length; i++) {
          queryType[i].counter = count++;
        }
        state.queryType = [...queryType];
      }


      let queryTypeData =[]
      payload.data.data.forEach((q) => {
        if (q.query_type_name) {
          queryTypeData.push({ value: q.id, label: q.query_type_name });
        }
      });

      state.queryTypeData= queryTypeData



    });
    builder.addCase(queryType.rejected, (state) => {
      state.status = "rejected";
    });

    //____________________________queryTypeForm________________________

    builder.addCase(QueryGroupForm.pending, (state) => {
      state.status = "loading";
      state.notify =null
    });
    builder.addCase(QueryGroupForm.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };

        let QueryGroupForm = payload.data.data;
        console.log(QueryGroupForm);
        state.status = "succeded";
        state.showLoaderModal = false;
        state.QueryGroupForm = QueryGroupForm;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(QueryGroupForm.rejected, (state) => {
      state.status = "rejected";
    });

    //_____________________updateQueryGroupForm__________________________



    
    builder.addCase(QueryGroupFormUpdate.pending, (state) => {
      state.status = "loading";
      state.notify =null
    });
    builder.addCase(QueryGroupFormUpdate.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };

        let QueryGroupFormUpdate = payload.data.data;
        console.log(QueryGroupFormUpdate);
        state.status = "succeded";
        state.showLoaderModal = false;
        state.QueryGroupFormUpdate = QueryGroupFormUpdate;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(QueryGroupFormUpdate.rejected, (state) => {
      state.status = "rejected";
    });

    //____________________updateQueryType____________________



    builder.addCase(updateQueryTypeData.pending, (state) => {
      state.status = "loading";
      state.notify =null
    });
    builder.addCase(updateQueryTypeData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };

        let updateQueryTypeData = payload.data.data;
        console.log(updateQueryTypeData);
        state.status = "succeded";
        state.showLoaderModal = false;
        state.updateQueryTypeData = updateQueryTypeData;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(updateQueryTypeData.rejected, (state) => {
      state.status = "rejected";
    });

    //___________________________postqueryType____________________


    builder.addCase(postqueryTypeForm.pending, (state) => {
      state.status = "loading";
      state.notify =null
    });
    builder.addCase(postqueryTypeForm.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };

        let postqueryTypeForm = payload.data.data;
        console.log(postqueryTypeForm);
        state.status = "succeded";
        state.showLoaderModal = false;
        state.postqueryTypeForm = postqueryTypeForm;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(postqueryTypeForm.rejected, (state) => {
      state.status = "rejected";
    });




  },
});
export const { handleModalOpen, handleModalClose,handleFormQueryGroup } = queryTypeSlice.actions;
export default queryTypeSlice.reducer;
