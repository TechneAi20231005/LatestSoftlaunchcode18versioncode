import React, { useState, useEffect } from "react";
import { Modal, Nav, Tab } from "react-bootstrap";
import CurrentClientProject from "./CurrentClientProject";
import PageHeader from "../../components/Common/PageHeader";
// import { ProjectCardData } from "../../components/Data/AppData";
// import ProjectService from "../../../services/ProjectManagementService/ProjectService";
import ConsolidatedService from "../../services/ProjectManagementService/ConsolidatedService";
import { Spinner } from "react-bootstrap";

import ManageMenuService from "../../services/MenuManagementService/ManageMenuService";
import { useDispatch, useSelector } from "react-redux";
import { consolidatedData } from "./ConsolidatedAction";
import { getRoles } from "../Dashboard/DashboardAction";
import ConsolidatedSlice from "./ConsolidatedSlice";

function ConsolidatedView() {
  const dispatch = useDispatch();
  const consolatedData = useSelector(
    (ConsolidatedSlice) => ConsolidatedSlice.consolidatedData.consolidatedData
  );
  console.log("consolatedData", consolatedData);
  const RoleMasterData = useSelector(
    (RoleMasterSlice) => RoleMasterSlice.rolemaster.getRoleData
  );
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 34)
  );
  console.log("checkRole", checkRole);
  const roleId = sessionStorage.getItem("role_id");
  // const [checkRole, setCheckRole] = useState(null);
  const [projects, setProjects] = useState(null);
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const loadData = async () => {
    dispatch(consolidatedData());
    dispatch(getRoles());

    // setShowLoaderModal(null);
    // setShowLoaderModal(true);
    // new ConsolidatedService().getConsolidatedView().then((res) => {
    //   if (res.status === 200) {
    //     setShowLoaderModal(false);
    //     if (res.data.status === 1) {
    //       setProjects(null);
    //       setProjects(res.data.data);
    //     }
    //   }
    // });

    // await new ManageMenuService().getRole(roleId).then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       const getRoleId = sessionStorage.getItem("role_id");
    //       setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
    //     }
    //   }
    // });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);
  return (
    <div className="container-xxl">
      <Tab.Container defaultActiveKey="All">
        <PageHeader headerTitle="Projects" />

        <div className="row align-items-center mt-5">
          <div className="col-lg-12 col-md-12 flex-column mb-2">
            <Tab.Content>
              <Tab.Pane eventKey="All">
                {/* <div className="d-flex"> */}
                <div className="row  ml-2 mr-2">
                  {consolatedData &&
                    consolatedData.map((data, index) => {
                      return (
                        <CurrentClientProject
                          data={data}
                          projectId={data.projectId}
                        />
                      );
                    })}
                </div>
                {/* </div> */}
              </Tab.Pane>
            </Tab.Content>
          </div>
        </div>
        <Modal show={showLoaderModal} centered>
          <Modal.Body className="text-center">
            <Spinner animation="grow" variant="primary" />
            <Spinner animation="grow" variant="secondary" />
            <Spinner animation="grow" variant="success" />
            <Spinner animation="grow" variant="danger" />
            <Spinner animation="grow" variant="warning" />
            <Spinner animation="grow" variant="info" />
            <Spinner animation="grow" variant="dark" />
          </Modal.Body>
        </Modal>
      </Tab.Container>
    </div>
  );
}

export default ConsolidatedView;
