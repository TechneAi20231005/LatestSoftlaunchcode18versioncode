import { createSlice } from "@reduxjs/toolkit";
import {
  getCustomerMappingData,
  getQueryTypeData,
  getTemplateData,
  getcustomerTypeData,
} from "./CustomerMappingAction";

const initialState = {
  status: "",
  err: "",
  notify: "",
  modal: {
    showModal: false,
    modalData: "",
    modalHeader: "",
  },
  customerMappingData: [],
  exportTempData: [],
  customerTypeData: [],
  queryTypeData: [],
  queryTypeDropDownData: [],
  templateDropDownData: [],
};

export const CustomerMappingSlice = createSlice({
  name: "CustomerMappingSlice",
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
    builder.addCase(getCustomerMappingData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getCustomerMappingData.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.status = "succeded";
        let counter = 1;
        const data = payload.data.data;
        let customerMappingData = [];
        for (const key in data) {
          customerMappingData.push({
            Sro: counter++,
            id: data[key].id,
            query_type_name: data[key].query_type_name,
            template_name: data[key].template_name,
            dynamic_form_name: data[key].dynamic_form_name,
            project_name: data[key].project_name,
            module_name: data[key].module_name,
            sub_module_name: data[key].sub_module_name,
            department_name: data[key].department_name,
            priority: data[key].priority,
            approach: data[key].approach,
            is_default: data[key].is_default,
            is_active: data[key].is_active,
            created_at: data[key].created_at,
            created_by: data[key].created_by,
            updated_at: data[key].updated_at,
            updated_by: data[key].updated_by,
          });
        }
        state.customerMappingData = customerMappingData;
        let exportTempData = [];
        let exportCounter = 1;
        for (const i in data) {
          exportTempData.push({
            Sr: exportCounter++,
            // Customer:data[i].
            Query: data[i].query_type_name,
            Template: data[i].template_name,
            Department: data[i].department_name,
            Priority: data[i].priority,
            Approach: data[i].approach,
            remark:data[i].remark,
            is_active: data[i].is_active ==1 ?"Active": "Deactive",
         
            // confirmation_required:[i].confirmation_required,
            dynamic_form_name: data[i].dynamic_form_name,
            customer_type_name:data[i].customer_type_name,
            confirmation_required:data[i].confirmation_required==1 ?'Yes':'no',
            created_at: data[i].created_at,
            created_by: data[i].created_by,
            updated_at: data[i].updated_at,
            updated_by: data[i].updated_by,
          
            
          });
        }
        state.exportTempData = exportTempData;
      }
    });
    builder.addCase(getCustomerMappingData.rejected, (state) => {
      state.status = "rejected";
    });

    builder.addCase(getcustomerTypeData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getcustomerTypeData.fulfilled, (state, action) => {
      const { payload } = action;
      state.notify = null;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        const select = payload.data.data
          .filter((d) => d.is_active)
          .map((d) => ({ value: d.id, label: d.type_name }));
        state.customerTypeData = select;

        state.status = "succeded";

        state.notify = { type: "success", message: payload.data.message };
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(getcustomerTypeData.rejected, (state) => {
      state.status = "rejected";
    });

    builder.addCase(getQueryTypeData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getQueryTypeData.fulfilled, (state, action) => {
      const { payload } = action;
      state.notify = null;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        const queryTypeData = payload.data.data.filter((d) => d.is_active == 1);
        const queryTypeDropDownData = payload.data.data
          .filter((d) => d.is_active === 1)
          .map((d) => ({ value: d.id, label: d.query_type_name }));
        state.queryTypeData = queryTypeData;
        state.queryTypeDropDownData = queryTypeDropDownData;
        state.status = "succeded";

        state.notify = { type: "success", message: payload.data.message };
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(getQueryTypeData.rejected, (state) => {
      state.status = "rejected";
    });

    builder.addCase(getTemplateData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getTemplateData.fulfilled, (state, action) => {
      const { payload } = action;
      state.notify = null;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let templateDropDownData = payload.data.data.map((d) => ({
          value: d.id,
          label: d.template_name,
        }));
        state.templateDropDownData = templateDropDownData;
        state.status = "succeded";

        state.notify = { type: "success", message: payload.data.message };
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(getTemplateData.rejected, (state) => {
      state.status = "rejected";
    });
  },
});
export default CustomerMappingSlice.reducer;
