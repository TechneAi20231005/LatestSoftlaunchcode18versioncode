import { lazy } from 'react';

export const guestRoutes = [
  {
    path: '/sign-in',
    name: 'SignIn',
    exact: true,
    component: lazy(() => import('../components/Auth/SignIn'))
  },
  {
    path: '/forget-password',
    name: 'ForgetPassword',
    exact: true,
    component: lazy(() => import('../components/Auth/ForgetPassword'))
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    exact: true,
    component: lazy(() => import('../components/Auth/ResetPassword'))
  },
  {
    path: '/otp',
    name: 'ResetPassword2FA',
    exact: true,
    component: lazy(() => import('../components/Auth/StepAuthentication'))
  },

  {
    redirectRoute: true,
    name: 'SignIn',
    path: '/sign-in'
  }
];

export const userRoutes = [
  {
    path: '/Dashboard',
    name: 'Dashboard',
    exact: true,
    component: lazy(() => import('../screens/Dashboard/Dashboard'))
  },
  {
    path: '/InsightsTasks',
    name: 'InsightsTasks',
    exact: true,
    component: lazy(() => import('../screens/Dashboard/InsightsTasks'))
  },
  {
    path: '/InsightsTasks',
    name: 'InsightsTasks',
    exact: true,
    component: lazy(() => import('../screens/Dashboard/InsightsTasks'))
  },
  {
    path: '/InsightsCompletedTask',
    name: 'InsightsCompletedTask',
    exact: true,
    component: lazy(() => import('../screens/Dashboard/InsightsCompletedTask'))
  },
  {
    path: '/Profile',
    name: 'Profile',
    exact: true,
    component: lazy(() => import('../screens/Dashboard/Profile'))
  },
  {
    path: '/Notification',
    name: 'Notification',
    exact: true,
    component: lazy(() =>
      import('../screens/Notification/NotificationComponent')
    )
  },
  {
    path: '/Notification',
    name: 'Notification',
    exact: true,
    component: lazy(() =>
      import('../screens/Notification/NotificationComponent')
    )
  },
  {
    path: '/ApprovedNotification',
    name: 'ApprovedNotification',
    exact: true,
    component: lazy(() =>
      import('../screens/Notification/ApprovedNotificationComponent')
    )
  },
  {
    path: '/Tenant',
    name: 'Tenant',
    exact: true,
    component: lazy(() => import('../screens/TenantManagement/TenantComponent'))
  },

  // // // master routes start ⬇️
  {
    path: '/Customer',
    name: 'Customer',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/CustomerMaster/CustomerComponent')
    )
  },
  {
    path: '/Customer/Create',
    name: 'CustomerCreate',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/CustomerMaster/CreateCustomer')
    )
  },
  {
    path: '/Customer/Edit/:id',
    name: 'CustomerCreate',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/CustomerMaster/EditCustomer')
    )
  },
  {
    path: '/User',
    name: 'User',
    exact: true,
    component: lazy(() => import('../screens/Masters/UserMaster/UserComponent'))
  },
  {
    path: '/User/Create',
    name: 'UserCreate',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/UserMaster/CreateUserComponent')
    )
  },
  {
    path: '/User/Edit/:id',
    name: 'UserEdit',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/UserMaster/EditUserComponent')
    )
  },
  {
    path: '/Country',
    name: 'Country',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/CountryMaster/CountryComponent')
    )
  },
  {
    path: '/State',
    name: 'State',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/StateMaster/StateComponent')
    )
  },
  {
    path: '/City',
    name: 'City',
    exact: true,
    component: lazy(() => import('../screens/Masters/CityMaster/CityComponent'))
  },
  {
    path: '/TaskAndTicketTypeMaster',
    name: 'TaskAndTicketTypeMaster',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/Masters/TaskAndTicketTypeMaster/TaskAndTicketTypeMaster'
      )
    )
  },
  {
    path: '/Designation',
    name: 'Designation',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/DesignationMaster/DesignationComponent')
    )
  },
  {
    path: '/Department',
    name: 'Department',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/DepartmentMaster/DepartmentComponent')
    )
  },
  {
    path: '/Role',
    name: 'Role',
    exact: true,
    component: lazy(() => import('../screens/Masters/RoleMaster/RoleComponent'))
  },
  {
    path: '/Status',
    name: 'Status',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/StatusMaster/StatusComponent')
    )
  },
  {
    path: '/CustomerType',
    name: 'CustomerType',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/CustomerTypeMaster/CustomerTypeComponent')
    )
  },
  {
    path: '/DynamicForm',
    name: 'DynamicForm',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/DynamicFormMaster/DynamicFormComponent')
    )
  },
  {
    path: '/DynamicForm/Create',
    name: 'DynamicFormCreate',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/DynamicFormMaster/CreateDynamicForm')
    )
  },
  {
    path: '/DynamicForm/Edit/:id',
    name: 'DynamicFormEdit',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/DynamicFormMaster/EditDynamicForm')
    )
  },
  {
    path: '/QueryType',
    name: 'QueryType',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/QueryTypeMaster/QueryTypeComponent')
    )
  },
  {
    path: '/QueryGroupMaster',
    name: 'QueryGroupMaster',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/MainQueryMaster/QueryGroupMasterComponent')
    )
  },
  {
    path: '/Template',
    name: 'Template',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/TemplateMaster/TemplateComponent')
    )
  },
  {
    path: '/Template/Create',
    name: 'TemplateCreate',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/TemplateMaster/CreateTemplateComponent')
    )
  },
  {
    path: '/Template/Edit/:id',
    name: 'TemplateEdit',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/TemplateMaster/EditTemplateComponent')
    )
  },
  {
    path: '/DepartmentMapping',
    name: 'DepartmentMapping',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/DepartmentMapping/DepartmentMappingComponent')
    )
  },
  {
    path: '/DepartmentMapping/Create',
    name: 'DepartmentMappingCreate',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/Masters/DepartmentMapping/CreateDepartmentMappingComponent'
      )
    )
  },
  {
    path: '/DepartmentMapping/Edit/:id',
    name: 'DepartmentMappingEdit',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/Masters/DepartmentMapping/EditDepartmentMappingComponent'
      )
    )
  },
  {
    path: '/TestingType',
    name: 'TestingType',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/TestingTypeMaster/TestingTypeComponent')
    )
  },
  {
    path: '/CustomerMapping',
    name: 'CustomerMapping',
    exact: true,
    component: lazy(() =>
      import('../screens/Settings/CustomerMapping/CustomerMappingComponent')
    )
  },
  {
    path: '/CustomerMapping/Create',
    name: 'CustomerMappingCreate',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/Settings/CustomerMapping/CreateCustomerMappingComponent'
      )
    )
  },
  {
    path: '/CustomerMapping/Edit/:id',
    name: 'CustomerMappingCreate',
    exact: true,
    component: lazy(() =>
      import('../screens/Settings/CustomerMapping/EditCustomerMappingComponent')
    )
  },
  {
    path: '/DynamicFormDropdown',
    name: 'DynamicFormDropdown',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/Masters/DynamicFormDropdown/DynamicFormDropdownComponent'
      )
    )
  },
  {
    path: '/DynamicFormDropdown/Create',
    name: 'DynamicFormDropdownCreate',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/DynamicFormDropdown/CreateDropdownComponent')
    )
  },
  {
    path: '/DynamicFormDropdown/Edit/:id',
    name: 'DynamicFormDropdownEdit',
    exact: true,
    component: lazy(() =>
      import('../screens/Masters/DynamicFormDropdown/EditDropdownComponent')
    )
  },

  // // // master routes end ⬆️

  // // // ticket routes start ⬇️
  {
    path: '/Ticket',
    name: 'Ticket',
    exact: true,
    component: lazy(() =>
      import('../screens/TicketManagement/MyTicketComponent')
    )
  },
  {
    path: '/Ticket/Create',
    name: 'TicketCreate',
    exact: true,
    component: lazy(() =>
      import('../screens/TicketManagement/CreateTicketComponent')
    )
  },
  {
    path: '/Ticket/Edit/:id',
    name: 'TicketEdit',
    exact: true,
    component: lazy(() =>
      import('../screens/TicketManagement/EditTicketComponent')
    )
  },
  {
    path: '/Ticket/View/:id',
    name: 'TicketView',
    exact: true,
    component: lazy(() =>
      import('../screens/TicketManagement/ViewTicketComponent')
    )
  },
  {
    path: '/Ticket/Basket/:id',
    name: 'TicketBasket',
    exact: true,
    component: lazy(() =>
      import('../screens/TicketManagement/BasketManagement/BasketComponent')
    )
  },
  {
    path: '/Ticket/Task/:id',
    name: 'TicketTask',
    exact: true,
    component: lazy(() =>
      import('../screens/TicketManagement/TaskManagement/TaskComponent')
    )
  },
  {
    path: '/Ticket/Task/:id/sprint-calendar',
    name: 'TicketTaskSprintCalendar',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/TicketManagement/TaskManagement/Calendar-Graph/SprintCalendar'
      )
    )
  },
  {
    path: '/Ticket/Task/:id/sprint-graph/:date',
    name: 'TicketTaskSprintGraph',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/TicketManagement/TaskManagement/Calendar-Graph/Custom-Day-Month-Year/GraphWeekWise'
      )
    )
  },
  {
    path: '/TestCases/:ticketId/:taskId',
    name: 'TicketTestCases',
    exact: true,
    component: lazy(() =>
      import('../screens/TicketManagement/TaskManagement/components/TestCases')
    )
  },
  {
    path: '/GetAllTestCases/:id',
    name: 'GetAllTestCases',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/TicketManagement/TaskManagement/components/GetAllTestCases'
      )
    )
  },
  {
    path: '/TestBank',
    name: 'TestBank',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/TicketManagement/TaskManagement/components/TestBankComponent'
      )
    )
  },
  {
    path: '/TestCasesReviewerView/:ticketId/:taskId',
    name: 'TestCasesReviewerView',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/TicketManagement/TaskManagement/components/TestCasesReviewerViewComponent'
      )
    )
  },
  {
    path: '/TestCaseHistory/:id',
    name: 'TestCaseHistory',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/TicketManagement/TaskManagement/components/TestCaseHistory'
      )
    )
  },
  {
    path: '/TicketHistory/:id',
    name: 'TicketHistory',
    exact: true,
    component: lazy(() =>
      import('../screens/TicketManagement/TicketHistory/TicketHistory')
    )
  },
  {
    path: '/TestSuite',
    name: 'TestSuite',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/TicketManagement/TaskManagement/components/TestSuiteComponent'
      )
    )
  },

  // // // ticket routes end ⬆️

  // // // project mgmt routes start ⬇️
  {
    path: '/Project',
    name: 'Project',
    exact: true,
    component: lazy(() =>
      import('../screens/ProjectManagement/ProjectMaster/ProjectComponent')
    )
  },
  {
    path: '/Project/Create',
    name: 'ProjectCreate',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/ProjectManagement/ProjectMaster/CreateProjectComponent'
      )
    )
  },
  {
    path: '/Project/Edit/:id',
    name: 'ProjectEdit',
    exact: true,
    component: lazy(() =>
      import('../screens/ProjectManagement/ProjectMaster/EditProjectComponent')
    )
  },
  {
    path: '/Module',
    name: 'Module',
    exact: true,
    component: lazy(() =>
      import('../screens/ProjectManagement/ModuleMaster/ModuleComponent')
    )
  },
  {
    path: '/Module/Create',
    name: 'ModuleCreate',
    exact: true,
    component: lazy(() =>
      import('../screens/ProjectManagement/ModuleMaster/CreateModuleComponent')
    )
  },
  {
    path: '/Module/Edit/:id',
    name: 'ModuleEdit',
    exact: true,
    component: lazy(() =>
      import('../screens/ProjectManagement/ModuleMaster/EditModuleComponent')
    )
  },
  {
    path: '/SubModule',
    name: 'SubModule',
    exact: true,
    component: lazy(() =>
      import('../screens/ProjectManagement/SubModuleMaster/SubModuleComponent')
    )
  },
  {
    path: '/SubModule/Create',
    name: 'SubModuleCreate',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/ProjectManagement/SubModuleMaster/CreateSubModuleComponent'
      )
    )
  },
  {
    path: '/SubModule/Edit/:id',
    name: 'SubModuleEdit',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/ProjectManagement/SubModuleMaster/EditSubModuleComponent'
      )
    )
  },
  {
    path: '/ConsolidatedView',
    name: 'ConsolidatedView',
    exact: true,
    component: lazy(() =>
      import('../screens/ConsolidatedView/ConsolidatedView')
    )
  },
  {
    path: '/PendingTickets/:projectId',
    name: 'PendingTickets',
    exact: true,
    component: lazy(() =>
      import('../screens/ConsolidatedView/ProjectwiseModules/PendingTickets')
    )
  },
  {
    path: '/CompletedTickets/:projectId',
    name: 'CompletedTickets',
    exact: true,
    component: lazy(() =>
      import('../screens/ConsolidatedView/ProjectwiseModules/CompletedTickets')
    )
  },
  {
    path: '/DelayedTasks/:projectId',
    name: 'DelayedTasks',
    exact: true,
    component: lazy(() =>
      import('../screens/ConsolidatedView/ProjectwiseModules/DelayedTasks')
    )
  },
  {
    path: '/PendingTasks/:projectId',
    name: 'PendingTasks',
    exact: true,
    component: lazy(() =>
      import('../screens/ConsolidatedView/ProjectwiseModules/PendingTasks')
    )
  },
  {
    path: '/PendingTask/:projectId/:moduleId',
    name: 'PendingTask',
    exact: true,
    component: lazy(() =>
      import('../screens/ConsolidatedView/ModulewiseModule/PendingTask')
    )
  },
  {
    path: '/DelayedTask/:projectId/:moduleId',
    name: 'DelayedTask',
    exact: true,
    component: lazy(() =>
      import('../screens/ConsolidatedView/ModulewiseModule/DelayedTask')
    )
  },
  {
    path: '/PendingTicket/:projectId/:moduleId',
    name: 'PendingTicket',
    exact: true,
    component: lazy(() =>
      import('../screens/ConsolidatedView/ModulewiseModule/PendingTicket')
    )
  },
  {
    path: '/CompletedTicket/:projectId/:moduleId',
    name: 'CompletedTicket',
    exact: true,
    component: lazy(() =>
      import('../screens/ConsolidatedView/ModulewiseModule/CompletedTicket')
    )
  },
  {
    path: '/ConsolidatedView/ProjectwiseModule/:projectId/:moduleId',
    name: 'ConsolidatedViewProjectwiseModule',
    exact: true,
    component: lazy(() =>
      import('../screens/ConsolidatedView/ProjectwiseModule')
    )
  },
  // // // project mgmt routes end ⬆️

  // // // reports routes start ⬇️
  {
    path: '/UserTaskReport',
    name: 'UserTaskReport',
    exact: true,
    component: lazy(() => import('../screens/Reports/UserTaskReportComponent'))
  },
  {
    path: '/TimelineReport',
    name: 'TimelineReport',
    exact: true,
    component: lazy(() => import('../screens/Reports/TimelineReportComponent'))
  },
  {
    path: '/ResourcePlanningReport',
    name: 'ResourcePlanningReport',
    exact: true,
    component: lazy(() =>
      import('../screens/Reports/ResourcePlanningReportComponent')
    )
  },
  {
    path: '/VariantsReport',
    name: 'VariantsReport',
    exact: true,
    component: lazy(() => import('../screens/Reports/VariantsReport'))
  },
  // // // reports routes end ⬆️

  // // // settings routes end ⬇️
  {
    path: '/ModuleSetting',
    name: 'ModuleSetting',
    exact: true,
    component: lazy(() =>
      import('../screens/Settings/ModuleSettings/ModuleSettings')
    )
  },
  {
    path: '/GeneralSettings',
    name: 'GeneralSettings',
    exact: true,
    component: lazy(() =>
      import('../screens/Settings/GeneralSettings/GeneralSettingsComponent')
    )
  },
  // // // settings routes start ⬆️

  // // // connector routes start ⬇️
  {
    path: '/Connector/Sms',
    name: 'ConnectorSms',
    exact: true,
    component: lazy(() =>
      import('../screens/Connector/SmsComponent/SmsComponent')
    )
  },
  {
    path: '/Connector/Email',
    name: 'ConnectorEmail',
    exact: true,
    component: lazy(() =>
      import('../screens/Connector/EmailComponent/EmailComponent')
    )
  },
  {
    path: '/Connector/Whatsapp',
    name: 'ConnectorWhatsapp',
    exact: true,
    component: lazy(() =>
      import('../screens/Connector/WhatsappComponent/WhatsappComponent')
    )
  },
  // // // connector routes end ⬆️

  // // // tenant master routes start ⬇️
  {
    path: '/TenantMaster',
    name: 'TenantMaster',
    exact: true,
    component: lazy(() => import('../screens/TenantManagement/TenantComponent'))
  },
  {
    path: '/TenantMaster/Create',
    name: 'TenantMasterCreate',
    exact: true,
    component: lazy(() => import('../screens/TenantManagement/CreateTenant'))
  },
  {
    path: '/TenantMaster/Edit/:id',
    name: 'TenantMasterEdit',
    exact: true,
    component: lazy(() => import('../screens/TenantManagement/EditTenant'))
  },
  // // // tenant master routes end ⬆️

  // // // bill checking routes start ⬇️
  {
    path: '/VendorMaster',
    name: 'VendorMaster',
    exact: true,
    component: lazy(() =>
      import('../screens/BillChecking/Masters/VendorMaster')
    )
  },
  {
    path: '/PaymentTemplateMaster',
    name: 'PaymentTemplateMaster',
    exact: true,
    component: lazy(() =>
      import('../screens/BillChecking/Masters/PaymentTemplateMaster')
    )
  },
  {
    path: '/BillTypeMaster',
    name: 'BillTypeMaster',
    exact: true,
    component: lazy(() =>
      import('../screens/BillChecking/Masters/BillTypeMaster')
    )
  },
  {
    path: '/CreateBillType',
    name: 'CreateBillType',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/BillChecking/Masters/BillTypeMaster/CreateBillTypeComponent'
      )
    )
  },
  {
    path: '/EditBillType/:id',
    name: 'EditBillType',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/BillChecking/Masters/BillTypeMaster/EditBillTypeComponent'
      )
    )
  },
  {
    path: '/ViewBillType/:id',
    name: 'ViewBillType',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/BillChecking/Masters/BillTypeMaster/ViewBillTypeComponent'
      )
    )
  },
  {
    path: '/BillCheckingTransaction',
    name: 'BillCheckingTransaction',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/BillChecking/BillCheckingTransactions/BillCheckingTransaction'
      )
    )
  },
  {
    path: '/CreateBillCheckingTransaction',
    name: 'CreateBillCheckingTransaction',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/BillChecking/BillCheckingTransactions/CreateBillCheckingTransaction'
      )
    )
  },
  {
    path: '/EditBillCheckingTransaction/:id',
    name: 'EditBillCheckingTransaction',
    exact: true,
    component: lazy(() =>
      import(
        '../screens/BillChecking/BillCheckingTransactions/EditBillCheckingTransaction'
      )
    )
  },
  // // // bill checking routes end ⬆️

  // // // test case routes start ⬇️

  // // // test case routes end ⬆️

  {
    redirectRoute: true,
    name: 'Dashboard',
    path: '/Dashboard'
  }
];
