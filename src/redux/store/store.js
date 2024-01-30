import { configureStore } from "@reduxjs/toolkit";

import rolemasterSlice from "../../screens/Masters/RoleMaster/RoleMasterSlice";

import ConsolidatedSlice from "../../screens/ConsolidatedView/ConsolidatedSlice";
import dashboardSlice from "../../screens/Dashboard/DashboardSlice";
import DepartmentMasterSlice from "../../screens/Masters/DepartmentMaster/DepartmentMasterSlice";
import TaskAndTicketTypeMasterSlice from "../../screens/Masters/TaskAndTicketTypeMaster/TaskAndTicketTypeMasterSlice";
import TaskAndTicketTypeMaster from "../../screens/Masters/TaskAndTicketTypeMaster/TaskAndTicketTypeMaster";
import PaymentTemplateMasterSlice from "../../screens/BillChecking/Masters/BillTypeMaster/PaymentTemplateMasterSlice";
import TestingTypeComponentSlices from "../../screens/Masters/TestingTypeMaster/TestingTypeComponentSlices";
import ModuleSlice from "../../screens/ProjectManagement/ModuleMaster/ModuleSlice";
import submoduleSlice from "../../screens/ProjectManagement/SubModuleMaster/SubModuleMasterSlice";
import TemplateComponetSlice from "../../screens/Masters/TemplateMaster/TemplateComponetSlice";
import QueryTypeComponetSlice from "../../screens/Masters/QueryTypeMaster/QueryTypeComponetSlice";

export const store = configureStore({
  reducer: {
    rolemaster: rolemasterSlice,
    dashboard: dashboardSlice,
    department: DepartmentMasterSlice,
    taskandticket: TaskAndTicketTypeMasterSlice,
    paymentmaster: PaymentTemplateMasterSlice,
    testingData: TestingTypeComponentSlices,
    moduleMaster: ModuleSlice,
    subModuleMaster:submoduleSlice,
    tempateMaster:TemplateComponetSlice,
    queryTypeMaster:QueryTypeComponetSlice,

    consolidatedData: ConsolidatedSlice,
  },
});
