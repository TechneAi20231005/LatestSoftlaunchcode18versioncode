import { createSlice } from "@reduxjs/toolkit";
import { UpdateBillCheckingTransaction, getBillcheckingData, getUpdatedAuthoritiesData, getcreateAuthoritiesData, postBillcheckingData } from "./BillCheckingTransactionAction";

const initialState = {
  status: "",
  err: "",

  notify: {},
  getAllbillCheckingData: [],
  sortedBillCheckingData:[],
  updateBillCheckingTransactionData:[],
  exportData:[],
  authoritiesData:"",
  authorityData:"",


};

export const BillCheckingTransactionSlice = createSlice({
  name: "BillCheckingTransactionSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
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
            getAllbillCheckingDatalate_name: getAllbillCheckingData[key].getAllbillCheckingDatalate_name,
            employee_name: getAllbillCheckingData[key].employee_name,

            "Payment Date": getAllbillCheckingData[key].payment_date,
            "Bill No": getAllbillCheckingData[key].vendor_bill_no,
            "Actual Payment Date": getAllbillCheckingData[key].actual_payment_date,
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
            "Is Original Bill": getAllbillCheckingData[key].is_original_bill_needed,
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
            total_level: getAllbillCheckingData[key].level,
            last_approved_by: getAllbillCheckingData[key].last_approved_by,
            approvedBy: getAllbillCheckingData[key].approvedBy,
            "Pending From": getAllbillCheckingData[key].level_approver,
            audit_remark: getAllbillCheckingData[key].audit_remark,
            external_audit_remark: getAllbillCheckingData[key].external_audit_remark,

            levels_of_approval: getAllbillCheckingData[key].levels_of_approval,

            level_approver: getAllbillCheckingData[key].level_approver,
            is_editable_for_creator: getAllbillCheckingData[key].is_editable_for_creator,
            is_rejected: getAllbillCheckingData[key].is_rejected,
            "Is cancelled": getAllbillCheckingData[key].cancelled,
          });
        }

        const exportData=[]
        for (const key in getAllbillCheckingData) {
          exportData.push({
            // counter: counter++,
            SrNo: getAllbillCheckingData.length + 1,
            "Bill ID": getAllbillCheckingData[key].bc_id,
            "Vendor Name": getAllbillCheckingData[key].vendor_id_name,
            "Payment Date": getAllbillCheckingData[key].payment_date,
            "Bill No": getAllbillCheckingData[key].vendor_bill_no,
            "Actual Payment Date": getAllbillCheckingData[key].actual_payment_date,
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
            is_editable_for_creator: getAllbillCheckingData[key].is_editable_for_creator,

            "Levels of approval": getAllbillCheckingData[key].levels_of_approval,
            "Approve By": getAllbillCheckingData[key].approved_by,
            "Pending From": getAllbillCheckingData[key].level_approver,

            "Assign From": getAllbillCheckingData[key].created_by,
            "Assign To": getAllbillCheckingData[key].assign_to_name,
            is_assign_to: getAllbillCheckingData[key].is_assign_to == 0 ? "NO" : "YES",

            approvedBy: getAllbillCheckingData[key].approvedBy,
            "Is Original Bill": getAllbillCheckingData[key].is_original_bill_needed,

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
        state.sortedBillCheckingData=sortedBillCheckingData;
        state.exportData=exportData
      }
    });
    builder.addCase(getBillcheckingData.rejected, (state) => {
      state.status = "rejected";
    });

    //   // post general setting

      builder.addCase(postBillcheckingData.pending, (state) => {
        state.status = "loading";

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

      });

      builder.addCase(UpdateBillCheckingTransaction.fulfilled, (state, action) => {
        const { payload } = action;
        if (payload?.status === 200 && payload?.data?.status === 1) {
          let updateBillCheckingTransactionData = payload.data.data;
          state.status = "succeded";
          state.showLoaderModal = false;

          state.updateBillCheckingTransactionData = [...updateBillCheckingTransactionData];
          state.notify = null;
          state.notify = { type: "success", message: payload.data.message };
        } else {
          let notify = { type: "danger", message: payload.data.message };
          state.notify = null;
          state.notify = notify;

        }
      });
      builder.addCase(UpdateBillCheckingTransaction.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export default BillCheckingTransactionSlice.reducer;
