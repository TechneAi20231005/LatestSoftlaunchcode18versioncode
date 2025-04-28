import { createSlice } from '@reduxjs/toolkit';
import { getAllTaskTicketType } from './TaskAndTicketTypeMasterAction';

const initialState = {
  status: '',
  err: '',
  taskAndTicketData: [],
  loading: {
    taskAndTicketData: false
  }
};

export const taskAndTicketSlice = createSlice({
  name: 'taskAndTicketSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllTaskTicketType.pending, (state) => {
      state.loading.taskAndTicketData = true;
      state.status = 'loading';
    });

    builder.addCase(getAllTaskTicketType.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let counter = 1;
        var tempData = [];
        const temp = payload.data.data?.data;
        for (const key in temp) {
          tempData.push({
            counter: counter++,
            id: temp[key].id,
            type: temp[key].type,
            parent_id: temp[key].parent_id,
            type_name: temp[key].type_name,
            parent_name:
              temp[key].parent_name === null && temp[key].parent_id === 0
                ? 'Primary'
                : temp[key].parent_name,

            remark: temp[key].remark,
            is_active: temp[key].is_active,
            created_at: temp[key].created_at,
            created_by: temp[key].created_by,
            updated_at: temp[key].updated_at,
            updated_by: temp[key].updated_by
          });
        }

        state.status = 'succeded';
        state.taskAndTicketData = tempData;
        state.loading.taskAndTicketData = false;
      }
    });
    builder.addCase(getAllTaskTicketType.rejected, (state) => {
      state.loading.taskAndTicketData = false;
      state.status = 'rejected';
    });
  }
});
export default taskAndTicketSlice.reducer;
