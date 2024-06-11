import React, { useState, useEffect } from 'react';
import { Modal, Nav, Tab } from 'react-bootstrap';
import CurrentClientProject from './CurrentClientProject';
import PageHeader from '../../components/Common/PageHeader';
import ConsolidatedService from '../../services/ProjectManagementService/ConsolidatedService';
import { Spinner } from 'react-bootstrap';

import ManageMenuService from '../../services/MenuManagementService/ManageMenuService';
import { useDispatch, useSelector } from 'react-redux';
import { consolidatedData } from './ConsolidatedAction';
import { getRoles } from '../Dashboard/DashboardAction';
import ConsolidatedSlice from './ConsolidatedSlice';
import TableLoadingSkelton from '../../components/custom/loader/TableLoadingSkelton';
import CardLoadingSkeleton from '../../components/custom/loader/CardLoadingSkeleton';

function ConsolidatedView() {
  const dispatch = useDispatch();
  const consolatedData = useSelector(
    (ConsolidatedSlice) => ConsolidatedSlice.consolidatedData.consolidatedData
  );

  const isLoading = useSelector(
    (ConsolidatedSlice) =>
      ConsolidatedSlice.consolidatedData.isLoading.consolidatedDataList
  );

  const RoleMasterData = useSelector(
    (RoleMasterSlice) => RoleMasterSlice.rolemaster.getRoleData
  );

  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 34)
  );
  const roleId = sessionStorage.getItem('role_id');
  const [projects, setProjects] = useState(null);
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const loadData = async () => {
    dispatch(consolidatedData());
    dispatch(getRoles());
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
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
                <div className="row  ml-2 mr-2">
                  {isLoading && <CardLoadingSkeleton />}
                  {!isLoading &&
                    consolatedData &&
                    consolatedData.map((data, index) => {
                      return (
                        <CurrentClientProject
                          data={data}
                          projectId={data.projectId}
                        />
                      );
                    })}
                </div>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </div>
      </Tab.Container>
    </div>
  );
}

export default ConsolidatedView;
