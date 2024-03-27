import { createSlice } from "@reduxjs/toolkit";
import {
  BillcheckingpostData,
  UpdateBillCheckingTransaction,
  billTypeDataDropDowm,
  cancelBillCheckData,
  creteAuthority,
  getBillcheckingData,
  getModuleSettingData,
  getSubmoduleData,
  getUpdatedAuthoritiesData,
  getcreateAuthoritiesData,
  mappEmployed,
  postBillcheckingData,
  sectionDropDownData,
  statusDropDownData,
  updateAuthority,
} from "./BillCheckingTransactionAction";

const initialState = {
  status: "",
  err: "",


  getAllbillCheckingData: [],
  sortedBillCheckingData: [],
  updateBillCheckingTransactionData: [],
  exportData: [],
  authoritiesData: "",
  authorityData: "",
  billTypeDataDropDowm: [],
  statusDropDownData: [],
  cancelBillCheckData: [],
  exportModuleData: [],
  getModuleSettingData: [],
  creteAuthority:[],
  notify: "",
  modal: {
    showModal: false,
    modalData: "",
    modalHeader: "",
  },
};

export const BillCheckingTransactionSlice = createSlice({
  name: "BillCheckingTransactionSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
    },
    handleModalOpen: (state, action) => {
      state.modal = action.payload;
    },
    handleModalClose: (state, action) => {
      state.modal = action.payload;
    },



  },
  extraReducers: (builder) => {
    // get general setting
    builder.addCase(getBillcheckingData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getBillcheckingData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        
        let getAllbillCheckingData = payload.data.data;
        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getAllbillCheckingData.length; i++) {
          getAllbillCheckingData[i].counter = count++;
        }

        const sortedBillCheckingData = [];
        for (const key in getAllbillCheckingData) {
          sortedBillCheckingData.push({
            counter: getAllbillCheckingData[key].counter++,
            id: getAllbillCheckingData[key].id,
            "Bill ID": getAllbillCheckingData[key].bc_id,
            "Vendor Name": getAllbillCheckingData[key].vendor_id_name,
            getAllbillCheckingDatalate_name:
              getAllbillCheckingData[key].getAllbillCheckingDatalate_name,
            employee_name: getAllbillCheckingData[key].employee_name,

            "Payment Date": getAllbillCheckingData[key].payment_date,
            "Bill No": getAllbillCheckingData[key].vendor_bill_no,
            "Actual Payment Date":
              getAllbillCheckingData[key].actual_payment_date,
            "Bill Amount": getAllbillCheckingData[key].bill_amount,
            "Net Amount": getAllbillCheckingData[key].net_payment,
            is_active: getAllbillCheckingData[key].is_active,
            "Is TCS applicable": getAllbillCheckingData[key].is_tcs_applicable,
            bill_type_name: getAllbillCheckingData[key].bill_type_name,
            assign_to_name: getAllbillCheckingData[key].assign_to_name,
            "Taxable Amount": getAllbillCheckingData[key].taxable_amount,
            "Debit Advance": getAllbillCheckingData[key].debit_advance,
            "Bill date": getAllbillCheckingData[key].bill_date,
            "Bill Status": getAllbillCheckingData[key].payment_status,
            "Is Original Bill":
              getAllbillCheckingData[key].is_original_bill_needed,
            "Recieved Date": getAllbillCheckingData[key].received_date,
            "Hold Amount": getAllbillCheckingData[key].hold_amount,
            "Paid Amount": getAllbillCheckingData[key].actual_paid,
            created_at: getAllbillCheckingData[key].created_at,
            created_by: getAllbillCheckingData[key].created_by,
            updated_at: getAllbillCheckingData[key].updated_at,

            updated_by: getAllbillCheckingData[key].updated_by,
            "Rejected By": getAllbillCheckingData[key].rejectedBy,

            is_approver: getAllbillCheckingData[key].is_approver,
            "Assign To": getAllbillCheckingData[key].assign_to_name,
            is_assign_to: getAllbillCheckingData[key].is_assign_to,
            level: getAllbillCheckingData[key].level,
            total_level: getAllbillCheckingData[key].total_level,
            last_approved_by: getAllbillCheckingData[key].last_approved_by,
            approvedBy: getAllbillCheckingData[key].approvedBy,
            "Pending From": getAllbillCheckingData[key].level_approver,
            audit_remark: getAllbillCheckingData[key].audit_remark,
            external_audit_remark:
              getAllbillCheckingData[key].external_audit_remark,

            levels_of_approval: getAllbillCheckingData[key].levels_of_approval,

            level_approver: getAllbillCheckingData[key].level_approver,
            is_editable_for_creator:
              getAllbillCheckingData[key].is_editable_for_creator,
            is_rejected: getAllbillCheckingData[key].is_rejected,
            "Is cancelled": getAllbillCheckingData[key].cancelled,
          });
        }

        const exportData = [];
        for (const key in getAllbillCheckingData) {
          exportData.push({
            // counter: counter++,
            SrNo: getAllbillCheckingData.length + 1,
            "Bill ID": getAllbillCheckingData[key].bc_id,
            "Vendor Name": getAllbillCheckingData[key].vendor_id_name,
            "Payment Date": getAllbillCheckingData[key].payment_date,
            "Bill No": getAllbillCheckingData[key].vendor_bill_no,
            "Actual Payment Date":
              getAllbillCheckingData[key].actual_payment_date,
            "Bill Amount": getAllbillCheckingData[key].bill_amount,
            "Net Amount": getAllbillCheckingData[key].net_payment,
            "Rejected By": getAllbillCheckingData[key].rejectedBy,
            "Is TCS applicable": getAllbillCheckingData[key].is_tcs_applicable,

            bill_type_name: getAllbillCheckingData[key].bill_type_name,

            "Taxable Amount": getAllbillCheckingData[key].taxable_amount,
            "Debit Advance": getAllbillCheckingData[key].debit_advance,
            "Bill date": getAllbillCheckingData[key].bill_date,
            "Rejected By": getAllbillCheckingData[key].rejectedBy,

            // "Bill Status": temp[key].bill_status,
            "Bill Status": getAllbillCheckingData[key].payment_status,

            "Recieved Date": getAllbillCheckingData[key].received_date,
            total_level: getAllbillCheckingData[key].total_level,
            last_approved_by: getAllbillCheckingData[key].last_approved_by,
            is_editable_for_creator:
              getAllbillCheckingData[key].is_editable_for_creator,

            "Levels of approval":
              getAllbillCheckingData[key].levels_of_approval,
            "Approve By": getAllbillCheckingData[key].approved_by,
            "Pending From": getAllbillCheckingData[key].level_approver,

            "Assign From": getAllbillCheckingData[key].created_by,
            "Assign To": getAllbillCheckingData[key].assign_to_name,
            is_assign_to:
              getAllbillCheckingData[key].is_assign_to == 0 ? "NO" : "YES",

            approvedBy: getAllbillCheckingData[key].approvedBy,
            "Is Original Bill":
              getAllbillCheckingData[key].is_original_bill_needed,

            // "is original Bill": temp[key].is_original_bill_needed,
            "Internal Audit": getAllbillCheckingData[key].audit_remark,
            "External Audit": getAllbillCheckingData[key].external_audit_remark,
            "Hold Amount": getAllbillCheckingData[key].hold_amount,
            "Paid Amount": getAllbillCheckingData[key].actual_paid,
            "Is cancelled": getAllbillCheckingData[key].cancelled,

            "Created at": getAllbillCheckingData[key].created_at,
            "Created by": getAllbillCheckingData[key].created_by,
            "Updated At": getAllbillCheckingData[key].updated_at,
            "Updated By": getAllbillCheckingData[key].updated_by,
          });
        }
        state.getAllbillCheckingData = [...getAllbillCheckingData];
        state.sortedBillCheckingData = sortedBillCheckingData;
        state.exportData = exportData;
      }
    });
    builder.addCase(getBillcheckingData.rejected, (state) => {
      state.status = "rejected";
    });

    //   // post general setting

    builder.addCase(postBillcheckingData.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });
    builder.addCase(postBillcheckingData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state.status = "succeded";
        state.showLoaderModal = false;

        state.notify = null;
        state.notify = { type: "success", message: payload.data.message };
      } else {
        let notify = { type: "danger", message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(postBillcheckingData.rejected, (state) => {
      state.status = "rejected";
    });

    //   //update general setting
    builder.addCase(getUpdatedAuthoritiesData.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });

    builder.addCase(getUpdatedAuthoritiesData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === true) {
    
        let authoritiesData = payload.data.data;
        state.status = "succeded";
        state.showLoaderModal = false;

        state.authoritiesData = authoritiesData;
        state.notify = null;
        state.notify = { type: "success", message: payload.data.message };
      } else {
        let notify = { type: "danger", message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(getUpdatedAuthoritiesData.rejected, (state) => {
      state.status = "rejected";
    });

    builder.addCase(getcreateAuthoritiesData.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });

    builder.addCase(getcreateAuthoritiesData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let authorityData = payload.data.access;
        state.status = "succeded";
        state.showLoaderModal = false;

        state.authorityData = authorityData;
        state.notify = null;
        state.notify = { type: "success", message: payload.data.message };
      } else {
        let notify = { type: "danger", message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(getcreateAuthoritiesData.rejected, (state) => {
      state.status = "rejected";
    });

    builder.addCase(UpdateBillCheckingTransaction.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });

    builder.addCase(
      UpdateBillCheckingTransaction.fulfilled,
      (state, action) => {
        const { payload } = action;
        if (payload?.status === 200 && payload?.data?.status === 1) {
          let updateBillCheckingTransactionData = payload.data.data;
          state.status = "succeded";
          state.showLoaderModal = false;

          state.updateBillCheckingTransactionData = [
            updateBillCheckingTransactionData,
          ];
          state.notify = null;
          state.notify = { type: "success", message: payload.data.message };
        } else {
          let notify = { type: "danger", message: payload.data.message };
          state.notify = null;
          state.notify = notify;
        }
      }
    );
    builder.addCase(UpdateBillCheckingTransaction.rejected, (state) => {
      state.status = "rejected";
    });

    //__________________getBillTypeData________________

    builder.addCase(billTypeDataDropDowm.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });

    builder.addCase(billTypeDataDropDowm.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let billTypeDataDropDowm = payload.data.data.map((d) => ({
          value: d.id,
          label: d.bill_type,
        }));
        state.status = "succeded";
        state.showLoaderModal = false;

        state.billTypeDataDropDowm = [...billTypeDataDropDowm];
        state.notify = null;
        state.notify = { type: "success", message: payload.data.message };
      } else {
        let notify = { type: "danger", message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(billTypeDataDropDowm.rejected, (state) => {
      state.status = "rejected";
    });

    //_____________________________________getStatusData_______________________________

    builder.addCase(statusDropDownData.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });

    builder.addCase(statusDropDownData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let statusDropDownData = payload.data.data.map((d) => ({
          value: d.id,
          label: d.convention_name,
        }));
        state.status = "succeded";
        state.showLoaderModal = false;

        state.statusDropDownData = [...statusDropDownData];
        state.notify = null;
        state.notify = { type: "success", message: payload.data.message };
      } else {
        let notify = { type: "danger", message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(statusDropDownData.rejected, (state) => {
      state.status = "rejected";
    });

    //___________________getMppEmployed__________________________________

    builder.addCase(mappEmployed.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });

    builder.addCase(mappEmployed.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let mappEmployed = payload.data.data.map((d) => ({
          value: d.id,
          label: d.employee_name,
        }));
        state.status = "succeded";
        state.showLoaderModal = false;

        state.mappEmployed = [...mappEmployed];
        state.notify = null;
        state.notify = { type: "success", message: payload.data.message };
      } else {
        let notify = { type: "danger", message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(mappEmployed.rejected, (state) => {
      state.status = "rejected";
    });

    //___________________________________BillCheckingPostData_____________________________________

    builder.addCase(BillcheckingpostData.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });

    builder.addCase(BillcheckingpostData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let BillcheckingpostData = payload.data.data.map((d) => ({
          value: d.id,
          label: d.employee_name,
        }));
        state.status = "succeded";
        state.showLoaderModal = false;

        state.BillcheckingpostData = [...BillcheckingpostData];
        state.notify = null;
        state.notify = { type: "success", message: payload.data.message };
      } else {
        let notify = { type: "danger", message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(BillcheckingpostData.rejected, (state) => {
      state.status = "rejected";
    });

    //___________________________cancleBillChecking________________

    builder.addCase(cancelBillCheckData.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(cancelBillCheckData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let cancelBillCheckData = payload.data.data;
        state.status = "succeded";
        state.showLoaderModal = false;

        state.cancelBillCheckData = [...cancelBillCheckData];
        state.notify = null;
        state.notify = { type: "success", message: payload.data.message };
      } else {
        let notify = { type: "danger", message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(cancelBillCheckData.rejected, (state) => {
      state.status = "rejected";
    });

    //__________________________getSectionData_______________________

    builder.addCase(sectionDropDownData.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(sectionDropDownData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let sectionDropDownData = payload.data.data;
        state.status = "succeded";
        state.showLoaderModal = false;

        state.sectionDropDownData = [...sectionDropDownData];
        state.notify = null;
        state.notify = { type: "success", message: payload.data.message };
      } else {
        let notify = { type: "danger", message: payload.data.message };
        state.notify = null;
        state.notify = notify;
      }
    });
    builder.addCase(sectionDropDownData.rejected, (state) => {
      state.status = "rejected";
    });

    //___________________________getAllAuthoritity_____________________

    builder.addCase(getModuleSettingData.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });
    builder.addCase(getModuleSettingData.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getModuleSettingData = payload.data.data;

    
  
        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getModuleSettingData.length; i++) {
          getModuleSettingData[i].counter = count++;
        }
        state.getModuleSettingData = [...getModuleSettingData];
    
      }
    });
    builder.addCase(getModuleSettingData.rejected, (state) => {
      state.status = "rejected";
    });

    //______________________getSubModuleData__________________________


    builder.addCase(getSubmoduleData.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });
    builder.addCase(getSubmoduleData.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        
        let getSubmoduleData = payload.data.data.map((d) => ({ value: d.id, label: d.name }))

    
  
        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < getSubmoduleData.length; i++) {
          getSubmoduleData[i].counter = count++;
        }
        state.getSubmoduleData = [...getSubmoduleData];
    
      }
    });
    builder.addCase(getSubmoduleData.rejected, (state) => {
      state.status = "rejected";
    });
    //___________________createAuthority______________________

    builder.addCase(creteAuthority.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });
    builder.addCase(creteAuthority.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let creteAuthority = payload.data.data
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };

    
  
        state.status = "succeded";
        state.showLoaderModal = false;
       
        state.creteAuthority =creteAuthority
    
      }
    });
    builder.addCase(creteAuthority.rejected, (state) => {
      state.status = "rejected";
    });

    //_________________________updateAuthority___________________


    builder.addCase(updateAuthority.pending, (state) => {
      state.status = "loading";
      state.notify = null;
    });
    builder.addCase(updateAuthority.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let updateAuthority = payload.data.data
        state.notify = { type: "success", message: payload.data.message };
        state.modal = { showModal: false, modalData: null, modalHeader: "" };

    
  
        state.status = "succeded";
        state.showLoaderModal = false;
       
        state.updateAuthority =updateAuthority
    
      }
    });
    builder.addCase(updateAuthority.rejected, (state) => {
      state.status = "rejected";
    });



  },
});

export const { handleModalOpen, handleModalClose } = BillCheckingTransactionSlice.actions;
export default BillCheckingTransactionSlice.reducer;
