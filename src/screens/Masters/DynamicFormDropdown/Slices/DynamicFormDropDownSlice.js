import { createSlice } from "@reduxjs/toolkit";
import { dynamicFormData, dynamicFormDropDownData, getAllDropDownData } from "./DynamicFormDropDownAction";

const initialState = {
  status: "",
  err: "",
  notify: "",
  modal: {
    showModal: false,
    modalData: "",
    modalHeader: "",
  },
getDynamicFormDropDownData:[],
exportDynamicFormDropDownData:[],
getDynamicFormData:[],
exportDynamicFormData:[],
dropDownData:{ index: 0 }
};

export const DynamicFormDropDownSlice = createSlice({
  name: "DynamicFormDropDownSlice",
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
    builder.addCase(dynamicFormDropDownData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(dynamicFormDropDownData.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.status = "succeded";
        let counter = 1;
        let getDynamicFormData= []
                const temp = payload.data.data
                for (const key in temp) {
                    getDynamicFormData.push({
                        counter: counter++,
                        id: temp[key].id,
                        template_name: temp[key].template_name,
                        is_active: temp[key].is_active,
                        remark: temp[key].remark,
                        created_at: temp[key].created_at,
                        created_by: temp[key].created_by,
                        updated_at: temp[key].updated_at,
                        updated_by: temp[key].updated_by
                    })

                }
        
        state.getDynamicFormData=getDynamicFormData
let exportDynamicFormData=[]
        for (const i in temp) {
            exportDynamicFormData.push({
                Sr: temp[i].counter,
                form_Name: temp[i].template_name,
                Status: temp[i].is_active ? 'Active' : 'Deactive',
                created_at: temp[i].created_at,
                created_by: temp[i].created_by,
                updated_at: temp[i].updated_at,
                updated_by: temp[i].updated_by,
            })
          }
          state.exportDynamicFormData=exportDynamicFormData
    }
    });
    builder.addCase(dynamicFormDropDownData.rejected, (state) => {
      state.status = "rejected";
    });


    builder.addCase(dynamicFormData.pending, (state) => {
        state.status = "loading";
      });
      builder.addCase(dynamicFormData.fulfilled, (state, action) => {
        const { payload } = action;
  
        if (payload?.status === 200 && payload?.data?.status === 1) {
          state.status = "succeded";
          let counter = 1;
          let getDynamicFormDropDownData= []
                  const temp = payload.data.data
                  console.log("res---",temp)
                  for (const key in temp) {
                      getDynamicFormDropDownData.push({
                          counter: counter++,
                          id: temp[key].id,
                          template_name: temp[key].template_name,
                          is_active: temp[key].is_active,
                          updated_at: temp[key].updated_at,
                          updated_by: temp[key].updated_by,
                          created_at: temp[key].created_at,
                          created_by: temp[key].created_by,
                      })
  
                  }
          
          state.getDynamicFormDropDownData=getDynamicFormDropDownData
  let exportDynamicFormDropDownData=[]
          for (const i in temp) {
              exportDynamicFormDropDownData.push({
                Sr: counter++,
                Query: temp[i].query_type_name,
                Template: temp[i].template_name,
                Department: temp[i].department_name,
                Priority: temp[i].priority,
                Approach: temp[i].approach,
              })
            }
            state.exportDynamicFormDropDownData=exportDynamicFormDropDownData
      }
      });
      builder.addCase(dynamicFormData.rejected, (state) => {
        state.status = "rejected";
      });



      builder.addCase(getAllDropDownData.pending, (state) => {
        state.status = "loading";
      });
      builder.addCase(getAllDropDownData.fulfilled, (state, action) => {
        const { payload } = action;
  
        if (payload?.status === 200 && payload?.data?.status === 1) {
          state.status = "succeded";
          let dropDownData= payload.data.data.map((d) => ({ label: d.dropdown_name, value: d.id }))
          state.dropDownData=dropDownData
      }
      });
      builder.addCase(getAllDropDownData.rejected, (state) => {
        state.status = "rejected";
      });




}})
export default DynamicFormDropDownSlice.reducer;
