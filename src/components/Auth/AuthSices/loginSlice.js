import { createSlice } from '@reduxjs/toolkit';
import { postLoginUser } from './loginAction';
import { toast } from 'react-toastify';

const initialState = {
  status: '',
  err: '',
  loginUserDetail: {},
  data: [],
  notify: []
};

export const loginSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(postLoginUser.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
    });
    builder.addCase(postLoginUser.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.status = 'succeded';
        toast.success(payload);
      } else {
        toast.error(payload);
      }
    });
    builder.addCase(postLoginUser.rejected, (state) => {
      state.status = 'rejected';
    });
  }
});

export default loginSlice.reducer;
