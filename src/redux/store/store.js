import { configureStore } from "@reduxjs/toolkit";
// import loginReducer from "../components/Auth/AuthSices/loginSlice";
import loginReducer from "../../components/Auth/AuthSices/loginSlice"
import DashboardSlice from "../../screens/Dashboard/DashbordSlice";
import MyTicketComponentSlice from "../../screens/TicketManagement/MyTicketComponentSlice";
import settingSlice from "../../screens/Settings/SettingSlice";
import PaymentDetailsSilce from "../../screens/BillChecking/PaymentDetails/PaymentDetailsSlice";
import BillpaymentSlice from "../../screens/BillChecking/BillPayments/BillPaymentsSlice";
import TaskComponentSlice from "../../screens/TicketManagement/TaskManagement/TaskComponentSlice";
export const store = configureStore({
  reducer: {
    login: loginReducer,
    dashboard: DashboardSlice,
    myTicketComponent: MyTicketComponentSlice,
    taskComponent: TaskComponentSlice,
    generalSetting: settingSlice,
    paymentDetails: PaymentDetailsSilce,
    Billpayment: BillpaymentSlice,
  },
});
