// import { createSlice } from "@reduxjs/toolkit";
// import { getCustomerData, getDynamiucFormData, getRoles } from "./DashboardAction";

// const initialState = {
//   status: "",
//   err: "",
//   getRoles: [],
// };

// export const dashboardSlice = createSlice({
//   name: "dashboardSlice",
//   initialState,
//   reducers: {
//     loaderModal: (state, action) => {
//       state.showLoaderModal = action.payload;
//       console.log("action of modal", action.payload);
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(getRoles.pending, (state) => {
//       state.status = "loading";
//     });
//     builder.addCase(getRoles.fulfilled, (state, action) => {
//       const { payload } = action;
//       console.log(payload);
//       if (payload?.status === 200 && payload?.data?.status === 1) {
//         let getRoles = payload.data.data;
//         state.status = "succeded";
//         state.showLoaderModal = false;
//         let count = 1;
//         for (let i = 0; i < getRoles.length; i++) {
//           getRoles[i].counter = count++;
//         }
//         state.getRoles = [...getRoles];
//       }
//     });
//     builder.addCase(getRoles.rejected, (state) => {
//       state.status = "rejected";
//     });

//     //__________getDynamicForm________________

//     builder.addCase(getDynamiucFormData.pending, (state) => {
//       state.status = "loading";
//     });
//     builder.addCase(getDynamiucFormData.fulfilled, (state, action) => {
//       const { payload } = action;
//       console.log(payload);
//       if (payload?.status === 200 && payload?.data?.status === 1) {
//         let getDynamiucFormData = payload.data.data
//           .filter((d) => d.is_active == 1)
//           .map((d) => ({ value: d.id, label: d.template_name }));
//         state.status = "succeded";
//         state.showLoaderModal = false;

//         state.getDynamiucFormData = [...getDynamiucFormData];
//       }
//     });
//     builder.addCase(getDynamiucFormData.rejected, (state) => {
//       state.status = "rejected";
//     });

//     //____________________getCustomer______________________


//     builder.addCase(getCustomerData.pending, (state) => {
//       state.status = "loading";
//     });
//     builder.addCase(getCustomerData.fulfilled, (state, action) => {
//       const { payload } = action;
//       console.log(payload);
//       if (payload?.status === 200 && payload?.data?.status === 1) {
//         let getCustomerData = payload.data.data
//         .filter((d) => d.is_active == 1)
//         .map((d) => ({ value: d.id, label: d.name }))
//         state.status = "succeded";
//         state.showLoaderModal = false;

//         state.getCustomerData = [...getCustomerData];
//       }
//     });
//     builder.addCase(getCustomerData.rejected, (state) => {
//       state.status = "rejected";
//     });



//   },
// });

// export default dashboardSlice.reducer;
