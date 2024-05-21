import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  Routes,
} from "react-router-dom";
import { _apiUrl, _base } from "../settings/constants";
import Header from "../components/Common/Header";
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./Dashboard/Profile";

import NotificationComponent from "./Notification/NotificationComponent";
import ApprovedNotificationComponent from "./Notification/ApprovedNotificationComponent";

import TenantForm from "./Masters/TenantMaster/EditForm";

import { CustomerComponent } from "./Masters/CustomerMaster/CustomerComponent";
import EditCustomer from "./Masters/CustomerMaster/EditCustomer";
import CreateCustomer from "./Masters/CustomerMaster/CreateCustomer";
import ForgetPassword from "../components/Auth/ForgetPassword";

import { UserComponent } from "./Masters/UserMaster/UserComponent";
import CreateUserComponent from "./Masters/UserMaster/CreateUserComponent";
import EditUserComponent from "./Masters/UserMaster/EditUserComponent";

import { CountryComponent } from "./Masters/CountryMaster/CountryComponent";
import { StateComponent } from "./Masters/StateMaster/StateComponent";
import { CityComponent } from "./Masters/CityMaster/CityComponent";
import { DesignationComponent } from "./Masters/DesignationMaster/DesignationComponent";
import { DepartmentComponent } from "./Masters/DepartmentMaster/DepartmentComponent";
import { RoleComponent } from "./Masters/RoleMaster/RoleComponent";
import { StatusComponent } from "./Masters/StatusMaster/StatusComponent";

import DepartmentMappingComponent from "./Masters/DepartmentMapping/DepartmentMappingComponent";
import CreateDepartmentMappingComponent from "./Masters/DepartmentMapping/CreateDepartmentMappingComponent";
import EditDepartmentMappingComponent from "./Masters/DepartmentMapping/EditDepartmentMappingComponent";

import { CustomerTypeComponent } from "./Masters/CustomerTypeMaster/CustomerTypeComponent";
import { DynamicFormComponent } from "./Masters/DynamicFormMaster/DynamicFormComponent";
import CreateDynamicForm from "./Masters/DynamicFormMaster/CreateDynamicForm";
import EditDynamicForm from "./Masters/DynamicFormMaster/EditDynamicForm";

import DynamicFormDropdownComponent from "./Masters/DynamicFormDropdown/DynamicFormDropdownComponent";
import CreateDropdownComponent from "./Masters/DynamicFormDropdown/CreateDropdownComponent";
import EditDropdownComponent from "./Masters/DynamicFormDropdown/EditDropdownComponent";

import QueryBuilder from "./Masters/QueryBuilder/QueryBuilder"; //Suyash 8-6-22

import { QueryTypeComponent } from "./Masters/QueryTypeMaster/QueryTypeComponent";
import QueryGroupMasterComponent from "./Masters/MainQueryMaster/QueryGroupMasterComponent";

import { TemplateComponent } from "./Masters/TemplateMaster/TemplateComponent";
import CreateTemplateComponent from "./Masters/TemplateMaster/CreateTemplateComponent";
import EditTemplateComponent from "./Masters/TemplateMaster/EditTemplateComponent";

import { ProjectComponent } from "./ProjectManagement/ProjectMaster/ProjectComponent";
import CreateProjectComponent from "./ProjectManagement/ProjectMaster/CreateProjectComponent";
import EditProjectComponent from "./ProjectManagement/ProjectMaster/EditProjectComponent";

import { ModuleComponent } from "./ProjectManagement/ModuleMaster/ModuleComponent";
import CreateModuleComponent from "./ProjectManagement/ModuleMaster/CreateModuleComponent";
import EditModuleComponent from "./ProjectManagement/ModuleMaster/EditModuleComponent";

import { SubModuleComponent } from "./ProjectManagement/SubModuleMaster/SubModuleComponent";
import CreateSubModuleComponent from "./ProjectManagement/SubModuleMaster/CreateSubModuleComponent";
import EditSubModuleComponent from "./ProjectManagement/SubModuleMaster/EditSubModuleComponent";

import UserTaskReportComponent from "./Reports/UserTaskReportComponent";
import TimelineReportComponent from "./Reports/TimelineReportComponent";
import ResourcePlanningReportComponent from "./Reports/ResourcePlanningReportComponent";
import VariantsReport from "./Reports/VariantsReport";

import MyTicketComponent from "./TicketManagement/MyTicketComponent";
import CreateTicketComponent from "./TicketManagement/CreateTicketComponent";
import EditTicketComponent from "./TicketManagement/EditTicketComponent";

import BasketComponent from "./TicketManagement/BasketManagement/BasketComponent";
import TaskComponent from "./TicketManagement/TaskManagement/TaskComponent";
import TestCases from "./TicketManagement/TaskManagement/components/TestCases";
import GetAllTestCases from "./TicketManagement/TaskManagement/components/GetAllTestCases";
import TestCaseHistory from "./TicketManagement/TaskManagement/components/TestCaseHistory";
import TicketHistory from "./TicketManagement/TicketHistory/TicketHistory";
import TestSuiteComponent from "./TicketManagement/TaskManagement/components/TestSuiteComponent";
// import TestingTypeComponent from "./Masters/TestingTypeMaster/TestingTypeComponent";

import CustomerMappingComponent from "./Settings/CustomerMapping/CustomerMappingComponent";
import CreateCustomerMappingComponent from "./Settings/CustomerMapping/CreateCustomerMappingComponent";
import EditCustomerMappingComponent from "./Settings/CustomerMapping/EditCustomerMappingComponent";

import CreateMenu from "./Settings/MenuManagement/CreateMenu";
import ModuleSettings from "./Settings/ModuleSettings/ModuleSettings";
import GeneralSettings from "./Settings/GeneralSettings/GeneralSettingsComponent";
import TenantComponent from "./TenantManagement/TenantComponent";
import EditTenant from "./TenantManagement/EditTenant";
import CreateTenant from "./TenantManagement/CreateTenant";

import SmsComponent from "./Connector/SmsComponent/SmsComponent";
import EmailComponent from "./Connector/EmailComponent/EmailComponent";
import WhatsappComponent from "./Connector/WhatsappComponent/WhatsappComponent";
import ConsolidatedView from "./ConsolidatedView/ConsolidatedView";
import ProjectwiseModule from "./ConsolidatedView/ProjectwiseModule";
import PendingTickets from "./ConsolidatedView/ProjectwiseModules/PendingTickets";
import CompletedTickets from "./ConsolidatedView/ProjectwiseModules/CompletedTickets";
import DelayedTasks from "./ConsolidatedView/ProjectwiseModules/DelayedTasks";
import PendingTasks from "./ConsolidatedView/ProjectwiseModules/PendingTasks";
import DelayedTask from "./ConsolidatedView/ModulewiseModule/DelayedTask";
import PendingTicket from "./ConsolidatedView/ModulewiseModule/PendingTicket";
import CompletedTicket from "./ConsolidatedView/ModulewiseModule/CompletedTicket";
import PendingTask from "./ConsolidatedView/ModulewiseModule/PendingTask";
import MenuManagement from "./MenuManagement/ManageMenu";
import TestBankComponent from "./TicketManagement/TaskManagement/components/TestBankComponent";

import { VendorMaster } from "./BillChecking/Masters/VendorMaster";
import PaymentTemplateMaster from "./BillChecking/Masters/PaymentTemplateMaster";
import BillTypeMaster from "./BillChecking/Masters/BillTypeMaster";
import BillCheckingTransaction from "./BillChecking/BillCheckingTransactions/BillCheckingTransaction";
import CreateBillCheckingTransaction from "./BillChecking/BillCheckingTransactions/CreateBillCheckingTransaction";
import EditBillCheckingTransaction from "./BillChecking/BillCheckingTransactions/EditBillCheckingTransaction";
import ViewBillTransaction from "./BillChecking/BillCheckingTransactions/ViewBillTransaction";
import PaymentDetails from "./BillChecking/PaymentDetails/PaymentDetails";
import BillCheckingHistory from "./BillChecking/BillCheckingTransactions/BillCheckingHistory";
import PaymentHistory from "./BillChecking/PaymentDetails/PaymentHistory";
import AssignedPerson from "./BillChecking/BillCheckingTransactions/AssignedPerson";
import AuthorityMapping from "./BillChecking/AuthorityMapping/AuthorityMapping";
import BillPayments from "./BillChecking/BillPayments/BillPayments";
import ViewVendorDetails from "./BillChecking/Masters/ViewVendorDetails";
import ViewPaymentTemplateDetails from "./BillChecking/Masters/ViewPaymentTemplateDetails";
import SourceComponent from "./HRMS/SourceMaster/SourceComponent";
import TestCasesReviewerViewComponent from "./TicketManagement/TaskManagement/components/TestCasesReviewerViewComponent";
import { TestingTypeComponent } from "./Masters/TestingTypeMaster/TestingTypeComponent";
import CreateSourceMaster from "./HRMS/SourceMaster/CreateSourceMaster";
import CreateBillTypeComponent from "./BillChecking/Masters/BillTypeMaster/CreateBillTypeComponent";
import ShiftComponent from "./HRMS/ShiftMaster/ShiftComponent";
import CreateShiftMaster from "./HRMS/ShiftMaster/CreateShiftMaster";
import CreateRoastedShiftMaster from "./HRMS/RoastedMaster/CreateRoastedShiftMaster";

import InsightsTasks from "./Dashboard/InsightsTasks";
import AuthorityMappingViewDetails from "./BillChecking/AuthorityMapping/AuthorityMappingViewDetails";
import SalarySlipComponent from "./HRMS/SalarySlipMaster/SalarySlipComponent";
import InsightsCompletedTask from "./Dashboard/InsightsCompletedTask";
import RoastedComponent from "./HRMS/RoastedMaster/RoastedComponent";
import CreateSpecailDayMaster from "./HRMS/CreateSpecailDayMaster";
import EmployeeMasterComponent from "./HRMS/EmployeeMaster/EmployeeMasterComponent";

import CreateEmployeeComponent from "./HRMS/EmployeeMaster/CreateEmployeeComponent";

import SpecialDayMasterComponent from "./HRMS/SpecailDayMaster/SpecialDayMasterComponent";
import CalenderMaster from "./HRMS/CalenderMaster";
import EditBillTypeComponent from "./BillChecking/Masters/BillTypeMaster/EditBillTypeComponent";
import ViewBillTypeComponent from "./BillChecking/Masters/BillTypeMaster/ViewBillTypeComponent";
import TaskAndTicketTypeMaster from "./Masters/TaskAndTicketTypeMaster/TaskAndTicketTypeMaster";
import ViewTicketComponent from "./TicketManagement/ViewTicketComponent";
import ResetPassword from "../components/Auth/ResetPassword";
import StepAuthentication from "../components/Auth/StepAuthentication";

// Sprint Planning
import SprintCalendar from "./TicketManagement/TaskManagement/Calendar-Graph/SprintCalendar";
import GraphWeekWise from "./TicketManagement/TaskManagement/Calendar-Graph/Custom-Day-Month-Year/GraphWeekWise";

// // // employeeJoining
import InterviewMaster from "./HRMS/employeeJoining/interviewMaster/InterviewMaster";
import CandidateList from "./HRMS/employeeJoining/candidateList/CandidateList";
import BranchMaster from "./HRMS/employeeJoining/branchMaster/BranchMaster";
import SourceMaster from "./HRMS/employeeJoining/sourceMaster/SourceMaster";
import RemarkMaster from "./HRMS/employeeJoining/remarkMaster/RemarkMaster";
import SalaryMaster from "./HRMS/employeeJoining/salaryMaster/SalaryMaster";
import EmployeeJoining from "./HRMS/employeeJoining/candidateList/details/EmployeeJoining";

// // // PO
import GenerateRequisition from "./PO/generateRequisition/GenerateRequisition";
import GeneratePo from "./PO/generatePO/GeneratePo";
import PendingOrder from "./PO/generatePO/details/PendingOrder";
import PoPreview from "./PO/generatePO/details/preview/PoPreview";
import PoHistory from "./PO/history/PoHistory";
import VendorExportReport from "./PO/vendorExportReport/VendorExportReport";
import OrderQuantityReport from "./PO/orderQuantityReport/OrderQuantityReport";
import TestDraftComponent from "../TestCases/TestDraft/TestDraftComponent";
import ReviewedTestDraftComponent from "../TestCases/TestDraft/ReviewedTestDraftComponent";
import ReviewedTestDraftDetails from "../TestCases/TestDraft/ReviewedTestDraftDetails";
import TestCaseReviewComponent from "../TestCases/TestCaseReview/TestCaseReviewComponent";
import TestCaseReviewDetails from "../TestCases/TestCaseReview/TestCaseReviewDetails";
import ReviewCommentMasterComponent from "../TestCases/ReviewCommentMaster/ReviewCommentMasterComponent";
import TestingTypeMasterComponent from "../TestCases/TestingTypeMaster/TestingTypeMasterComponent";
import TestingGroupMasterComponent from "../TestCases/TestingGroupMaster/TestingGroupMasterComponent";
import FunctionMasterComponent from "../TestCases/FunctionMaster/FunctionMasterComponent";
import TestCaseHistoryComponent from "../TestCases/TestDraft/TestCaseHistoryComponent";

class MainIndex extends React.Component {
  constructor(props) {
    super(props);
  }
  //  encryptParameter = (id) => {
  //   const secretKey = "rushikesh"; // Replace with a secure key
  //   const encryptedId = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
  //   return encryptedId;
  // };

  render() {
    // Encryption function (same as mentioned before)
    if (Object.keys(localStorage).length < Object.keys(sessionStorage).length) {
      for (var a in sessionStorage) {
        localStorage.setItem(a, sessionStorage[a]);
      }
    } else {
      for (var a in localStorage) {
        sessionStorage.setItem(a, localStorage[a]);
      }
    }
    return (
      <div className="main px-lg-4 px-md-4">
        <Header />

        <div className="body d-flex py-lg-3 py-md-2">
          <Routes>
            <Route exact path={`/${_base}/Dashboard`} element={<Dashboard />} />
            <Route
              exact
              path={`/${_base}/InsightsTasks`}
              element={<InsightsTasks />}
            />
            <Route
              exact
              path={`/${_base}/InsightsCompletedTask`}
              element={<InsightsCompletedTask />}
            />
            <Route path={`/${_base}/Profile`} element={<Profile />} />
            <Route
              exact
              path={`/${_base}/Notification`}
              element={<NotificationComponent />}
            />
            <Route
              exact
              path={`/${_base}/ApprovedNotification`}
              element={<ApprovedNotificationComponent />}
            />
            <Route path={`/${_base}/Tenant`} element={<TenantComponent />} />
            <Route
              exact
              path={`/${_base}/Tenant/Edit/:id`}
              element={<TenantForm />}
            />
            <Route
              exact
              path={`/${_base}/Customer`}
              element={<CustomerComponent />}
            />
            <Route
              exact
              path={`/${_base}/Customer/Create/`}
              element={<CreateCustomer />}
            />
            {/* <Route path={`/${_base}/Customer/Edit/:id" element={<EditCustomer} /> */}
            <Route
              exact
              path={`/${_base}/Customer/Edit/:id`}
              element={<EditCustomer />}
            />
            <Route path={`/${_base}/User`} element={<UserComponent />} />
            <Route
              exact
              path={`/${_base}/User/Create`}
              element={<CreateUserComponent />}
            />
            <Route
              exact
              path={`/${_base}/User/Edit/:id`}
              element={<EditUserComponent />}
            />
            <Route
              exact
              path={`/${_base}/Country`}
              element={<CountryComponent />}
            />
            <Route
              exact
              path={`/${_base}/TaskAndTicketTypeMaster`}
              element={<TaskAndTicketTypeMaster />}
            />
            <Route path={`/${_base}/State`} element={<StateComponent />} />
            <Route path={`/${_base}/City`} element={<CityComponent />} />
            <Route
              exact
              path={`/${_base}/Designation`}
              element={<DesignationComponent />}
            />
            <Route
              exact
              path={`/${_base}/Department`}
              element={<DepartmentComponent />}
            />
            <Route path={`/${_base}/Role`} element={<RoleComponent />} />
            <Route path={`/${_base}/Status`} element={<StatusComponent />} />
            <Route
              exact
              path={`/${_base}/CustomerType`}
              element={<CustomerTypeComponent />}
            />
            <Route
              exact
              path={`/${_base}/DynamicForm`}
              element={<DynamicFormComponent />}
            />
            <Route
              exact
              path={`/${_base}/DynamicForm/Create`}
              element={<CreateDynamicForm />}
            />
            <Route
              exact
              path={`/${_base}/DynamicForm/Create/:id`}
              element={<CreateDynamicForm />}
            />
            <Route
              exact
              path={`/${_base}/DynamicForm/Edit/:id`}
              element={<EditDynamicForm />}
            />
            <Route
              exact
              path={`/${_base}/QueryType`}
              element={<QueryTypeComponent />}
            />
            <Route
              exact
              path={`/${_base}/QueryGroupMaster`}
              element={<QueryGroupMasterComponent />}
            />
            <Route
              exact
              path={`/${_base}/Template`}
              element={<TemplateComponent />}
            />
            <Route
              exact
              path={`/${_base}/Template/Create`}
              element={<CreateTemplateComponent />}
            />
            <Route
              exact
              path={`/${_base}/Template/Edit/:id`}
              element={<EditTemplateComponent />}
            />
            <Route
              exact
              path={`/${_base}/DepartmentMapping`}
              element={<DepartmentMappingComponent />}
            />
            <Route
              exact
              path={`/${_base}/DepartmentMapping/Create`}
              element={<CreateDepartmentMappingComponent />}
            />
            <Route
              exact
              path={`/${_base}/DepartmentMapping/Edit/:id`}
              element={<EditDepartmentMappingComponent />}
            />
            <Route
              exact
              path={`/${_base}/Project`}
              element={<ProjectComponent />}
            />
            <Route
              exact
              path={`/${_base}/Project/Create`}
              element={<CreateProjectComponent />}
            />
            <Route
              exact
              path={`/${_base}/Project/Edit/:id`}
              element={<EditProjectComponent />}
            />
            <Route path={`/${_base}/Module`} element={<ModuleComponent />} />
            <Route
              exact
              path={`/${_base}/Module/Create`}
              element={<CreateModuleComponent />}
            />
            <Route
              exact
              path={`/${_base}/Module/Edit/:id`}
              element={<EditModuleComponent />}
            />
            <Route
              exact
              path={`/${_base}/SubModule`}
              element={<SubModuleComponent />}
            />
            <Route
              exact
              path={`/${_base}/SubModule/Create`}
              element={<CreateSubModuleComponent />}
            />
            <Route
              exact
              path={`/${_base}/SubModule/Edit/:id`}
              element={<EditSubModuleComponent />}
            />
            <Route
              exact
              path={`/${_base}/UserTaskReport`}
              element={<UserTaskReportComponent />}
            />
            <Route
              exact
              path={`/${_base}/TimelineReport`}
              element={<TimelineReportComponent />}
            />
            <Route
              exact
              path={`/${_base}/ResourcePlanningReport`}
              element={<ResourcePlanningReportComponent />}
            />
            <Route
              exact
              path={`/${_base}/VariantsReport`}
              element={<VariantsReport />}
            />
            <Route
              exact
              path={`/${_base}/Ticket`}
              element={<MyTicketComponent />}
            />
            <Route
              exact
              path={`/${_base}/Ticket/Create`}
              element={<CreateTicketComponent />}
            />
            <Route
              exact
              path={`/${_base}/Ticket/Edit/:id`}
              element={<EditTicketComponent />}
            />
            <Route
              exact
              path={`/${_base}/Ticket/View/:id`}
              element={<ViewTicketComponent />}
            />
            <Route
              exact
              path={`/${_base}/Ticket/Basket/:id`}
              element={<BasketComponent />}
            />
            <Route
              exact
              path={`/${_base}/Ticket/Task/:id`}
              element={<TaskComponent />}
            />
            {/* Sprint */}
            <Route
              exact
              path={`/${_base}/Ticket/Task/:id/sprint-calendar`}
              element={<SprintCalendar />}
            />
            <Route
              exact
              path={`/${_base}/Ticket/Task/:id/sprint-graph/:date`}
              element={<GraphWeekWise />}
            />
            <Route
              exact
              path={`/${_base}/TestCases/:ticketId/:taskId`}
              element={<TestCases />}
            />
            <Route
              exact
              path={`/${_base}/GetAllTestCases/:id`}
              element={<GetAllTestCases />}
            />
            <Route
              exact
              path={`/${_base}/TestBank`}
              element={<TestBankComponent />}
            />
            <Route
              exact
              path={`/${_base}/TestCasesReviewerView/:ticketId/:taskId`}
              element={<TestCasesReviewerViewComponent />}
            />
            <Route
              exact
              path={`/${_base}/TestingType`}
              element={<TestingTypeComponent />}
            />
            <Route
              exact
              path={`/${_base}/TestCaseHistory/:id`}
              element={<TestCaseHistory />}
            />
            <Route
              exact
              path={`/${_base}/TicketHistory/:id`}
              element={<TicketHistory />}
            />
            <Route
              exact
              path={`/${_base}/TestSuite`}
              element={<TestSuiteComponent />}
            />
            <Route
              exact
              path={`/${_base}/CustomerMapping`}
              element={<CustomerMappingComponent />}
            />
            <Route
              exact
              path={`/${_base}/CustomerMapping/Create`}
              element={<CreateCustomerMappingComponent />}
            />
            <Route
              exact
              path={`/${_base}/CustomerMapping/Edit/:id`}
              element={<EditCustomerMappingComponent />}
            />
            <Route path={`/${_base}/Menu/Create`} element={<CreateMenu />} />
            <Route
              exact
              path={`/${_base}/ModuleSetting`}
              element={<ModuleSettings />}
            />
            <Route
              exact
              path={`/${_base}/GeneralSettings`}
              element={<GeneralSettings />}
            />
            {/* Suyash */}
            <Route
              exact
              path={`/${_base}/Connector/Sms`}
              element={<SmsComponent />}
            />
            <Route
              exact
              path={`/${_base}/Connector/Email`}
              element={<EmailComponent />}
            />
            <Route
              exact
              path={`/${_base}/Connector/Whatsapp`}
              element={<WhatsappComponent />}
            />
            {/* <Route path={`/${_base}/Testcase/:module_id/" element={<TestCase}/>
                    <Route path={`/${_base}/Testcase/:module_id/:submodule_id" element={<TestCase}/> */}
            <Route
              exact
              path={`/${_base}/MenuManage/:id`}
              element={<MenuManagement />}
            />
            <Route
              exact
              path={`/${_base}/TenantMaster`}
              element={<TenantComponent />}
            />
            <Route
              exact
              path={`/${_base}/TenantMaster/Create`}
              element={<CreateTenant />}
            />
            <Route
              exact
              path={`/${_base}/TenantMaster/Edit/:id`}
              element={<EditTenant />}
            />
            <Route
              exact
              path={`/${_base}/QueryBuilder`}
              element={<QueryBuilder />}
            />
            <Route
              exact
              path={`/${_base}/ConsolidatedView`}
              element={<ConsolidatedView />}
            />
            <Route
              exact
              path={`/${_base}/PendingTickets/:projectId`}
              element={<PendingTickets />}
            />
            <Route
              exact
              path={`/${_base}/CompletedTickets/:projectId`}
              element={<CompletedTickets />}
            />
            <Route
              exact
              path={`/${_base}/DelayedTasks/:projectId`}
              element={<DelayedTasks />}
            />
            <Route
              exact
              path={`/${_base}/PendingTasks/:projectId`}
              element={<PendingTasks />}
            />
            <Route
              exact
              path={`/${_base}/PendingTask/:projectId/:moduleId`}
              element={<PendingTask />}
            />
            <Route
              exact
              path={`/${_base}/DelayedTask/:projectId/:moduleId`}
              element={<DelayedTask />}
            />
            <Route
              exact
              path={`/${_base}/PendingTicket/:projectId/:moduleId`}
              element={<PendingTicket />}
            />
            <Route
              exact
              path={`/${_base}/CompletedTicket/:projectId/:moduleId`}
              element={<CompletedTicket />}
            />
            <Route
              exact
              path={`/${_base}/ConsolidatedView/ProjectwiseModule/:projectId/:moduleId`}
              element={<ProjectwiseModule />}
            />
            <Route
              exact
              path={`/${_base}/DynamicFormDropdown`}
              element={<DynamicFormDropdownComponent />}
            />
            <Route
              exact
              path={`/${_base}/DynamicFormDropdown/Create`}
              element={<CreateDropdownComponent />}
            />
            <Route
              exact
              path={`/${_base}/DynamicFormDropdown/Edit/:id`}
              element={<EditDropdownComponent />}
            />
            {/* BILL CHECKING */}
            <Route
              exact
              path={`/${_base}/VendorMaster`}
              element={<VendorMaster />}
            />
            <Route
              exact
              path={`/${_base}/PaymentTemplateMaster`}
              element={<PaymentTemplateMaster />}
            />
            <Route
              exact
              path={`/${_base}/BillTypeMaster`}
              element={<BillTypeMaster />}
            />
            <Route
              exact
              path={`/${_base}/CreateBillType`}
              element={<CreateBillTypeComponent />}
            />
            <Route
              exact
              path={`/${_base}/EditBillType/:id`}
              element={<EditBillTypeComponent />}
            />
            <Route
              exact
              path={`/${_base}/ViewBillType/:id`}
              element={<ViewBillTypeComponent />}
            />
            <Route
              exact
              path={`/${_base}/BillCheckingTransaction`}
              element={<BillCheckingTransaction />}
            />
            <Route
              exact
              path={`/${_base}/CreateBillCheckingTransaction`}
              element={<CreateBillCheckingTransaction />}
            />
            <Route
              exact
              path={`/${_base}/EditBillCheckingTransaction/:id`}
              element={<EditBillCheckingTransaction />}
            />
            <Route
              exact
              path={`/${_base}/ViewBillTransaction/:id`}
              element={<ViewBillTransaction />}
            />
            <Route
              exact
              path={`/${_base}/PaymentDetails/:id`}
              element={<PaymentDetails />}
            />
            <Route
              exact
              path={`/${_base}/BillCheckingHistory/:id`}
              element={<BillCheckingHistory />}
            />
            <Route
              exact
              path={`/${_base}/PaymentHistory/:id`}
              element={<PaymentHistory />}
            />
            <Route
              exact
              path={`/${_base}/AssignedPerson/:id`}
              element={<AssignedPerson />}
            />
            <Route
              exact
              path={`/${_base}/AuthorityMapping`}
              element={<AuthorityMapping />}
            />
            <Route
              exact
              path={`/${_base}/AuthorityMappingviewdetails/:id`}
              element={<AuthorityMappingViewDetails />}
            ></Route>
            <Route
              exact
              path={`/${_base}/BillPayments`}
              element={<BillPayments />}
            />
            <Route
              exact
              path={`/${_base}/ViewVendorDetails/:id`}
              element={<ViewVendorDetails />}
            />
            <Route
              exact
              path={`/${_base}/ViewPaymentTemplateDetails/:id`}
              element={<ViewPaymentTemplateDetails />}
            />
            {/* HRMS  */} {/* Asmita */}
            <Route path={`/${_base}/Source`} element={<SourceComponent />} />
            <Route
              exact
              path={`/${_base}/Source/Create`}
              element={<CreateSourceMaster />}
            />
            <Route path={`/${_base}/Shift`} element={<ShiftComponent />} />
            <Route
              exact
              path={`/${_base}/Salary`}
              element={<SalarySlipComponent />}
            />
            <Route
              exact
              path={`/${_base}/Roasted/Create`}
              element={<CreateRoastedShiftMaster />}
            />
            <Route
              exact
              path={`/${_base}/SpecialDay/Create`}
              element={<CreateSpecailDayMaster />}
            />
            <Route
              exact
              path={`/${_base}/SpecialDayMaster`}
              element={<SpecialDayMasterComponent />}
            />
            <Route
              exact
              path={`/${_base}/rotationalShiftMaster`}
              element={<RoastedComponent />}
            />
            <Route
              exact
              path={`/${_base}/Shift/Create`}
              element={<CreateShiftMaster />}
            />
            <Route
              exact
              path={`/${_base}/EmployeeMaster`}
              element={<EmployeeMasterComponent />}
            />
            <Route
              exact
              path={`/${_base}/Employee/Create`}
              element={<CreateEmployeeComponent />}
            />
            <Route
              exact
              path={`/${_base}/CalendarMaster`}
              element={<CalenderMaster />}
            />
            {/* HRMS>> Employee Joining routes */}
            <Route
              exact
              path={`/${_base}/InterviewMaster`}
              element={<InterviewMaster />}
            />
            <Route
              exact
              path={`/${_base}/CandidateList`}
              element={<CandidateList />}
            />
            <Route
              exact
              path={`/${_base}/CandidateList/:id`}
              element={<EmployeeJoining />}
            />
            <Route
              exact
              path={`/${_base}/BranchMaster`}
              element={<BranchMaster />}
            />
            <Route
              exact
              path={`/${_base}/SourceMaster`}
              element={<SourceMaster />}
            />
            <Route
              exact
              path={`/${_base}/RemarkMaster`}
              element={<RemarkMaster />}
            />
            <Route
              exact
              path={`/${_base}/SalaryMaster`}
              element={<SalaryMaster />}
            />
            {/* <Route
              exact
              path={`/${_base}/rotationalShiftMaster`}
              element={<RoastedComponent />}
            />
            <Route
              exact
              path={`/${_base}/Shift/Create`}
              element={<CreateShiftMaster />}
            />
            <Route
              exact
              path={`/${_base}/EmployeeMaster`}
              element={<EmployeeMasterComponent />}
            />
            <Route
              exact
              path={`/${_base}/Employee/Create`}
              element={<CreateEmployeeComponent />}
            />
            <Route
              exact
              path={`/${_base}/CalendarMaster`}
              element={<CalenderMaster />}
            />

            {/* Employee Joining routes */}
            <Route
              exact
              path={`/${_base}/InterviewMaster`}
              element={<InterviewMaster />}
            />
            <Route
              exact
              path={`/${_base}/CandidateList`}
              element={<CandidateList />}
            />
            <Route
              exact
              path={`/${_base}/BranchMaster`}
              element={<BranchMaster />}
            />
            <Route
              exact
              path={`/${_base}/SourceMaster`}
              element={<SourceMaster />}
            />
            <Route
              exact
              path={`/${_base}/RemarkMaster`}
              element={<RemarkMaster />}
            />
            <Route
              exact
              path={`/${_base}/SalaryMaster`}
              element={<SalaryMaster />}
            />
            {/* PO */}
            <Route
              exact
              path={`/${_base}/POGenerateRequisition`}
              element={<GenerateRequisition />}
            />
            <Route
              exact
              path={`/${_base}/GeneratePO`}
              element={<GeneratePo />}
            />
            <Route
              exact
              path={`/${_base}/GeneratePO/po`}
              element={<PendingOrder />}
            />
            <Route
              exact
              path={`/${_base}/GeneratePO/po/preview`}
              element={<PoPreview />}
            />
            <Route exact path={`/${_base}/POHistory`} element={<PoHistory />} />
            <Route
              exact
              path={`/${_base}/POVendorExportReport`}
              element={<VendorExportReport />}
            />
            <Route
              exact
              path={`/${_base}/POOrderQuanitityReport`}
              element={<OrderQuantityReport />}
            />
            <Route
              exact
              path={`/${_base}/TestDraft`}
              element={<TestDraftComponent />}
            />
            <Route
              exact
              path={`/${_base}/ReviewedTestDraftComponent`}
              element={<ReviewedTestDraftComponent />}
            />
            <Route
              exact
              path={`/${_base}/ReviewedTestDraftDetails`}
              element={<ReviewedTestDraftDetails />}
            />
            <Route
              exact
              path={`/${_base}/TestCaseReview`}
              element={<TestCaseReviewComponent />}
            />
            <Route
              exact
              path={`/${_base}/TestCaseReviewDetails`}
              element={<TestCaseReviewDetails />}
            />
            <Route
              exact
              path={`/${_base}/ReviewCommentMaster`}
              element={<ReviewCommentMasterComponent />}
            />
            <Route
              exact
              path={`/${_base}/TestingTypeMaster`}
              element={<TestingTypeMasterComponent />}
            />
            <Route
              exact
              path={`/${_base}/TestingGroupMaster`}
              element={<TestingGroupMasterComponent />}
            />
            <Route
              exact
              path={`/${_base}/FunctionMaster`}
              element={<FunctionMasterComponent />}
            />
            <Route
              exact
              path={`/${_base}/TestCaseHistoryComponent`}
              element={<TestCaseHistoryComponent />}
            />
          </Routes>
        </div>
      </div>
    );
  }
}

export default MainIndex;
