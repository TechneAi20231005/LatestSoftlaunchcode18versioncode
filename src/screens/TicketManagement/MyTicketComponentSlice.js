import { createSlice } from '@reduxjs/toolkit';
import {
  getStatusData,
  getUserForMyTicketsData,
  getUserTicketsTest
} from './MyTicketComponentAction';

const initialState = {
  status: '',
  err: '',
  statusData: [],
  getUserTicketTestData: [],
  createdByMe: [],
  getUserForMyTicket: [],
  getAssignedUserData: [],
  user: [],
  alluserTickettest: [],
  sortAssigntoSelfUser: []
};

export const MyTicketComponentSlice = createSlice({
  name: 'myTicketComponentSlice',
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getStatusData.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(getStatusData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let statusData = payload.data.data?.data;
        let extractedData = statusData.map((item) => ({
          value: item.id,
          label: item.status
        }));
        state.status = 'succeded';
        state.showLoaderModal = false;
        state.statusData = extractedData;
      }
    });
    builder.addCase(getStatusData.rejected, (state) => {
      state.status = 'rejected';
    });

    builder.addCase(getUserTicketsTest.pending, (state) => {
      state.status = 'loading';
    });

    builder.addCase(getUserTicketsTest.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getUserTicketTestData = payload.data.data;
        state.status = 'succeded';

        state.getUserTicketTestData = getUserTicketTestData;
      }
    });
    builder.addCase(getUserTicketsTest.rejected, (state) => {
      state.status = 'rejected';
    });

    builder.addCase(getUserForMyTicketsData.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(getUserForMyTicketsData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getUserForMyTicket = payload.data.data;

        let sortAssigntoSelfUser = getUserForMyTicket
          .filter((d) => d.account_for === 'SELF')
          .map((i) => ({
            value: i.id,
            label: i.first_name + ' ' + i.last_name
          }));

        state.sortAssigntoSelfUser = sortAssigntoSelfUser;
        let user = payload.data.data;
        let sortedData = getUserForMyTicket
          .filter((d) => d.is_active === 1)
          .map((i) => ({
            value: i.id,
            label: i.first_name + ' ' + i.last_name
          }));

        // const select = payload.data.data
        //   .filter((d) => d.is_active == 1)
        //   .map((d) => ({
        //     value: d.id,
        //     label: d.first_name + " " + d.last_name,
        //   }));

        if (payload?.data?.status === 1) {
          const data = user.sort((a, b) => {
            if (a.first_name && b.first_name) {
              return a.first_name.localeCompare(b.first_name);
            }
            return 0;
          });

          let userData = data.map((d) => ({
            value: d.id,
            label: d.first_name + ' ' + d.last_name
          }));

          state.user = userData;
        }

        state.getAssignedUserData = getUserForMyTicket;

        const aa = sortedData.sort(function (a, b) {
          return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
        });
        state.status = 'succeded';

        state.getUserForMyTicket = aa;
      }
    });
    builder.addCase(getUserForMyTicketsData.rejected, (state) => {
      state.status = 'rejected';
    });
  }
});
export default MyTicketComponentSlice.reducer;
