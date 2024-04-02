import { configureStore } from '@reduxjs/toolkit';

import loginReducer from '../../components/Auth/AuthSices/loginSlice';
import MyTicketComponentSlice from '../../screens/TicketManagement/MyTicketComponentSlice';
import TaskcomponentSlice from '../../screens/TicketManagement/TaskManagement/TaskComponentSlice';
import SettingSlice from '../../screens/Settings/SettingSlice';
import PaymentDetailsSilce from '../../screens/BillChecking/PaymentDetails/PaymentDetailsSlice';

import BillpaymentSlice from '../../screens/BillChecking/BillPayments/BillPaymentsSlice';
import SubTaskSlice from '../../screens/TicketManagement/BasketManagement/Slices/SubtaskSlice';
import TaskHistorySlice from '../../screens/TicketManagement/BasketManagement/Slices/TaskHistorySlice';
import PlannerSlice from '../../screens/TicketManagement/BasketManagement/Slices/PlannerSlice';
import TimeRegularizationSlice from '../../screens/TicketManagement/BasketManagement/Slices/TimeRegularizationSlice';
import rolemasterSlice from '../../screens/Masters/RoleMaster/RoleMasterSlice';

import ConsolidatedSlice from '../../screens/ConsolidatedView/ConsolidatedSlice';
import DepartmentMasterSlice from '../../screens/Masters/DepartmentMaster/DepartmentMasterSlice';
import TaskAndTicketTypeMasterSlice from '../../screens/Masters/TaskAndTicketTypeMaster/TaskAndTicketTypeMasterSlice';

import PaymentTemplateMasterSlice from '../../screens/BillChecking/Masters/BillTypeMaster/PaymentTemplateMasterSlice';
import TestingTypeComponentSlices from '../../screens/Masters/TestingTypeMaster/TestingTypeComponentSlices';
import ModuleSlice from '../../screens/ProjectManagement/ModuleMaster/ModuleSlice';
import submoduleSlice from '../../screens/ProjectManagement/SubModuleMaster/SubModuleMasterSlice';
import TemplateComponetSlice from '../../screens/Masters/TemplateMaster/TemplateComponetSlice';
import QueryTypeComponetSlice from '../../screens/Masters/QueryTypeMaster/QueryTypeComponetSlice';
import DesignationSlice from '../../screens/Masters/DesignationMaster/DesignationSlice';
import statusMasterSlice from '../../screens/Masters/StatusMaster/StatusComponentSlice';
import ProjectMasterSlice from '../../screens/ProjectManagement/ProjectMaster/ProjectMasterSlice';
import BillCheckingTransactionSlice from '../../screens/BillChecking/Slices/BillCheckingTransactionSlice';
import VendorMasterSlice from '../../screens/BillChecking/Slices/VendorMasterSlice';

import TenantComponentSlice from '../../screens/TenantManagement/TenantComponentSlice';
import CustomerTypeComponentSlice from '../../screens/Masters/CustomerTypeMaster/CustomerTypeComponentSlice';
import TicketSlices from '../../screens/TicketManagement/Slices/TicketSlices';
import CustomerMappingSlice from '../../screens/Settings/CustomerMapping/Slices/CustomerMappingSlice';
import DashbordSlice from '../../screens/Dashboard/DashbordSlice';
import DynamicFormDropDownSlice from '../../screens/Masters/DynamicFormDropdown/Slices/DynamicFormDropDownSlice';

// // HRMS>>Employee Joining
import branchMaster from '../slices/hrms/employeeJoining/branchMaster';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    dashboard: DashbordSlice,
    myTicketComponent: MyTicketComponentSlice,
    taskComponent: TaskcomponentSlice,
    generalSetting: SettingSlice,
    paymentDetails: PaymentDetailsSilce,
    Billpayment: BillpaymentSlice,
    subTask: SubTaskSlice,
    taskHistory: TaskHistorySlice,
    timeRegularization: TimeRegularizationSlice,
    planner: PlannerSlice,
    rolemaster: rolemasterSlice,
    department: DepartmentMasterSlice,
    taskandticket: TaskAndTicketTypeMasterSlice,
    paymentmaster: PaymentTemplateMasterSlice,
    testingData: TestingTypeComponentSlices,
    moduleMaster: ModuleSlice,
    subModuleMaster: submoduleSlice,
    tempateMaster: TemplateComponetSlice,
    queryTypeMaster: QueryTypeComponetSlice,
    designationMaster: DesignationSlice,
    statusMaster: statusMasterSlice,
    projectMaster: ProjectMasterSlice,
    billChecking: BillCheckingTransactionSlice,
    vendorMaster: VendorMasterSlice,
    tenantMaster: TenantComponentSlice,
    customerTypeMaster: CustomerTypeComponentSlice,
    ticket: TicketSlices,
    customerMaster: CustomerMappingSlice,
    dynamicFormDropDown: DynamicFormDropDownSlice,
    consolidatedData: ConsolidatedSlice,

    // // HRMS>>Employee Joining
    branchMaster: branchMaster,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
