import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// // static import
import { getRemarkHistoryListThunk } from '../../../../../../redux/services/hrms/employeeJoining/remarkHistory';
import { RenderIf } from '../../../../../../utils';

function RemarkHistory() {
  // // initial state
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentCandidateId } = location.state;

  // // redux state
  const { remarkHistoryList, isLoading } = useSelector(state => state?.candidatesRemarkHistory);

  // // life cycle
  useEffect(() => {
    dispatch(getRemarkHistoryListThunk({ currentId: currentCandidateId }));
  }, [currentCandidateId]);
  return (
    <Container fluid className="employee_joining_details_container">
      <h5 className="mb-0 text-primary">Remark History</h5>
      <hr className="primary_divider mt-1" />
      {isLoading?.getRemarkHistoryList ? (
        [...new Array(3)].map(() => (
          <>
            <div className="remark_history d-flex justify-content-between  mt-3 gap-3">
              <div className="skeleton w-25" />
              <div className="skeleton mt-5 w-50" />
            </div>
            <hr />
          </>
        ))
      ) : remarkHistoryList?.length ? (
        remarkHistoryList?.map((remark, index) => (
          <div key={index}>
            <div className="remark_history d-flex justify-content-between">
              <div>
                <p>Remark Title : {remark?.remark_description || 'N/A'}</p>
                <RenderIf render={remark?.other_remark}>
                  <p>Specific Remark : {remark?.other_remark || 'N/A'}</p>
                </RenderIf>
              </div>
              {/* <p className="mt-4 opacity-50">{remark?.remark_description || 'N/A'}</p> */}
              <p className="mt-5 opacity-50">{`${remark?.created_by || 'N/A'}, ${
                remark?.created_at || 'N/A'
              }`}</p>
            </div>
            <hr className="mt-0" />
          </div>
        ))
      ) : (
        <p className="text-center opacity-50">No record found</p>
      )}
    </Container>
  );
}

export default RemarkHistory;
