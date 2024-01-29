import { createSlice } from "@reduxjs/toolkit";
import { getCityData, getCountryData, getEmployeeData, getStateData ,getNotifications, getAllDashboardData} from "./DashboardAction";

const initialState = {
  status: "",
  err: "",
  cityUserDetail: {},
  cityData: [],
  countryData:[],
  stateData:[],
  employeeData:[],
  showLoaderModal:false,
  exportData:[],
  checkRole:[],
  notificationData:[],
  allDashboardData:[],

  
};

export const dashboardSlice = createSlice({
    
  name: "dashboradSlice",
  initialState,
  reducers: {
    loaderModal:(state,action)=>{
        state.showLoaderModal = action.payload
        console.log("action of modal",action.payload)
    }
  },
  extraReducers: (builder) => {    

    builder.addCase(getCityData.pending, (state) => {
      state.status = "loading";

    });
    builder.addCase(getCityData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let cityData = payload.data.data;
        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < cityData.length; i++) {
            cityData[i].counter = count++;
        }
        state.cityData = [...cityData];
      }
    });
    builder.addCase(getCityData.rejected, (state) => {
      state.status = "rejected";
    });

    builder.addCase(getCountryData.pending, (state) => {
        state.status = "loading";
  
      });
      builder.addCase(getCountryData.fulfilled, (state, action) => {
        const { payload } = action;
        if (payload?.status === 200 && payload?.data?.status === 1) {
          let countryData = payload.data.data;
          state.status = "succeded";
          state.showLoaderModal = false;
          let count = 1;
          for (let i = 0; i < countryData.length; i++) {
            countryData[i].counter = count++;
          }
          state.countryData = [...countryData];
        }
      });
      builder.addCase(getCountryData.rejected, (state) => {
        state.status = "rejected";
      });
      builder.addCase(getStateData.pending, (state) => {
        state.status = "loading";
  
      });
      
      builder.addCase(getStateData.fulfilled, (state, action) => {
        const { payload } = action;
        if (payload?.status === 200 && payload?.data?.status === 1) {
          let stateData = payload.data.data;
          state.status = "succeded";
          state.showLoaderModal = false;
          let count = 1;
          for (let i = 0; i < stateData.length; i++) {
            stateData[i].counter = count++;
          }
          state.stateData = [...stateData];
        }
      });
      builder.addCase(getStateData.rejected, (state) => {
        state.status = "rejected";
      });
     
      builder.addCase(getEmployeeData.pending, (state) => {
        state.status = "loading";
  
      });
      
      builder.addCase(getEmployeeData.fulfilled, (state, action) => {
        const { payload } = action;
        if (payload?.status === 200 && payload?.data?.status === 1) {
          let employeeData = payload.data.data;
          state.status = "succeded";
          state.showLoaderModal = false;
          let count = 1;
          for (let i = 0; i < employeeData.length; i++) {
            employeeData[i].counter = count++;

            const firstName = employeeData[i].first_name || '';
      const middleName = employeeData[i].middle_name || '';
      const lastName = employeeData[i].last_name || ''
      employeeData[i].name = `${firstName} ${middleName} ${lastName}`.trim();
          }

          state.employeeData = [...employeeData];
        }

      });
      builder.addCase(getEmployeeData.rejected, (state) => {
        state.status = "rejected";
      });




      builder.addCase(getNotifications.pending, (state) => {
        state.status = "loading";
  
      });
      
      builder.addCase(getNotifications.fulfilled, (state, action) => {
        const { payload } = action;
        if (payload?.status === 200 && payload?.data?.status === 1) {
          let notificationData = payload.data.data;
          console.log("n",notificationData)
          state.status = "succeded";
          state.showLoaderModal = false;
          state.notificationData = notificationData
        }

      });
      builder.addCase(getNotifications.rejected, (state) => {
        state.status = "rejected";
      });



      builder.addCase(getAllDashboardData.pending, (state) => {
        state.status = "loading";
  
      });
      
      builder.addCase(getAllDashboardData.fulfilled, (state, action) => {
        const { payload } = action;
        if (payload?.status === 200 && payload?.data?.status === 1) {
          let allDashboardData = payload.data.data;
         
          state.status = "succeded";
          state.showLoaderModal = false;
          state.allDashboardData = allDashboardData
        }

      });
      builder.addCase(getAllDashboardData.rejected, (state) => {
        state.status = "rejected";
      });


  },


  


});

export default dashboardSlice.reducer;
