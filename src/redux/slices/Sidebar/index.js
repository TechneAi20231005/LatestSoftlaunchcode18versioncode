import { createSlice } from '@reduxjs/toolkit';

import { getEmployeeListThunk, getMenuListThunk } from '../../services/Sidebar';

const initialState = {
  employeeList: [],
  getMenuList: [],
  filterMenuList: [],

  isLoading: {
    getMenuList: false,
    getEmployeeList: false
  },
  errorMsg: {
    getEmployeeList: '',
    getMenuList: ''
  },
  successMsg: {
    getEmployeeList: '',
    getMenuList: ''
  }
};
const sidebarSlice = createSlice({
  name: 'sidebarSlice',
  initialState,
  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(getEmployeeListThunk.pending, (state, action) => {
        state.isLoading.getEmployeeList = true;
      })
      .addCase(getEmployeeListThunk.fulfilled, (state, action) => {
        state.isLoading.getEmployeeList = false;
        state.employeeList = action.payload.data;
        state.successMsg.getEmployeeList = action.payload.msg;
      })
      .addCase(getEmployeeListThunk.rejected, (state, action) => {
        state.isLoading.getEmployeeList = false;
        state.employeeList = [];
        state.errorMsg.getEmployeeList = action.error.message;
      })

      .addCase(getMenuListThunk.pending, (state, action) => {
        state.isLoading.getMenuList = true;
      })
      .addCase(getMenuListThunk.fulfilled, (state, action) => {
        state.isLoading.getMenuList = false;
        state.menuList = action.payload.data;
        state.filterMenuList = state?.menuList?.menu.filter((menu) => {
          if (state.employeeList === 'SELF') {
            return menu;
          } else {
            return menu?.id === 16;
          }
        });

        state.successMsg.getMenuList = action.payload.msg;
      })
      .addCase(getMenuListThunk.rejected, (state, action) => {
        state.isLoading.getMenuList = false;
        state.menuList = [];
        state.errorMsg.getMenuList = action.error.message;
      });
  }
});

export default sidebarSlice.reducer;
