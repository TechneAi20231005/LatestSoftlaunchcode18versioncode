import { createSlice } from "@reduxjs/toolkit";
import {
  templateData,
  getParentData,
  getAllTypeData,
  postTemplateData,
} from "./TemplateComponetAction";

const initialState = {
  status: "",
  err: "",
  templateData: [],
  getParentData: [],
  getAllTypeData: [],
  postTemplateData:[]
};

export const templateSlice = createSlice({
  name: "templateSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
      console.log("action of modal", action.payload);
    },
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
      }
    });
    builder.addCase(templateData.rejected, (state) => {
      state.status = "rejected";
    });

    //__________________________getParentData_________________

    builder.addCase(getParentData.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getParentData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payloadparent", payload);

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
    });
    builder.addCase(postTemplateData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload Role", payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };

        let postTemplateData = payload.data.data;
        console.log(postTemplateData);
        state.status = "succeded";
        state.showLoaderModal = false;
        state.postTemplateData = postTemplateData;
      } else {
        state.notify = { type: "danger", message: payload.data.message };
      }
    });
    builder.addCase(postTemplateData.rejected, (state) => {
      state.status = "rejected";
    });









  },
});

export default templateSlice.reducer;
