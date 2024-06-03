import { createSlice } from '@reduxjs/toolkit';
import {
  getCityData,
  getCountryData,
  getEmployeeData,
  getStateData,
  getNotifications,
  getAllDashboardData,
  postCityData,
  updateCityData,
  getStateDataSort,
  getCountryDataSort,
  postStateData,
  updateStateData,
  postCountryData,
  updateCountryData,
  postUserData,
  updateUserData,
  getRoles,
  getDynamiucFormData,
  getCustomerData,
  getAllRoles,
  getCustomerType,
  getCustomerByIdData,
  postCustomerData,
  updateCustomerData,
  getAllUserById,
  getEmployeeDataById
} from './DashboardAction';

import { all } from 'axios';

const initialState = {
  status: '',
  err: '',

  cityUserDetail: {},
  cityData: [],
  FilterCity: [],
  countryData: [],
  sortedCityData: [],
  stateData: [],
  FilterState: [],
  employeeData: [],
  getAllTesterDataList: [],
  showLoaderModal: false,
  exportData: [],
  checkRole: [],
  notificationData: [],
  allDashboardData: [],
  postCity: [],
  updateCity: [],
  postState: [],
  filteredStateData: [],
  activeState: [],
  filteredCountryData: [],
  states: [],
  updateState: [],
  exportCityData: [],
  exportCountryData: [],
  postCountry: [],
  updateCountry: [],
  postUSer: [],
  updateUser: [],
  getRoles: [],
  getAllCustomerData: [],
  getAllUser: [],
  exportUserData: [],
  notify: null,
  exportCustomerData: [],
  customerByIdData: [],
  updateCustomer: [],
  customerTypeId: '',
  getEmployeeDataById: [],
  modal: {
    showModal: false,
    modalData: '',
    modalHeader: ''
  },
  isLoading: {
    getCityDataList: false,
    getCustomerList: false,
    CountyDataList: false,
    employeeDataList: false,
    stateDataList: false
  },
  customerTypeData: [],
  getUserById: []
};

export const DashbordSlice = createSlice({
  name: 'DashboradSlice',
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
    },
    handleModalInStore: (state, action) => {
      state.modal = action.payload;
    },
    handleModalClose: (state, action) => {
      state.modal = action.payload;
    },
    hideNotification(state) {
      state.notify = false;
    }
  },
  extraReducers: (builder) => {
    // Fetch city data

    builder.addCase(getCityData.pending, (state) => {
      state.isLoading.getCityDataList = true;
      state.showLoaderModal = true;
      state.notify = null;
    });
    builder.addCase(getCityData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.getCityDataList = false;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let cityData = payload.data.data;
        let FilterCity = payload.data.data.filter((d) => d.is_active === 1);
        state.FilterCity = FilterCity;
        state.status = 'succeded';
        state.showLoaderModal = false;
        let sortedCityData = payload.data.data
          .filter((d) => d.is_active === 1)
          .map((d) => ({
            value: d.id,
            label: d.city
          }));

        state.sortedCityData = sortedCityData;
        let count = 1;
        for (let i = 0; i < cityData.length; i++) {
          cityData[i].counter = count++;
        }

        let exportCityData = [];
        for (const i in cityData) {
          exportCityData.push({
            Sr: cityData[i].counter,
            Country: cityData[i].country,
            State: cityData[i].state,
            City: cityData[i].city,

            Status: cityData[i].is_active ? 'Active' : 'Deactive',
            Remark: cityData[i].remark,
            created_at: cityData[i].created_at,
            created_by: cityData[i].created_by,
            updated_at: cityData[i].updated_at,
            updated_by: cityData[i].updated_by
          });
        }
        state.exportCityData = exportCityData;
        state.cityData = [...cityData];
      }
    });
    builder.addCase(getCityData.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.getCityDataList = false;
      state.notify = null;
    });

    // Post city data

    builder.addCase(postCityData.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
    });

    builder.addCase(postCityData.fulfilled, (state, action) => {
      const { payload } = action;
      state.notify = null;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let postCity = payload.data.data;
        state.status = 'succeeded';

        state.showLoaderModal = false;
        state.postCity = postCity;
        state.notify = null;
        state.notify = { type: 'success', message: payload.data.message };
        let modal = { showModal: false, modalData: '', modalHeader: '' };
        state.modal = modal;
      } else {
        let notify = { type: 'danger', message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(postCityData.rejected, (state) => {
      state.status = 'rejected';
    });

    // Update city

    builder.addCase(updateCityData.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
    });

    builder.addCase(updateCityData.fulfilled, (state, action) => {
      const { payload } = action;
      state.notify = null;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let updateCity = payload.data.data;
        state.status = 'succeeded';
        state.notify = null;
        state.notify = { type: 'success', message: payload.data.message };
        state.showLoaderModal = false;

        state.updateCity = updateCity;

        let modal = { showModal: false, modalData: '', modalHeader: '' };
        state.modal = modal;
      } else {
        state.notify = { type: 'danger', message: payload.data.message };
      }
    });
    builder.addCase(updateCityData.rejected, (state) => {
      state.status = 'rejected';
    });

    // fetch country data
    builder.addCase(getCountryData.pending, (state) => {
      state.isLoading.CountyDataList = true;
    });
    builder.addCase(getCountryData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.CountyDataList = false;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let countryData = payload.data.data;
        state.status = 'succeded';
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < countryData.length; i++) {
          countryData[i].counter = count++;
        }
        state.countryData = [...countryData];

        let exportCountryData = [];
        for (const key in countryData) {
          exportCountryData.push({
            Sr: countryData[key].counter,
            Country: countryData[key].country,
            Status: countryData[key].is_active ? 'Active' : 'Deactive',
            Remark: countryData[key].remark,

            created_at: countryData[key].created_at,
            created_by: countryData[key].created_by,
            updated_at: countryData[key].updated_at,
            updated_by: countryData[key].updated_by
          });
        }
        state.exportCountryData = exportCountryData;
      }
    });
    builder.addCase(getCountryData.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.CountyDataList = false;
    });

    // fetch country sorted data
    builder.addCase(getCountryDataSort.pending, (state) => {
      state.status = 'loading';
      state.isLoading.CountyDataList = true;
    });
    builder.addCase(getCountryDataSort.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.CountyDataList = false;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.status = 'succeded';
        state.showLoaderModal = false;

        let filteredCountryData = payload.data.data
          .filter((d) => d.is_active == 1)
          .map((i) => ({
            value: i.id,
            label: i.country
          }));
        state.filteredCountryData = filteredCountryData;
      }
    });
    builder.addCase(getCountryDataSort.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.CountyDataList = false;
    });

    // Post Country Data
    builder.addCase(postCountryData.pending, (state) => {
      state.isLoading.CountyDataList = true;
      state.notify = null;
    });

    builder.addCase(postCountryData.fulfilled, (state, action) => {
      state.isLoading.CountyDataList = false;
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let postCountry = payload.data.data;
        state.status = 'succeeded';

        state.showLoaderModal = false;
        state.postCountry = postCountry;
        state.notify = null;
        state.notify = { type: 'success', message: payload.data.message };
        let modal = { showModal: false, modalData: '', modalHeader: '' };
        state.modal = modal;
      } else {
        let notify = { type: 'danger', message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(postCountryData.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.CountyDataList = false;
    });

    // update country data

    builder.addCase(updateCountryData.pending, (state) => {
      state.isLoading.CountyDataList = true;

      state.notify = null;
    });

    builder.addCase(updateCountryData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.CountyDataList = false;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let updateCountry = payload.data.data;
        state.status = 'succeeded';
        state.notify = { type: 'success', message: payload.data.message };
        state.showLoaderModal = false;

        state.updateCountry = updateCountry;

        let modal = { showModal: false, modalData: '', modalHeader: '' };
        state.modal = modal;
      } else {
        state.notify = { type: 'danger', message: payload.data.message };
      }
    });
    builder.addCase(updateCountryData.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.CountyDataList = false;
    });

    //fetch state data

    builder.addCase(getStateData.pending, (state) => {
      state.isLoading.stateDataList = true;
    });

    builder.addCase(getStateData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.stateDataList = false;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let stateData = payload.data.data;

        let FilterState = payload.data.data.filter((d) => d.is_active == 1);
        state.FilterState = FilterState;

        state.status = 'succeded';
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < stateData.length; i++) {
          stateData[i].counter = count++;
        }
        state.stateData = [...stateData];

        let exportData = [];
        for (const i in stateData) {
          exportData.push({
            Sr: stateData[i].counter,
            Country: stateData[i].country,
            State: stateData[i].state,

            Status: stateData[i].is_active ? 'Active' : 'Deactive',
            Remark: stateData[i].remark,
            created_at: stateData[i].created_at,
            created_by: stateData[i].created_by,
            updated_at: stateData[i].updated_at,
            updated_by: stateData[i].updated_by
          });
        }
        state.exportData = exportData;
      }
    });
    builder.addCase(getStateData.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.stateDataList = false;
    });

    //fetch state sorted data

    builder.addCase(getStateDataSort.pending, (state) => {
      state.isLoading.stateDataList = true;
    });

    builder.addCase(getStateDataSort.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.stateDataList = false;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let filteredStateData = payload.data.data
          .filter((d) => d.is_active == 1)
          .map((i) => ({
            value: i.id,
            label: i.state
          }));

        state.filteredStateData = filteredStateData;

        let activeState = payload.data.data.filter((d) => d.is_active == 1);
        state.activeState = activeState;

        state.states = payload.data.data.filter((d) => d.is_active === 1);
        state.status = 'succeded';

        state.showLoaderModal = false;

        state.filteredStateData = filteredStateData;
      }
    });
    builder.addCase(getStateDataSort.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.stateDataList = false;
    });

    //post state data

    builder.addCase(postStateData.pending, (state) => {
      state.isLoading.stateDataList = true;
      state.notify = null;
    });

    builder.addCase(postStateData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.stateDataList = false;
      if (payload?.data?.status === 1) {
        let postState = payload.data.data;
        state.status = 'succeded';
        state.postState = postState;
        state.notify = null;
        state.notify = { type: 'success', message: payload.data.message };
        let modal = { showModal: false, modalData: '', modalHeader: '' };
        state.modal = modal;
      } else {
        state.notify = null;
        state.notify = { type: 'danger', message: payload.data.message };
      }
    });
    builder.addCase(postStateData.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.stateDataList = false;
    });

    // Update State

    builder.addCase(updateStateData.pending, (state) => {
      state.isLoading.stateDataList = true;
      state.notify = null;
    });

    builder.addCase(updateStateData.fulfilled, (state, action) => {
      const { payload } = action;
      state.isLoading.stateDataList = false;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let updateState = payload.data.data;
        state.status = 'succeeded';
        state.notify = null;
        state.notify = { type: 'success', message: payload.data.message };
        state.showLoaderModal = false;

        state.updateState = updateState;

        let modal = { showModal: false, modalData: '', modalHeader: '' };
        state.modal = modal;
      } else {
        state.notify = { type: 'danger', message: payload.data.message };
      }
    });
    builder.addCase(updateStateData.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.stateDataList = false;
    });

    //fetch User data

    builder.addCase(getEmployeeData.pending, (state) => {
      state.isLoading.employeeDataList = true;
      // state.status = null
    });

    builder.addCase(getEmployeeData.fulfilled, (state, action) => {
      state.isLoading.employeeDataList = false;
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let employeeData = payload.data.data;
        state.getAllTesterDataList = payload?.data?.data
          .filter((d) => d?.role === 'Tester')
          .map((i) => ({
            value: i.id,
            label: i.first_name + ' ' + i.last_name
          }));

        console.log('employee', state.getAllTesterDataList);
        state.status = 'succeded';
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < employeeData.length; i++) {
          employeeData[i].counter = count++;

          const firstName = employeeData[i].first_name || '';
          const middleName = employeeData[i].middle_name || '';
          const lastName = employeeData[i].last_name || '';
          employeeData[i].name =
            `${firstName} ${middleName} ${lastName}`.trim();
        }

        state.employeeData = [...employeeData];

        let exportUserData = [];
        for (const i in employeeData) {
          exportUserData.push({
            SrNo: employeeData[i].counter,

            Account_for: employeeData[i].account_for,
            customer_name: employeeData[i].customer,
            Name:
              employeeData[i].first_name +
              ' ' +
              employeeData[i].middle_name +
              ' ' +
              employeeData[i].last_name,
            Email: employeeData[i].email_id,
            ContactNo: employeeData[i].contact_no,
            WhatsappNo: employeeData[i].whats_app_contact_no,
            User_Name: employeeData[i].user_name,
            Role: employeeData[i].role,
            Designation: employeeData[i].designation,
            Address: employeeData[i].address,
            Pincode: employeeData[i].pincode,
            Country: employeeData[i].country,
            State: employeeData[i].state,
            City: employeeData[i].city,
            Department: employeeData[i].department,
            Ticket_Show_Type: employeeData[i].ticket_show_type,
            all_department: employeeData[i].all_department,
            Ticket_Passing_Authority: employeeData[i].ticket_passing_authority
              ? 'Yes'
              : 'No',
            Make_Default: employeeData[i].is_default ? 'yes' : 'No',
            Status: employeeData[i].is_active ? 'Active' : 'Deactive',
            created_at: employeeData[i].created_at,
            created_by: employeeData[i].created_by,
            updated_at: employeeData[i].updated_at,

            updated_by: employeeData[i].updated_by
          });
        }
        state.exportUserData = exportUserData;
      }
    });
    builder.addCase(getEmployeeData.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.employeeDataList = false;
    });

    // post user data

    builder.addCase(postUserData.pending, (state) => {
      state.isLoading.employeeDataList = true;
      // state.isLoading = true;
    });

    builder.addCase(postUserData.fulfilled, (state, action) => {
      state.isLoading.employeeDataList = false;
      const { payload } = action;
      if (state.isLoading) {
        return;
      }
      state.isLoading = true;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let postUser = payload.data.data;
        state.status = 'succeded';
        state.postUSer = postUser;
        state.notify = null;
        state.notify = { type: 'success', message: payload.data.message };
        let modal = { showModal: false, modalData: '', modalHeader: '' };
        state.modal = modal;
      } else {
        let notify = { type: 'danger', message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
      state.isLoading = false;
    });
    builder.addCase(postUserData.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.employeeDataList = false;
    });

    // update user data

    builder.addCase(updateUserData.pending, (state) => {
      state.isLoading.employeeDataList = true;
      state.notify = null;
    });

    builder.addCase(updateUserData.fulfilled, (state, action) => {
      state.isLoading.employeeDataList = false;
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let updateUser = payload.data.data;
        state.status = 'succeeded';
        // state.notify = null;
        state.notify = { type: 'success', message: payload.data.message };
        state.showLoaderModal = false;

        state.updateUser = updateUser;

        let modal = { showModal: false, modalData: '', modalHeader: '' };
        state.modal = modal;
      } else {
        state.notify = { type: 'danger', message: payload.data.message };
      }
    });
    builder.addCase(updateUserData.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.employeeDataList = false;
    });

    //fetch Notification data

    builder.addCase(getNotifications.pending, (state) => {
      state.status = 'loading';
    });

    builder.addCase(getNotifications.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let notificationData = payload.data.data;
        state.status = 'succeded';
        state.showLoaderModal = false;
        state.notificationData = notificationData;
      }
    });
    builder.addCase(getNotifications.rejected, (state) => {
      state.status = 'rejected';
    });

    // fetch All dashboard data
    builder.addCase(getAllDashboardData.pending, (state) => {
      state.status = 'loading';
    });

    builder.addCase(getAllDashboardData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let allDashboardData = payload.data.data;

        state.status = 'succeded';
        state.showLoaderModal = false;
        state.allDashboardData = allDashboardData;
      }
    });
    builder.addCase(getAllDashboardData.rejected, (state) => {
      state.status = 'rejected';
    });

    builder.addCase(getRoles.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(getRoles.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getRoles = payload.data.data;

        state.status = 'succeded';
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getRoles.length; i++) {
          getRoles[i].counter = count++;
        }
        state.getRoles = [...getRoles];
      }
    });
    builder.addCase(getRoles.rejected, (state) => {
      state.status = 'rejected';
    });

    builder.addCase(getAllRoles.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(getAllRoles.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getAllRoles = payload.data.data;

        state.status = 'succeded';
        state.showLoaderModal = false;

        state.getAllRoles = [...getAllRoles];
      }
    });
    builder.addCase(getAllRoles.rejected, (state) => {
      state.status = 'rejected';
    });

    //__________getDynamicForm________________

    builder.addCase(getDynamiucFormData.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(getDynamiucFormData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getDynamiucFormData = payload.data.data
          .filter((d) => d.is_active == 1)
          .map((d) => ({ value: d.id, label: d.template_name }));
        state.status = 'succeded';
        state.showLoaderModal = false;

        state.getDynamiucFormData = [...getDynamiucFormData];
      }
    });
    builder.addCase(getDynamiucFormData.rejected, (state) => {
      state.status = 'rejected';
    });

    //____________________getCustomer______________________

    builder.addCase(getCustomerData.pending, (state) => {
      state.isLoading.getCustomerList = true;
      // state.notify=null
    });
    builder.addCase(getCustomerData.fulfilled, (state, action) => {
      state.isLoading.getCustomerList = false;
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getAllCustomerData = payload.data.data;
        let getCustomerData = payload.data.data
          .filter((d) => d.is_active == 1)
          .map((d) => ({ value: d.id, label: d.name }));
        state.status = 'succeded';
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getAllCustomerData.length; i++) {
          getAllCustomerData[i].counter = count++;
          state.getAllCustomerData = [...getAllCustomerData];
          state.getCustomerData = [...getCustomerData];
        }
      }
      let temp = payload.data.data;
      let exportCustomerData = [];
      for (const i in temp) {
        exportCustomerData.push({
          SrNo: temp[i].counter,
          Name: temp[i].name,
          Customer_Type: temp[i].type_name,
          Email: temp[i].email_id,
          Contact_Number: temp[i].contact_no,
          Address: temp[i].address,
          Pincode: temp[i].pincode,
          Country: temp[i].country,
          State: temp[i].state,
          City: temp[i].city,
          Status: temp[i].is_active ? 'Active' : 'Deactive',
          created_at: temp[i].created_at,
          created_by: temp[i].created_by,
          updated_at: temp[i].updated_at,
          updated_by: temp[i].updated_by
        });
      }
      state.exportCustomerData = exportCustomerData;
    });
    builder.addCase(getCustomerData.rejected, (state) => {
      state.status = 'rejected';
      state.isLoading.getCustomerList = false;
    });

    builder.addCase(getCustomerType.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
    });
    builder.addCase(getCustomerType.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let customerTypeData = payload.data.data
          .filter((d) => d.is_active == 1)
          .map((d) => ({ label: d.type_name, value: d.id }));
        state.status = 'succeded';
        state.showLoaderModal = false;

        state.customerTypeData = [...customerTypeData];
      }
    });
    builder.addCase(getCustomerType.rejected, (state) => {
      state.status = 'rejected';
    });

    builder.addCase(getCustomerByIdData.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
    });

    builder.addCase(getCustomerByIdData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.data?.status === 1) {
        const customerByIdData = payload.data.data;
        state.status = 'succeded';
        state.notify = null;
        let modal = { showModal: false, modalData: '', modalHeader: '' };
        state.modal = modal;
        state.customerByIdData = customerByIdData;
      } else {
      }
    });
    builder.addCase(getCustomerByIdData.rejected, (state) => {
      state.status = 'rejected';
    });

    builder.addCase(postCustomerData.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
    });

    builder.addCase(postCustomerData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.data?.status === 1) {
        state.status = 'succeded';
        state.notify = null;
        state.notify = { type: 'success', message: payload.data.message };
        let modal = { showModal: false, modalData: '', modalHeader: '' };
        state.modal = modal;
      } else {
        state.notify = null;
        state.notify = { type: 'danger', message: payload.data.message };
      }
    });
    builder.addCase(postCustomerData.rejected, (state) => {
      state.status = 'rejected';
    });

    builder.addCase(updateCustomerData.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
    });

    builder.addCase(updateCustomerData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let updateCustomer = payload.data.data;
        state.status = 'succeeded';
        state.notify = { type: 'success', message: payload.data.message };
        state.showLoaderModal = false;

        state.updateCustomer = updateCustomer;

        let modal = { showModal: false, modalData: '', modalHeader: '' };
        state.modal = modal;
      } else {
        state.notify = { type: 'danger', message: payload.data.message };
      }
    });
    builder.addCase(updateCustomerData.rejected, (state) => {
      state.status = 'rejected';
    });

    builder.addCase(getAllUserById.pending, (state) => {
      state.status = 'loading';
      state.notify = null;
    });

    builder.addCase(getAllUserById.fulfilled, (state, action) => {
      const { payload } = action;

      state.notify = null;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getAllUser = payload.data.data;
        state.status = 'succeeded';
        state.notify = null;
        state.showLoaderModal = false;

        state.getAllUser = getAllUser;

        let modal = { showModal: false, modalData: '', modalHeader: '' };
        state.modal = modal;
      } else {
      }
    });
    builder.addCase(getAllUserById.rejected, (state) => {
      state.status = 'rejected';
    });
  }
});

export const {
  handleModalInStore,
  handleModalClose,
  loaderModal,
  hideNotification
} = DashbordSlice.actions;
export default DashbordSlice.reducer;
