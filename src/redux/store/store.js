import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../../components/Auth/AuthSices/loginSlice";
import DashboardSlice from "../../screens/Dashboard/DashbordSlice";
import MyTicketComponentSlice from "../../screens/TicketManagement/MyTicketComponentSlice";
import  TaskcomponentSlice from "../../screens/TicketManagement/TaskManagement/TaskComponentSlice";
import SettingSlice from "../../screens/Settings/SettingSlice";
import  PaymentDetailsSilce  from "../../screens/BillChecking/PaymentDetails/PaymentDetailsSlice";

import BillpaymentSlice from "../../screens/BillChecking/BillPayments/BillPaymentsSlice";
import  SubTaskSlice  from "../../screens/TicketManagement/BasketManagement/Slices/SubtaskSlice";
import TaskHistorySlice from "../../screens/TicketManagement/BasketManagement/Slices/TaskHistorySlice";
import PlannerSlice from "../../screens/TicketManagement/BasketManagement/Slices/PlannerSlice";
import TimeRegularizationSlice from "../../screens/TicketManagement/BasketManagement/Slices/TimeRegularizationSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    dashboard: DashboardSlice,
    myTicketComponent: MyTicketComponentSlice,
    taskComponent: TaskcomponentSlice,
    generalSetting: SettingSlice,
    paymentDetails: PaymentDetailsSilce,
    Billpayment: BillpaymentSlice,
    subTask:SubTaskSlice,
    taskHistory:TaskHistorySlice,
    timeRegularization:TimeRegularizationSlice,
    planner:PlannerSlice
  },
});

