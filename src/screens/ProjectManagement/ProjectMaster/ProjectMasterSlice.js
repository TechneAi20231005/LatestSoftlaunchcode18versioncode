import { createSlice } from "@reduxjs/toolkit";

import {
  getprojectData,
  postprojectData,
  updateprojectMaster,
  getprojectByID,
} from "./ProjectMasterAction";

const initialState = {
  status: "",
  err: "",
  moduleMaster: [],
  getmoduleById: [],
  notify: "",
  updateModuleMaster: [],
  postmoduleMaster: [],
  modulesortedData: [],
  filteredModuleAccordingToProject: [],
  getproject: [],
  postprojectData: "",
  updateprojectMaster: [],
  getprojectData: [],
  projectDropDownData:[],
  exportProjectData:[]
};

export const ProjectMasterSlice = createSlice({
  name: "projectMasterSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
    },
    filterModuleAccordingToProject: (state, action) => {
      state.filteredModuleAccordingToProject = state.moduleMaster
        .filter(
          (modules) =>
            modules.project_id === action.payload.value &&
            modules.is_active === 1
        )
        .map((moduleLabel) => ({
          value: moduleLabel.id,
          label: moduleLabel.module_name,
        }));
    },

    navigateToModule: (state, action) => {
      state.navigateToModule = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getprojectData.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getprojectData.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getproject = payload.data.data;

        state.getproject = getproject;

        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getproject.length; i++) {
          getproject[i].counter = count++;
        }
        state.getproject = [...getproject];


        let exportProjectData = [];

        let counter =1
        for (const key in getproject) {
          exportProjectData.push({
            counter: counter++,
                      // id: getproject[key].id,
                      project_name: getproject[key].project_name,
                      projectReviewer: getproject[key].projectReviewer,
                      Status: getproject[key].is_active ? "Active" : "Deactive",
                      description: getproject[key].description,
                      remark: getproject[key].remark,
                      created_at: getproject[key].created_at,
                      created_by: getproject[key].created_by,
                      updated_at: getproject[key].updated_at,
                      updated_by: getproject[key].updated_by,
          });
        }
        state.exportProjectData = exportProjectData;



        let projectDropDownData = payload.data.data.filter((d) => d.is_active == 1).map((d) => ({ value: d.id, label: d.project_name }))
        state.projectDropDownData = projectDropDownData
      }
    });
    builder.addCase(getprojectData.rejected, (state) => {
      state.status = "rejected";
    });

    //____________postProject________________________

    builder.addCase(postprojectData.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(postprojectData.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };

        let postprojectData = payload.data.data;

        state.postprojectData = postprojectData;

        state.status = "succeded";
        state.showLoaderModal = false;
        // let count = 1;
        // for (let i = 0; i < postprojectData.length; i++) {
        //   postprojectData[i].counter = count++;
        // }
        state.postprojectData = postprojectData;
      }
    });
    builder.addCase(postprojectData.rejected, (state) => {
      state.status = "rejected";
    });

    //________________________-updateproject____________

    builder.addCase(updateprojectMaster.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(updateprojectMaster.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: "success", message: payload.data.message };
        let updateprojectMaster = payload.data.data;
     

        state.updateprojectMaster = updateprojectMaster;

        state.status = "succeded";
        state.showLoaderModal = false;
        // let count = 1;
        // for (let i = 0; i < postprojectData.length; i++) {
        //   postprojectData[i].counter = count++;
        // }
        state.updateprojectMaster = updateprojectMaster;
      }
    });
    builder.addCase(updateprojectMaster.rejected, (state) => {
      state.status = "rejected";
    });

    //_________________getProjectById__________________

    builder.addCase(getprojectByID.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getprojectByID.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getprojectByID = payload.data.data;

        state.getprojectByID = getprojectByID;

        state.status = "succeded";
        state.showLoaderModal = false;
        // let count = 1;
        // for (let i = 0; i < postprojectData.length; i++) {
        //   postprojectData[i].counter = count++;
        // }
        state.getprojectByID = getprojectByID;
      }
    });
    builder.addCase(getprojectByID.rejected, (state) => {
      state.status = "rejected";
    });
  },
});

export const {
  handleModalOpen,
  handleModalClose,
  navigateToModule,
  filterModuleAccordingToProject,
} = ProjectMasterSlice.actions;

export default ProjectMasterSlice.reducer;
