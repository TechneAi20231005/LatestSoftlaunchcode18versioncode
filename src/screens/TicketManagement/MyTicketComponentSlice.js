import { createSlice } from "@reduxjs/toolkit";
import {
  getStatusData,
  getUserForMyTicketsData,
  getUserTicketsTest,
} from "./MyTicketComponentAction";

const initialState = {
  status: "",
  err: "",
  statusData: [],
  getUserTicketTestData: [],
  createdByMe: [],
  getUserForMyTicket: [],
  getAssignedUserData:[],
  user:[],
  alluserTickettest:[]
};

export const MyTicketComponentSlice = createSlice({
  name: "myTicketComponentSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
      console.log("action of modal", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStatusData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getStatusData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let statusData = payload.data.data;
        let extractedData = statusData.map((item) => ({
          value: item.id,
          label: item.status,
        }));
        state.status = "succeded";
        state.showLoaderModal = false;
        state.statusData = extractedData;
        // state.statusData = [...statusData];
      }
    });
    builder.addCase(getStatusData.rejected, (state) => {
      state.status = "rejected";
    });

    builder.addCase(getUserTicketsTest.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getUserTicketsTest.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getUserTicketTestData = payload.data.data;
        state.status = "succeded";
        let current_page = 0
        let alluserTickettest=[getUserTicketTestData,current_page=payload.data.data.current_page]
        state.getUserTicketTestData = getUserTicketTestData;
        state.alluserTickettest=alluserTickettest
      }
    });
    builder.addCase(getUserTicketsTest.rejected, (state) => {
      state.status = "rejected";
    });

    builder.addCase(getUserForMyTicketsData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getUserForMyTicketsData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getUserForMyTicket = payload.data.data;
let user = payload.data.data;
        console.log("s1",getUserForMyTicket)
        let sortedData = getUserForMyTicket.filter((d) => d.is_active == 1).map((i) => ({
            value: i.id,
            label: i.first_name + " " + i.last_name,
          }));

          const select = payload.data.data.filter((d) => d.is_active == 1).map((d) => ({
            value: d.id,
            label: d.first_name + " " + d.last_name,
          }));
          console.log("s2",select )


          if (payload?.data?.status == 1) {
            const data = user.sort((a, b) => {
              if (a.first_name && b.first_name) {
                return a.first_name.localeCompare(b.first_name);
              }
              return 0;
            });

            let userData =  data.map((d) => ({
              value: d.id,
              label: d.first_name + " " + d.last_name,
            }))

            state.user = userData
            console.log("uD",userData)
            // setUser(
            //   data.map((d) => ({
            //     value: d.id,
            //     label: d.first_name + " " + d.last_name,
            //   }))
            // );
          }


          state.getAssignedUserData = getUserForMyTicket

          
        const aa = sortedData.sort(function (a, b) {
          return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
        });
        state.status = "succeded";

        state.getUserForMyTicket = aa;

      }
    });
    builder.addCase(getUserForMyTicketsData.rejected, (state) => {
      state.status = "rejected";
    });
  },
});
export default MyTicketComponentSlice.reducer;
