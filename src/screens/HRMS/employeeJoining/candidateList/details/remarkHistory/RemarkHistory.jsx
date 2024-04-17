import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import { getRemarkHistoryListThunk } from '../../../../../../redux/services/hrms/employeeJoining/remarkHistory';

function RemarkHistory() {
  // // initial state
  const dispatch = useDispatch();

  // // redux state
  const { remarkHistoryList, isLoading } = useSelector(state => state?.candidatesRemarkHistory);

  // // life cycle
  useEffect(() => {
    if (!remarkHistoryList?.length) {
      dispatch(getRemarkHistoryListThunk());
    }
  }, []);
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
              <p>Remark Title : {remark?.remark_title || 'N/A'}</p>
              <p className="mt-4 opacity-50">{remark?.remark_description || 'N/A'}</p>
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
