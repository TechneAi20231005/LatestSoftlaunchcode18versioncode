import { createSlice } from "@reduxjs/toolkit";
import { getBillDetailsOfPaymentGridData, getBillPayment } from "./BillPaymentsAction";

const initialState = {
  status: "",
  err: "",
  billPaymentData: [],
  sortBillPaymentData: [],
  billPaymentGridData:[],
};

export const BillpaymentSlice = createSlice({
  name: "PaymentDetailsSilce",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
     
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getBillPayment.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getBillPayment.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let billPaymentData = payload.data.data;
        const temp = payload.data.data;
        let sortBillPaymentData = [];
        let counter = 1;
        for (const key in temp) {
          sortBillPaymentData.push({
            "Sr.No": counter++,
            "Vendor Name": temp[key].vendor_name,
            "Bill Type": temp[key].bill_type,
            "Payment Date": temp[key].payment_date,
            "Payment Amount": temp[key].total_payment,
            "Vendor Bill No": temp[key].bill_no,
            "Bill ID": temp[key].bc_id,
            "SBI Amount": temp[key].balance,
            Remark: temp[key].remark,
            "Beneficiary name": temp[key].beneficiary_name,
            "Bank Name": temp[key].bank_name,
            "Branch Name": temp[key].bank_branch_name,
            "Account Number": temp[key].account_no,
            "IFSC Code": temp[key].ifsc_code,
            Tds: temp[key].tds_amount,
            IGST: temp[key].igst_amount,

            GST: temp[key].gst_amount,
            "Net Payment": temp[key].net_payment,
            "IFSC Code": temp[key].ifsc_code,

            "Amount to be paid": temp[key].amount_to_be_paid,

            "Payment status": temp[key].convention_name,

            "Vendor id": temp[key].vendor_id,
            "bill Type Id": temp[key].bill_type_id,
            bill_amount: temp[key].bill_amount,
          });
        }
      

        state.sortBillPaymentData = sortBillPaymentData;
      }
    });
    builder.addCase(getBillPayment.rejected, (state) => {
      state.status = "rejected";
    });



    builder.addCase(getBillDetailsOfPaymentGridData.pending, (state) => {
        state.status = "loading";
      });
      builder.addCase(getBillDetailsOfPaymentGridData.fulfilled, (state, action) => {
        const { payload } = action;
        if (payload?.status === 200 && payload?.data?.status === 1) {
          let billPaymentGridData = payload.data.data;
         
       
         
  
          state.billPaymentGridData = billPaymentGridData;
        }
      });
      builder.addCase(getBillDetailsOfPaymentGridData.rejected, (state) => {
        state.status = "rejected";
      });
  },
});
export default BillpaymentSlice.reducer;
