import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// // static import
import { getFollowUpListThunk } from '../../../../../../redux/services/hrms/employeeJoining/followUp';
import { REACT_APP_ATTACHMENT_URL } from '../../../../../../config/envConfig';

function FollowUpHistory() {
  // // initial state
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentCandidateId } = location.state;

  // // redux state
  const { followUpList, isLoading } = useSelector(state => state?.candidatesFollowUp);

  // // life cycle
  useEffect(() => {
    if (!followUpList?.length) {
      dispatch(getFollowUpListThunk({ currentId: currentCandidateId }));
    }
  }, []);

  return (
    <div>
      <h5 className="mb-0 text-primary">Follow Up Activity</h5>
      <hr className="primary_divider mt-1" />
      {isLoading?.getFollowUpList ? (
        [...new Array(2)].map((_, index) => (
          <div key={index}>
            <div className="skeleton" />
            <div className="remark_history d-flex justify-content-between mt-3 gap-3">
              <div className="skeleton w-100" />
              <div className="skeleton w-100" />
              <div className="skeleton mt-5 w-100" />
            </div>
            <hr />
          </div>
        ))
      ) : followUpList?.length ? (
        followUpList?.map((followUp, index) => (
          <div key={index}>
            <p>{followUp?.title || 'N/A'}</p>
            <div className="remark_history d-flex justify-content-between">
              <div>
                <h5>Next Follow-up Date & Time</h5>
                <p>{followUp?.next_date || 'N/A'}</p>
              </div>
              <div>
                <h5>Attachment</h5>
                <a href={`${REACT_APP_ATTACHMENT_URL}${followUp?.attachment_file}`} target="_blank">
                  Attachment
                </a>
              </div>
              <p className="mt-5 opacity-50">{`${followUp?.created_by || 'N/A'}, ${
                followUp?.created_at || 'N/A'
              }`}</p>
            </div>
            <hr className="mt-0" />
          </div>
        ))
      ) : (
        <p className="text-center opacity-50">No record found</p>
      )}
    </div>
  );
}

export default FollowUpHistory;
