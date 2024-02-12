import { createSlice } from "@reduxjs/toolkit";
import { subModuleMaster, postSubModuleMaster, getSubModuleById } from "./SubModuleMasterAction";

const initialState = {
  status: "",
  err: "",
  subModuleMaster: [],
  postSubModuleMaster: "",
  getSubModuleById:[],
  sortSubModuleData:[]
};

export const submoduleSlice = createSlice({
  name: "submoduleSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
      console.log("action of modal", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(subModuleMaster.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(subModuleMaster.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let subModuleMaster = payload.data.data;

        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < subModuleMaster.length; i++) {
          subModuleMaster[i].counter = count++;
        }

        let sortSubModuleData =payload.data.data.filter((d) => d.is_active == 1)
        state.sortSubModuleData=sortSubModuleData
        
        state.subModuleMaster = [...subModuleMaster];
      }
    });
    builder.addCase(subModuleMaster.rejected, (state) => {
      state.status = "rejected";
    });

    //__________________postSubModule_____________________

    builder.addCase(postSubModuleMaster.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(postSubModuleMaster.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload", payload);

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let postSubModuleMaster = payload.data.data;

        state.status = "succeded";
        state.showLoaderModal = false;
        // let count = 1;
        // for (let i = 0; i < postSubModuleMaster.length; i++) {
        //   postSubModuleMaster[i].counter = count++;
        // }
        state.postSubModuleMaster = postSubModuleMaster;
      }
    });
    builder.addCase(postSubModuleMaster.rejected, (state) => {
      state.status = "rejected";
    });


    //____________________getSubModuleById_________________

    builder.addCase(getSubModuleById.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getSubModuleById.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("getSubModuleByIdsss", payload);

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getSubModuleById = payload.data.data;

        state.status = "succeded";
        state.showLoaderModal = false;
        // let count = 1;
        // for (let i = 0; i < postSubModuleMaster.length; i++) {
        //   postSubModuleMaster[i].counter = count++;
        // }
        state.getSubModuleById = getSubModuleById;
      }
    });
    builder.addCase(getSubModuleById.rejected, (state) => {
      state.status = "rejected";
    });




  },
});

export default submoduleSlice.reducer;
