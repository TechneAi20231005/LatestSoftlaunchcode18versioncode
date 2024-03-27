import { getDateTime } from "../components/Utilities/Functions";

export const _ErrorMsg = "Try After Some Time !!!";

export var dataFormat = { status: 0, message: null, data: null };

//Development :3_SoftLaunchDummy TSDDummy
//Production : 3_SoftLaunch TSNewBackend

export const _pincodeUrl = "https://api.postalpincode.in/pincode/";

// export const _base ='3_SoftLaunch';
// export const _apiUrl = "http://15.207.120.175/TSNewBackend/public/api/";
// export const _attachmentUrl='http://15.207.120.175/TSNewBackend/';

// export const _base ='3_SoftLaunchDummy';
// export const _apiUrl = "http://15.207.120.175/3_SoftLaunchDummyDevelopment/public/api/";
// export const _attachmentUrl="http://15.207.120.175/3_SoftLaunchDummyDevelopment/";

export const _base = "3_SoftLaunch";
export const _apiUrl =
  "http://3.108.206.34/3_SoftLaunch/TSNewBackend/public/api/";
export const _attachmentUrl = "http://3.108.206.34/3_SoftLaunch/TSNewBackend/";

export const loginURL = _apiUrl + "login";
export const fpURL = _apiUrl + "reset/forgetPasswordOtp";
export const otpURL = _apiUrl + "reset/sendOtp";
export const rpURL = _apiUrl + "reset/resetPassword";

export const userSessionData = {
  tenantId: sessionStorage.getItem("tenant_id"),
  userId: sessionStorage.getItem("id"),
  account_for: sessionStorage.getItem("account_for"),
  customer_id: sessionStorage.getItem("customer_id"),
  department_id: sessionStorage.getItem("department_id"),
  Allow_Paid_Entry_Change: sessionStorage.getItem("Allow_Paid_Entry_Change"),
  Paid_Entry_Change: sessionStorage.getItem("Paid_Entry_Change"),
  Auto_Update_Payment: sessionStorage.getItem("Auto_Update_Payment"),
  Download_Payment: sessionStorage.getItem("Download_Payment"),
  Update_Bill: sessionStorage.getItem("Update_Bill"),
  Received_Date: sessionStorage.getItem("Received_Date"),
  Internal_Audit: sessionStorage.getItem("Internal_Audit"),
  External_Audit: sessionStorage.getItem("External_Audit"),
  Original_Bill_Needed: sessionStorage.getItem("Original_Bill_Needed"),
  TCS_Applicable: sessionStorage.getItem("TCS_Applicable"),
  Update_ACME_Account_Name: sessionStorage.getItem("Update_ACME_Account_Name"),
  Bank_Details: sessionStorage.getItem("Bank_Details"),
  Payment_Date: sessionStorage.getItem("Payment_Date"),
  Amount_To_Be_Paid: sessionStorage.getItem("Amount_To_Be_Paid"),
  Bill_Payment: sessionStorage.getItem("Bill_Payment"),
  Edit_In_Bill: sessionStorage.getItem("Edit_In_Bill"),
  Edit_Vendor_Master_Bank_Details: sessionStorage.getItem(
    "Edit_Vendor_Master_Bank_Details"
  ),
  Past_Financial_Year_Bill_Date: sessionStorage.getItem(
    "Past_Financial_Year_Bill_Date"
  ),
  Prepone_Payment_Date: sessionStorage.getItem("Prepone_Payment_Date"),
  Update_ERP_Account_Name: sessionStorage.getItem("Update_ERP_Account_Name"),
  Allow_Edit_Authorized_By_Management: sessionStorage.getItem(
    "Allow_Edit_Authorized_By_Management"
  ),
  Allow_Edit_Authorized_By_HOD: sessionStorage.getItem(
    "Allow_Edit_Authorized_By_HOD"
  ),
  Update_Payment_Details: sessionStorage.getItem("Update_Payment_Details"),
  All_Update_Bill: sessionStorage.getItem("All_Update_Bill"),
  time: getDateTime(),
};

export const menuUrl =
  _apiUrl + "getMenuByRoleId/" + sessionStorage.getItem("role_id");

export const masterURL = {
  user: _apiUrl + "employeeMaster",
  tenant: _apiUrl + "tenantMaster",
  customer: _apiUrl + "customerMaster",
  employee: _apiUrl + "employeeMaster",
  country: _apiUrl + "countryMaster",
  state: _apiUrl + "stateMaster",
  city: _apiUrl + "cityMaster",
  role: _apiUrl + "roleMaster",
  department: _apiUrl + "departmentMaster",
  designation: _apiUrl + "designationMaster",
  status: _apiUrl + "statusMaster",
  dynamicForm: _apiUrl + "dynamicFormMaster",
  template: _apiUrl + "templateMaster",
  customerType: _apiUrl + "customerTypeMaster",
  queryType: _apiUrl + "queryTypeMaster",
  departmentMapping: _apiUrl + "departmentMapping",
  moduleSetting: _apiUrl + "moduleSetting",
  dynamicFormDropdownMaster: _apiUrl + "dynamicFormDropdownMaster",
  testingTypeMaster: _apiUrl + "testingTypeMaster",
  taskTicketTypeMaster: _apiUrl + "taskticketTypeMaster",
};

export const dynamicURL = {
  user: _apiUrl + "employeeMaster",
  tenant: _apiUrl + "tenantMaster",
  customer: _apiUrl + "customerMaster",
  employee: _apiUrl + "employeeMaster",
  country: _apiUrl + "countryMaster",
  state: _apiUrl + "stateMaster",
  city: _apiUrl + "cityMaster",
  role: _apiUrl + "roleMaster",
  department: _apiUrl + "departmentMaster/",
  designation: _apiUrl + "designationMaster",
  status: _apiUrl + "statusMaster",
  dynamicForm: _apiUrl + "dynamicFormMaster",
  template: _apiUrl + "templateMaster",
  customerType: _apiUrl + "customerTypeMaster",
  queryType: _apiUrl + "queryTypeMaster",
  departmentMapping: _apiUrl + "departmentMapping",
  moduleSetting: _apiUrl + "moduleSetting",
  dynamicFormDropdownMaster: _apiUrl + "dynamicFormDropdownMaster",
  testingTypeMaster: _apiUrl + "testingTypeMaster",
};

export const ticketUrl = {
  ticket: _apiUrl + "ticketMaster",
  dynamicForm: _apiUrl + "createForm",
  basket: _apiUrl + "ticketBasket",
  task: _apiUrl + "ticketTask",
  subtask: _apiUrl + "ticketSubtask",
  timerData: _apiUrl + "timerData",
  postTimerDataGroupActivity: _apiUrl + "postTimerDataGroupActivity",
  stopTimerDataGroupActivity: _apiUrl + "stopTimerDataGroupActivity",
};

export const reportUrl = {
  ticketReport: _apiUrl + "report/ticketReport",
  userTaskReport: _apiUrl + "report/userTaskReport",
  ticketTimelineReport: _apiUrl + "report/ticketTimelineReport",
  resourcePlanningReport: _apiUrl + "report/resourcePlanning",
  variantsReport: _apiUrl + "report/variantsReport",
  // hoursWiseTaskRecord:_apiUrl + "hoursWiseTaskRecord",  //Asmita - New api for timeline report chart
};

export const errorLogUrl = {
  catchError: _apiUrl + "errorLog/catchError",
};

export const consolidateViewUrl = {
  consolidateViewUrl: _apiUrl + "consolidatedView",
};

export const projectManagementUrl = {
  projectUrl: _apiUrl + "projects",
  moduleUrl: _apiUrl + "module",
  subModuleUrl: _apiUrl + "submodule",
  consolidateViewUrl: _apiUrl + "consolidatedView",
};

export const menuManagementUrl = {
  menusUrl: _apiUrl + "menuManagement",
};

export const dashboardUrl = _apiUrl + "dashboard";

export const notificationUrl = _apiUrl + "notification";

export const attachmentUrl = _apiUrl + "attachment";

export const settingMasterUrl = {
  customerMapping: _apiUrl + "customerMapping",
  moduleSetting: _apiUrl + "moduleSetting",
  getModuleSetting: _apiUrl + "module",
  getGeneralSetting: _apiUrl + "consolidatedView",
};

export const connectorUrl = {
  connector: _apiUrl + "connector",
  testcaseUrl: _apiUrl + "testCases",
  testSuiteUrl: _apiUrl + "testSuitMaster",
  testcaseUpdateUrl: _apiUrl + "testCase",
};

export const billCheckingMasterUrl = {
  billChecking: _apiUrl + "billCheckingMaster",
};
