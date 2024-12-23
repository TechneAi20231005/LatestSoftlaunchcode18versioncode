import { getDateTime } from '../components/Utilities/Functions';
import {
  REACT_APP_API_URL,
  REACT_APP_PIN_CODE_API_URL,
  REACT_APP_ATTACHMENT_URL,
  REACT_APP_ROOT_URL,
  REACT_APP_API_REWAMP_BASE_URL
} from '../config/envConfig';

export const _ErrorMsg = 'Try After Some Time !!!';

export var dataFormat = { status: 0, message: null, data: null };

export const _base = REACT_APP_ROOT_URL;
export const _apiUrl = REACT_APP_API_URL;
export const _rewampApiUrl = REACT_APP_API_REWAMP_BASE_URL;
export const _attachmentUrl = REACT_APP_ATTACHMENT_URL;
export const _pincodeUrl = REACT_APP_PIN_CODE_API_URL;

export const loginURL = _rewampApiUrl + 'login';
export const fpURL = _apiUrl + 'reset/forgetPasswordOtp';
export const otpURL = _apiUrl + 'reset/sendOtp';
export const rpURL = _apiUrl + 'reset/resetPassword';

export const attachmentUrl = _apiUrl + 'attachment';

export const userSessionData = {
  tenantId: localStorage.getItem('tenant_id'),
  userId: localStorage.getItem('id'),
  account_for: localStorage.getItem('account_for'),
  customer_id: localStorage.getItem('customer_id'),
  department_id: localStorage.getItem('department_id'),
  Allow_Paid_Entry_Change: localStorage.getItem('Allow_Paid_Entry_Change'),
  Paid_Entry_Change: localStorage.getItem('Paid_Entry_Change'),
  Auto_Update_Payment: localStorage.getItem('Auto_Update_Payment'),
  Download_Payment: localStorage.getItem('Download_Payment'),
  Update_Bill: localStorage.getItem('Update_Bill'),
  Received_Date: localStorage.getItem('Received_Date'),
  Internal_Audit: localStorage.getItem('Internal_Audit'),
  External_Audit: localStorage.getItem('External_Audit'),
  Original_Bill_Needed: localStorage.getItem('Original_Bill_Needed'),
  TCS_Applicable: localStorage.getItem('TCS_Applicable'),
  Update_ACME_Account_Name: localStorage.getItem('Update_ACME_Account_Name'),
  Bank_Details: localStorage.getItem('Bank_Details'),
  Payment_Date: localStorage.getItem('Payment_Date'),
  Amount_To_Be_Paid: localStorage.getItem('Amount_To_Be_Paid'),
  Bill_Payment: localStorage.getItem('Bill_Payment'),
  Edit_In_Bill: localStorage.getItem('Edit_In_Bill'),
  Edit_Vendor_Master_Bank_Details: localStorage.getItem(
    'Edit_Vendor_Master_Bank_Details'
  ),
  Past_Financial_Year_Bill_Date: localStorage.getItem(
    'Past_Financial_Year_Bill_Date'
  ),
  Prepone_Payment_Date: localStorage.getItem('Prepone_Payment_Date'),
  Update_ERP_Account_Name: localStorage.getItem('Update_ERP_Account_Name'),
  Allow_Edit_Authorized_By_Management: localStorage.getItem(
    'Allow_Edit_Authorized_By_Management'
  ),
  Allow_Edit_Authorized_By_HOD: localStorage.getItem(
    'Allow_Edit_Authorized_By_HOD'
  ),
  Update_Payment_Details: localStorage.getItem('Update_Payment_Details'),
  All_Update_Bill: localStorage.getItem('All_Update_Bill'),
  time: getDateTime()
};

export const menuUrl =
  _apiUrl + 'getMenuByRoleId/' + localStorage.getItem('role_id');

export const masterURL = {
  user: _apiUrl + 'employeeMaster',
  tenant: _apiUrl + 'tenantMaster',
  customer: _rewampApiUrl + 'customerMaster',
  employee: _rewampApiUrl + 'employeeMaster',
  country: _rewampApiUrl + 'countryMaster',
  state: _rewampApiUrl + 'stateMaster',
  city: _rewampApiUrl + 'cityMaster',
  role: _rewampApiUrl + 'roleMaster',
  department: _rewampApiUrl + 'departmentMaster',
  designation: _rewampApiUrl + 'designationMaster',
  status: _rewampApiUrl + 'statusMaster',
  dynamicForm: _rewampApiUrl + 'dynamicFormMaster',
  template: _apiUrl + 'templateMaster',
  customerType: _rewampApiUrl + 'customerTypeMaster',
  queryType: _rewampApiUrl + 'queryTypeMaster/queryType',
  getAllQueryGroup: _rewampApiUrl + 'queryTypeMaster/queryGroup',

  departmentMapping: _apiUrl + 'departmentMapping',
  moduleSetting: _apiUrl + 'moduleSetting',
  dynamicFormDropdownMaster: _apiUrl + 'dynamicFormDropdownMaster',
  testingTypeMaster: _apiUrl + 'testingTypeMaster',
  taskTicketTypeMaster: _apiUrl + 'taskticketTypeMaster',
  sprintMaster: _apiUrl + 'sprintMaster',
  projectMaster: _rewampApiUrl + 'projectMaster',
  moduleMaster: _rewampApiUrl + 'moduleMaster',
  subModuleMaster: _rewampApiUrl + 'subModuleMaster'
};

export const dynamicURL = {
  user: _apiUrl + 'employeeMaster',
  tenant: _apiUrl + 'tenantMaster',
  customer: _apiUrl + 'customerMaster',
  employee: _apiUrl + 'employeeMaster',
  country: _apiUrl + 'countryMaster',
  state: _apiUrl + 'stateMaster',
  city: _apiUrl + 'cityMaster/getData',
  role: _apiUrl + 'roleMaster',
  department: _apiUrl + 'departmentMaster/',
  designation: _apiUrl + 'designationMaster',
  status: _apiUrl + 'statusMaster',
  dynamicForm: _apiUrl + 'dynamicFormMaster',
  template: _apiUrl + 'templateMaster',
  customerType: _apiUrl + 'customerTypeMaster',
  queryType: _apiUrl + 'queryTypeMaster',
  departmentMapping: _apiUrl + 'departmentMapping',
  moduleSetting: _apiUrl + 'moduleSetting',
  dynamicFormDropdownMaster: _apiUrl + 'dynamicFormDropdownMaster',
  testingTypeMaster: _apiUrl + 'testingTypeMaster'
};

export const ticketUrl = {
  ticket: _apiUrl + 'ticketMaster',
  dynamicForm: _apiUrl + 'createForm',
  basket: _apiUrl + 'ticketBasket',
  task: _apiUrl + 'ticketTask',
  subtask: _apiUrl + 'ticketSubtask',
  timerData: _apiUrl + 'timerData',
  postTimerDataGroupActivity: _apiUrl + 'postTimerDataGroupActivity',
  stopTimerDataGroupActivity: _apiUrl + 'stopTimerDataGroupActivity'
};

export const reportUrl = {
  ticketReport: _apiUrl + 'report/ticketReport',
  userTaskReport: _apiUrl + 'report/userTaskReport',
  ticketTimelineReport: _apiUrl + 'report/ticketTimelineReport',
  resourcePlanningReport: _apiUrl + 'report/resourcePlanning',
  variantsReport: _apiUrl + 'report/variantsReport'
  // hoursWiseTaskRecord:_apiUrl + "hoursWiseTaskRecord",  //Asmita - New api for timeline report chart
};

export const errorLogUrl = {
  catchError: _apiUrl + 'errorLog/catchError'
};

export const consolidateViewUrl = {
  consolidateViewUrl: _apiUrl + 'consolidatedView'
};

export const projectManagementUrl = {
  projectUrl: _apiUrl + 'projects',
  moduleUrl: _apiUrl + 'module',
  subModuleUrl: _apiUrl + 'submodule',
  consolidateViewUrl: _apiUrl + 'consolidatedView'
};

export const menuManagementUrl = {
  menusUrl: _apiUrl + 'menuManagement'
};

export const dashboardUrl = _apiUrl + 'dashboard';

export const notificationUrl = _apiUrl + 'notification';

export const settingMasterUrl = {
  customerMapping: _apiUrl + 'customerMapping',
  moduleSetting: _apiUrl + 'moduleSetting',
  getModuleSetting: _apiUrl + 'module',
  getGeneralSetting: _rewampApiUrl + 'consolidatedView'
};

export const connectorUrl = {
  connector: _apiUrl + 'connector',
  testcaseUrl: _apiUrl + 'testCases',
  testSuiteUrl: _apiUrl + 'testSuitMaster',
  testcaseUpdateUrl: _apiUrl + 'testCase'
};

export const billCheckingMasterUrl = {
  billChecking: _apiUrl + 'billCheckingMaster'
};

export const experienceLevel = [
  { label: 'Fresher', value: 'fresher' },
  { label: '0-1 years of experience', value: '0-1' },
  { label: '1-3 years of experience', value: '1-3' },
  { label: '3-5 years of experience', value: '3-5' },
  { label: '5+ years of experience', value: '5+' }
];
