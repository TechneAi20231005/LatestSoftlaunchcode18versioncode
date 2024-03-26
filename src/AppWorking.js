import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Login from "./components/AuthComponent/Login";
import Header from "./components/LayoutComponent/Header";
import Sidebar from "./components/LayoutComponent/Sidebar";
import * as Component from "./Declaration";
import { _base } from "./settings/constants";

const App = () => {
  const [token, setToken] = useState(null);

  function checkAuth() {
    var check = sessionStorage.getItem("token");
    if (check) {
      setToken(check);
    } else {
      setToken(null);
    }
  }
  useEffect(() => {
    checkAuth();
  }, []);

  if (!token) {
    return (
      <>
        <Router>
          <Route path={`/${_base}`} element={Login} />
          <Route path={`/${_base}/fp`} element={Component.ForgetPassword} />
          <Route path={`/${_base}/otp`} element={Component.Otp} />
          <Route
            path={`/${_base}/reset-password`}
            element={Component.ResetPassword}
          />
        </Router>
      </>
    );
  } else {
    return (
      <>
        <Router>
          {/* <Route path="/" element={ Login } /> */}
          <Route path={`/${_base}/fp`} element={Component.ForgetPassword} />
          <Route path={`/${_base}/otp`} element={Component.Otp} />
          <Route
            path={`/${_base}/reset-password`}
            element={Component.ResetPassword}
          />
        </Router>
        <Router>
          <div id="mytask-layout" className="theme-indigo">
            <Sidebar />
            <div className="main px-lg-4 px-md-4">
              <Header />
              <Switch>
                <Route index path="/" element={Component.Dashboard} />
                <Route
                  path={`/${_base}/Dashboard`}
                  element={Component.Dashboard}
                />

                <Route
                  path={`/${_base}/ViewNotification`}
                  element={Component.ViewNotification}
                />

                <Route
                  path={`/${_base}/Tenant`}
                  element={Component.TenantComponent}
                />
                <Route
                  path={`/${_base}/Tenant/Create`}
                  element={Component.CreateTenant}
                />
                <Route
                  path={`/${_base}/Tenant/Edit/:id`}
                  element={Component.EditTenant}
                />

                <Route
                  path={`/${_base}/Customer`}
                  element={Component.CustomerComponent}
                />
                <Route
                  path={`/${_base}/Customer/Create`}
                  element={Component.CreateCustomer}
                />
                <Route
                  path={`/${_base}/Customer/Edit/:id`}
                  element={Component.EditCustomer}
                />

                <Route
                  path={`/${_base}/User`}
                  element={Component.UserComponent}
                />
                <Route
                  path={`/${_base}/User/Create`}
                  element={Component.CreateUser}
                />
                <Route
                  path={`/${_base}/User/Edit/:id`}
                  element={Component.EditUser}
                />

                <Route
                  path={`/${_base}/Country`}
                  element={Component.CountryComponent}
                />
                <Route
                  path={`/${_base}/Country/Create`}
                  element={Component.CreateCountry}
                />
                <Route
                  path={`/${_base}/Country/Edit/:id`}
                  element={Component.EditCountry}
                />

                <Route
                  path={`/${_base}/State`}
                  element={Component.StateComponent}
                />
                <Route
                  path={`/${_base}/State/Create`}
                  element={Component.CreateState}
                />
                <Route
                  path={`/${_base}/State/Edit/:id`}
                  element={Component.EditState}
                />

                <Route
                  path={`/${_base}/City`}
                  element={Component.CityComponent}
                />
                <Route
                  path={`/${_base}/City/Create`}
                  element={Component.CreateCity}
                />
                <Route
                  path={`/${_base}/City/Edit/:id`}
                  element={Component.EditCity}
                />

                <Route
                  path={`/${_base}/Role`}
                  element={Component.RoleComponent}
                />
                <Route
                  path={`/${_base}/Role/Create`}
                  element={Component.CreateRole}
                />
                <Route
                  path={`/${_base}/Role/Edit/:id`}
                  element={Component.EditRole}
                />

                <Route
                  path={`/${_base}/Department`}
                  element={Component.DepartmentComponent}
                />
                <Route
                  path={`/${_base}/Department/Create`}
                  element={Component.CreateDepartment}
                />
                <Route
                  path={`/${_base}/Department/Edit/:id`}
                  element={Component.EditDepartment}
                />

                <Route
                  path={`/${_base}/Designation`}
                  element={Component.DesignationComponent}
                />
                <Route
                  path={`/${_base}/Designation/Create`}
                  element={Component.CreateDesignation}
                />
                <Route
                  path={`/${_base}/Designation/Edit/:id`}
                  element={Component.EditDesignation}
                />

                <Route
                  path={`/${_base}/Role`}
                  element={Component.RoleComponent}
                />
                <Route
                  path={`/${_base}/Role/Create`}
                  element={Component.CreateRole}
                />
                <Route
                  path={`/${_base}/Role/Edit/:id`}
                  element={Component.EditRole}
                />

                <Route
                  path={`/${_base}/Status`}
                  element={Component.StatusComponent}
                />
                <Route
                  path={`/${_base}/Status/Create`}
                  element={Component.CreateStatus}
                />
                <Route
                  path={`/${_base}/Status/Edit/:id`}
                  element={Component.EditStatus}
                />

                <Route
                  path={`/${_base}/CustomerType`}
                  element={Component.CustomerTypeComponent}
                />
                <Route
                  path={`/${_base}/CustomerType/Create`}
                  element={Component.CreateCustomerType}
                />
                <Route
                  path={`/${_base}/CustomerType/Edit/:id`}
                  element={Component.EditCustomerType}
                />

                <Route
                  path={`/${_base}/QueryType`}
                  element={Component.QueryTypeComponent}
                />
                <Route
                  path={`/${_base}/QueryType/Create`}
                  element={Component.CreateQueryType}
                />
                <Route
                  path={`/${_base}/QueryType/Edit/:id`}
                  element={Component.EditQueryType}
                />

                <Route
                  path={`/${_base}/DynamicForm`}
                  element={Component.DynamicFormComponent}
                />
                <Route
                  path={`/${_base}/DynamicForm/Create`}
                  element={Component.CreateDynamicForm}
                />

                <Route
                  path={`/${_base}/Template`}
                  element={Component.TemplateComponent}
                />
                <Route
                  path={`/${_base}/Template/Create`}
                  element={Component.CreateTemplate}
                />
                <Route
                  path={`/${_base}/Template/Edit/:id`}
                  element={Component.EditTemplate}
                />
                <Route
                  path={`/${_base}/Template/View/:id`}
                  element={Component.ViewTemplate}
                />

                <Route
                  path={`/${_base}/Project`}
                  element={Component.ProjectComponent}
                />
                <Route
                  path={`/${_base}/Project/Create`}
                  element={Component.CreateProject}
                />
                <Route
                  path={`/${_base}/Project/Edit/:id`}
                  element={Component.EditProject}
                />

                <Route
                  path={`/${_base}/Module`}
                  element={Component.ModuleComponent}
                />
                <Route
                  path={`/${_base}/Module/Create`}
                  element={Component.CreateModule}
                />
                <Route
                  path={`/${_base}/Module/Edit/:id`}
                  element={Component.EditModule}
                />

                <Route
                  path={`/${_base}/SubModule`}
                  element={Component.SubModuleComponent}
                />
                <Route
                  path={`/${_base}/SubModule/Create`}
                  element={Component.CreateSubModule}
                />
                <Route
                  path={`/${_base}/SubModule/Edit/:id`}
                  element={Component.EditSubModule}
                />

                <Route
                  path={`/${_base}/Ticket`}
                  element={Component.TicketComponent}
                />
                <Route
                  path={`/${_base}/Ticket/Create`}
                  element={Component.CreateTicket}
                />
                <Route
                  path={`/${_base}/Ticket/Edit/:id`}
                  element={Component.EditTicket}
                />
                <Route
                  path={`/${_base}/Ticket/View/:id`}
                  element={Component.ViewTicket}
                />
                <Route
                  path={`/${_base}/Ticket/Basket/:id`}
                  element={Component.BasketComponent}
                />
                <Route
                  path={`/${_base}/Ticket/Task/:id`}
                  element={Component.TaskComponent}
                />

                <Route
                  path={`/${_base}/Report/UserTaskReport`}
                  element={Component.UserTaskReport}
                />
                <Route
                  path={`/${_base}/Report/TicketTimelineReport`}
                  element={Component.TicketTimelineReport}
                />
                <Route
                  path={`/${_base}/Report/ResourcePlanningReport`}
                  element={Component.ResourcePlanningReport}
                />

                <Route
                  path={`/${_base}/Connector/Sms`}
                  element={Component.SmsComponent}
                />
                <Route
                  path={`/${_base}/Connector/Email`}
                  element={Component.EmailComponent}
                />
                <Route
                  path={`/${_base}/Connector/Whatsapp`}
                  element={Component.WhatsappComponent}
                />

                <Route
                  path={`/${_base}/Testcase/:module_id/`}
                  element={Component.TestCase}
                />
                <Route
                  path={`/${_base}/Testcase/:module_id/:submodule_id`}
                  element={Component.TestCase}
                />

                <Route
                  path={`/${_base}/Setting/CustomerMapping`}
                  element={Component.CustomerMappingComponent}
                />
                <Route
                  path={`/${_base}/Setting/CustomerMapping/Create`}
                  element={Component.CreateCustomerMapping}
                />
                {/* <Route path={`/${_base}/CustomerMapping/Edit/:id`} element={Component.EditCustomerMapping}  /> */}
              </Switch>
            </div>
          </div>
        </Router>
      </>
    );
  }
};
export default App;
