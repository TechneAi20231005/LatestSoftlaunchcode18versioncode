import { createSlice } from '@reduxjs/toolkit';
import {
  createPendingOrderThunk,
  getPendingOrderListThunk,
  getUnixCodeAgainstVendorForErrorFileThunk,
  getPendingOrderErrorFileThunk
} from '../../../services/po/generatePo';

const initialState = {
  pendingOrderList: [],
  userAddedPoDataList: JSON.parse(sessionStorage.getItem('poDataList')) || [],
  unixCodeListAgainstVendor: [],
  pendingOrderErrorFileData: [],
  pendingOrderErrorFileOnTheSportDownloadData: [],
  isLoading: {
    getPendingOrderList: false,
    createPendingOrder: false,
    getUnixCodeAgainstVendor: false,
    getPendingOrderErrorFileData: false
  },
  errorMsg: {
    getPendingOrderList: '',
    createPendingOrder: '',
    getUnixCodeAgainstVendor: '',
    getPendingOrderErrorFileData: ''
  },
  successMsg: {
    getPendingOrderList: '',
    createPendingOrder: '',
    getUnixCodeAgainstVendor: '',
    getPendingOrderErrorFileData: ''
  }
};
const generatePoSlice = createSlice({
  name: 'Generate PO',
  initialState,
  reducers: {
    addUserPendingOrderRequest(state, action) {
      const { orderQtyData, vender_name, delivery_date } = action.payload;
      const newPoDataList = state.pendingOrderList.flatMap((item) => {
        const order_qty = orderQtyData[item.id.toString()] || '';
        if (order_qty !== '' && order_qty !== 0) {
          return { ...item, order_qty, vender_name, delivery_date };
        }
        return [];
      });

      // Update existing items or add new ones
      newPoDataList.forEach((newItem) => {
        const existingIndex = state.userAddedPoDataList.findIndex(
          (item) => item.id === newItem.id
        );
        if (existingIndex !== -1) {
          state.userAddedPoDataList[existingIndex].order_qty =
            Number(state.userAddedPoDataList[existingIndex].order_qty) +
            Number(newItem.order_qty);
        } else {
          state.userAddedPoDataList.push(newItem);
        }
      });

      // Update local storage
      sessionStorage.setItem(
        'poDataList',
        JSON.stringify(state.userAddedPoDataList)
      );
    },

    editUserPendingOrderRequest(state, action) {
      const { current_id, order_qty } = action.payload;
      const index = state.userAddedPoDataList.findIndex(
        (item) => item.id === current_id
      );
      if (index !== -1) {
        state.userAddedPoDataList[index].order_qty = order_qty;

        // Update local storage
        sessionStorage.setItem(
          'poDataList',
          JSON.stringify(state.userAddedPoDataList)
        );
      }
    },

    deleteUserPendingOrderRequest(state, action) {
      const { current_id } = action.payload;
      state.userAddedPoDataList = state.userAddedPoDataList.filter(
        (item) => item.id !== current_id
      );

      // Update local storage
      sessionStorage.setItem(
        'poDataList',
        JSON.stringify(state.userAddedPoDataList)
      );
    },

    resetUserAddedOrderList(state, action) {
      state.userAddedPoDataList = [];
      sessionStorage.removeItem('poDataList');
    },

    resetPendingOrderListData(state, action) {
      state.pendingOrderList = [];
    }
  },

  extraReducers(builder) {
    builder
      .addCase(getPendingOrderListThunk.pending, (state, action) => {
        state.isLoading.getPendingOrderList = true;
      })
      .addCase(getPendingOrderListThunk.fulfilled, (state, action) => {
        state.isLoading.getPendingOrderList = false;
        state.pendingOrderList = action.payload.data;
        state.successMsg.getPendingOrderList = action.payload.msg;
      })
      .addCase(getPendingOrderListThunk.rejected, (state, action) => {
        state.isLoading.getPendingOrderList = false;
        state.pendingOrderList = [];
        state.errorMsg.getPendingOrderList = action.error.message;
      })

      // // create pending order slices
      .addCase(createPendingOrderThunk.pending, (state, action) => {
        state.isLoading.createPendingOrder = true;
      })
      .addCase(createPendingOrderThunk.fulfilled, (state, action) => {
        state.isLoading.createPendingOrder = false;
        state.successMsg.createPendingOrder = action.payload;
        state.pendingOrderErrorFileOnTheSportDownloadData =
          action?.payload?.data;

        // Clear local storage
        sessionStorage.removeItem('poDataList');
      })
      .addCase(createPendingOrderThunk.rejected, (state, action) => {
        state.isLoading.createPendingOrder = false;
        state.errorMsg.createPendingOrder = action.error.message;
      })

      // // get unix code against vender name for error file data
      .addCase(
        getUnixCodeAgainstVendorForErrorFileThunk.pending,
        (state, action) => {
          state.isLoading.getUnixCodeAgainstVendor = true;
        }
      )
      .addCase(
        getUnixCodeAgainstVendorForErrorFileThunk.fulfilled,
        (state, action) => {
          state.isLoading.getUnixCodeAgainstVendor = false;
          state.unixCodeListAgainstVendor = action.payload.data;
          state.successMsg.getUnixCodeAgainstVendor = action.payload.msg;
        }
      )
      .addCase(
        getUnixCodeAgainstVendorForErrorFileThunk.rejected,
        (state, action) => {
          state.isLoading.getUnixCodeAgainstVendor = false;
          state.unixCodeListAgainstVendor = [];
          state.errorMsg.getUnixCodeAgainstVendor = action.error.message;
        }
      )

      // // get pending order error file data slices
      .addCase(getPendingOrderErrorFileThunk.pending, (state, action) => {
        state.isLoading.getPendingOrderErrorFileData = true;
      })
      .addCase(getPendingOrderErrorFileThunk.fulfilled, (state, action) => {
        state.isLoading.getPendingOrderErrorFileData = false;
        state.pendingOrderErrorFileData = action.payload.data;
        state.successMsg.getPendingOrderErrorFileData = action.payload.msg;
      })
      .addCase(getPendingOrderErrorFileThunk.rejected, (state, action) => {
        state.isLoading.getPendingOrderErrorFileData = false;
        state.pendingOrderErrorFileData = [];
        state.errorMsg.getPendingOrderErrorFileData = action.error.message;
      });
  }
});

export const {
  addUserPendingOrderRequest,
  editUserPendingOrderRequest,
  deleteUserPendingOrderRequest,
  resetUserAddedOrderList,
  resetPendingOrderListData
} = generatePoSlice.actions;
export default generatePoSlice.reducer;
