import { createSlice } from "@reduxjs/toolkit";
import { BulkUploadVendorData, PaymentDropDown, downloadFormat, downloadFormatData, getAllActiveState, getVendorData, getVendorMasterData, paymentDropDown, postVendor } from "./VendorMasterAction";

const initialState = {
  status: "",
  err: "",

  notify: null,
  getVendorMasterData:[],
  exportData:[],
  vendorMasterDropDown:[],
  getVendorAllData:[],
  paymentDropDownData:[],
  state:[]
};

export const VendorMasterSlice = createSlice({
  name: "VendorMasterSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    // get general setting
    builder.addCase(getVendorMasterData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getVendorMasterData.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let getVendorMasterData = payload.data.data;
        const temp = getVendorMasterData.filter((d) => d.is_active == 1);
        const vendorMasterDropDown = temp.map((d) => ({
            value: d.id,
            label: d.vendor_name,
          }))

    
          
        state.status = "succeded";
        state.showLoaderModal = false;
     
        state.vendorMasterDropDown=vendorMasterDropDown
        }
      
    });
    builder.addCase(getVendorMasterData.rejected, (state) => {
      state.status = "rejected";
    });




    builder.addCase(postVendor.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(postVendor.fulfilled, (state, action) => {
      const { payload } = action;
      state.notify=null
      if (payload?.status === 200 && payload?.data?.status === 1) {
        
    
          
        state.status = "succeded";
        state.showLoaderModal = false;
        state.status = "succeeded";
        state.showLoaderModal = false;
        state.notify = { type: "success", message: payload.data.message };
      } else {
        state.status = "failed";
        state.showLoaderModal = false;
        state.notify = { type: "danger", message: payload.data.message };
      }
      
    });
    builder.addCase(postVendor.rejected, (state) => {
      state.status = "rejected";
    });




    builder.addCase(getVendorData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getVendorData.fulfilled, (state, action) => {
      const { payload } = action;
      state.notify=null
      if (payload?.status === 200 && payload?.data?.status === 1) {
        const temp = payload.data.data
        const getVendorAllData =[]
        let counter = 1;
        for (const key in temp) {
          getVendorAllData.push({
            id: temp[key].id,
            counter: counter++,
            vendor_name: temp[key].vendor_name,
            address: temp[key].address,
            is_active: temp[key].is_active,
            remark: temp[key].remark,

            created_at: temp[key].created_at,
            created_by_name: temp[key].created_by_name,

            updated_at: temp[key].updated_at,
            updated_by_name: temp[key].updated_by_name,

            country: temp[key].country,
            state: temp[key].state,
            city: temp[key].city,

            pincode: temp[key].pincode,
            mobile_no: temp[key].mobile_no,
            email: temp[key].email,

            adhar_no: temp[key].adhar_no,
            pan_no: temp[key].pan_no,

            msme_no: temp[key].msme_no,
            gst_no: temp[key].gst_no,
            acme_account_name: temp[key].acme_account_name,

            consider_in_payment: temp[key].consider_in_payment,
            bank_name: temp[key].bank_name,
            account_no: temp[key].account_no,
            ifsc_code: temp[key].ifsc_code,
            payment_template: temp[key].payment_template,
            template_name: temp[key].template_name,
            pan_attachment: temp[key].pan_attachment,
            gst_attachment: temp[key].gst_attachment,
            adhar_attachment: temp[key].adhar_attachment,
            msme_attachment: temp[key].msme_attachment,
            bank_passbook_attachment: temp[key].bank_passbook_attachment,
            cheque_attachment: temp[key].cheque_attachment,
            bank_branch_name: temp[key].bank_branch_name,
            beneficiary_name: temp[key].beneficiary_name,
            acme_account_name: temp[key].acme_account_name,
            reference_number: temp[key].reference_number,
            card_number: temp[key].card_number,
            narration: temp[key].narration,
          });
        }
    
        state.getVendorAllData =getVendorAllData
          
        state.status = "succeded";
    
        state.notify = { type: "success", message: payload.data.message };
      } else {

        state.notify = { type: "danger", message: payload.data.message };
      }
      
    });
    builder.addCase(getVendorData.rejected, (state) => {
      state.status = "rejected";
    });





    builder.addCase(PaymentDropDown.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(PaymentDropDown.fulfilled, (state, action) => {
      const { payload } = action;
      state.notify=null
      if (payload?.status === 200 && payload?.data?.status === 1) {
        const temp = payload.data.data
        console.log("tiii",temp)
        const paymentDropDownData = temp.filter((d) => d.is_active === 1)
                .map((i) => ({ value: i.id, label: i.template_name }))
       
    
        state.paymentDropDownData =paymentDropDownData
          console.log("p",state.paymentDropDownData)
        state.status = "succeded";
    
        state.notify = { type: "success", message: payload.data.message };
      } else {

        state.notify = { type: "danger", message: payload.data.message };
      }
      
    });
    builder.addCase(PaymentDropDown.rejected, (state) => {
      state.status = "rejected";
    });




    builder.addCase(downloadFormatData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(downloadFormatData.fulfilled, (state, action) => {
      const { payload } = action;
      state.notify=null
      if (payload?.status === 200 && payload?.data?.status === 1) {
        
        state.status = "succeded";
    
        state.notify = { type: "success", message: payload.data.message };
      } else {

        state.notify = { type: "danger", message: payload.data.message };
      }
      
    });
    builder.addCase(downloadFormatData.rejected, (state) => {
      state.status = "rejected";
    });



    builder.addCase(BulkUploadVendorData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(BulkUploadVendorData.fulfilled, (state, action) => {
      const { payload } = action;
      state.notify=null
      if (payload?.status === 200 && payload?.data?.status === 1) {
        
        state.status = "succeded";
    
        state.notify = { type: "success", message: payload.data.message };
      } else {

        state.notify = { type: "danger", message: payload.data.message };
      }
      
    });
    builder.addCase(BulkUploadVendorData.rejected, (state) => {
      state.status = "rejected";
    });

    builder.addCase(getAllActiveState.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getAllActiveState.fulfilled, (state, action) => {
      const { payload } = action;
      state.notify=null
      if (payload?.status === 200 && payload?.data?.status === 1) {
        state= payload.data.data
        state.state= state
        state.status = "succeded";
    
        state.notify = { type: "success", message: payload.data.message };
      } else {

        state.notify = { type: "danger", message: payload.data.message };
      }
      
    });
    builder.addCase(getAllActiveState.rejected, (state) => {
      state.status = "rejected";
    });

    //   // post general setting

    
  },
});

export default VendorMasterSlice.reducer;
