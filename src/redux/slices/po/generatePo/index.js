import { createSlice } from '@reduxjs/toolkit';
import { getPendingOrderListThunk } from '../../../services/po/generatePo';

const initialState = {
  pendingOrderList: [],
  userAddedPoDataList: [],
  isLoading: {
    getPendingOrderList: false,
  },
  errorMsg: {
    getPendingOrderList: '',
  },
  successMsg: {
    getPendingOrderList: '',
  },
};
const generatePoSlice = createSlice({
  name: 'Generate PO',
  initialState,
  reducers: {
    addUserPendingOrderRequest(state, action) {
      const { orderQtyData, vender_name, delivery_date } = action.payload;
      const newPoDataList = state.pendingOrderList.flatMap(item => {
        const order_qty = orderQtyData[item.id.toString()] || '';
        if (order_qty !== '' && order_qty !== 0) {
          return { ...item, order_qty, vender_name, delivery_date };
        }
        return [];
      });

      // Update existing items or add new ones
      newPoDataList.forEach(newItem => {
        const existingIndex = state.userAddedPoDataList.findIndex(item => item.id === newItem.id);
        if (existingIndex !== -1) {
          state.userAddedPoDataList[existingIndex].order_qty = newItem.order_qty;
        } else {
          state.userAddedPoDataList.push(newItem);
        }
      });
    },

    editUserPendingOrderRequest(state, action) {
      const { current_id, order_qty } = action.payload;
      const index = state.userAddedPoDataList.findIndex(item => item.id === current_id);
      if (index !== -1) {
        state.userAddedPoDataList[index].order_qty = order_qty;
      }
    },

    deleteUserPendingOrderRequest(state, action) {
      const { current_id } = action.payload;
      state.userAddedPoDataList = state.userAddedPoDataList.filter(item => item.id !== current_id);
    },

    resetUserAddedOrderList(state, action) {
      state.userAddedPoDataList = [];
    },

    resetPendingOrderListData(state, action) {
      state.pendingOrderList = [];
    },
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
      });
  },
});

export const {
  addUserPendingOrderRequest,
  editUserPendingOrderRequest,
  deleteUserPendingOrderRequest,
  resetUserAddedOrderList,
  resetPendingOrderListData,
} = generatePoSlice.actions;
export default generatePoSlice.reducer;
