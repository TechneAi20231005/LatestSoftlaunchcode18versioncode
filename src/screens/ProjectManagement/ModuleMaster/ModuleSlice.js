import { createSlice } from '@reduxjs/toolkit';
import {
  getmoduleById,
  moduleMaster,
  postmoduleMaster,
  updateModuleMaster
} from './ModuleAction';



const initialState = {
  status: '',
  err: '',
  moduleMaster: [],
  getmoduleById: [],
  notify: '',
  updateModuleMaster: [],
  postmoduleMaster: [],
  modulesortedData: [],
  filteredModuleAccordingToProject: [],
  sortModuleData: [],

  exportModuleData: []
};

export const moduleSlice = createSlice({
  name: 'moduleSlice',
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
          label: moduleLabel.module_name
        }));
    },

    handleModalOpen: (state, action) => {
      state.modal = action.payload;
    },
    handleModalClose: (state, action) => {
      state.modal = action.payload;
    },
    navigateToModule: (state, action) => {
      state.navigateToModule = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(moduleMaster.pending, (state) => {
      state.status = 'loading';
    });

    builder.addCase(moduleMaster.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let moduleMaster = payload.data.data;
        // let modulesortedData=payload.data.data;
        let modulesortedData = payload.data.data
          .filter((d) => d.is_active)
          .map((d) => ({ value: d.id, label: d.module_name }));
        state.modulesortedData = modulesortedData;
        let sortModuleData = payload.data.data.filter((d) => d.is_active === 1);
        state.sortModuleData = sortModuleData;

        state.status = 'succeded';
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < moduleMaster.length; i++) {
          moduleMaster[i].counter = count++;
        }
        state.moduleMaster = [...moduleMaster];
        let exportModuleData = [];

        let counter = 1;
        for (const i in moduleMaster) {
          exportModuleData.push({
            SrNo: counter++,

            module_name: moduleMaster[i].module_name,
            project_name: moduleMaster[i].project_name,
            Status: moduleMaster[i].is_active ? 'Active' : 'Deactive',
            Remark: moduleMaster[i].remark,
            created_at: moduleMaster[i].created_at,
            created_by: moduleMaster[i].created_by,
            updated_at: moduleMaster[i].updated_at,
            updated_by: moduleMaster[i].updated_by
          });
        }
        state.exportModuleData = exportModuleData;
      }
    });
    builder.addCase(moduleMaster.rejected, (state) => {
      state.status = 'rejected';
    });

    //__________________________getModuleByID___________________

    builder.addCase(getmoduleById.pending, (state) => {
      state.status = 'loading';
    });

    builder.addCase(getmoduleById.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getmoduleById = payload.data.data;

        state.status = 'succeded';
        state.showLoaderModal = false;
        // let count = 1;
        // for (let i = 0; i < getmoduleById.length; i++) {
        //   getmoduleById[i].counter = count++;
        // }
        state.getmoduleById = getmoduleById;
      }
    });
    builder.addCase(getmoduleById.rejected, (state) => {
      state.status = 'rejected';
    });

    //______________________________updateModuleMaster__________________________

    builder.addCase(updateModuleMaster.pending, (state) => {
      state.status = 'loading';
    });

    builder.addCase(updateModuleMaster.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let updateModuleMaster = payload.data.data;

        state.status = 'succeded';
        state.showLoaderModal = false;
        // let count = 1;
        // for (let i = 0; i < getmoduleById.length; i++) {
        //   getmoduleById[i].counter = count++;
        // }
        state.updateModuleMaster = updateModuleMaster;
      }
    });
    builder.addCase(updateModuleMaster.rejected, (state) => {
      state.status = 'rejected';
    });

    //_____________________post___________________

    builder.addCase(postmoduleMaster.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(postmoduleMaster.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.notify = { type: 'success', message: payload.data.message };

        let postmoduleMaster = payload.data.data;

        state.status = 'succeded';
        state.showLoaderModal = false;
        state.postmoduleMaster = postmoduleMaster;
        state.navigationModule = true;
      } else {
        state.notify = { type: 'danger', message: payload.data.message };
      }
    });
    builder.addCase(postmoduleMaster.rejected, (state) => {
      state.status = 'rejected';
    });
  }
});

export const {
  handleModalOpen,
  handleModalClose,
  navigateToModule,
  filterModuleAccordingToProject
} = moduleSlice.actions;

export default moduleSlice.reducer;
