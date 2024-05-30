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
  const { followUpList, isLoading } = useSelector((state) => state?.candidatesFollowUp);

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
            <div className="d-flex justify-content-between mt-3 gap-3">
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
            <div className="d-flex flex-column flex-md-row justify-content-between">
              <div className="col-md-6">
                <h5>Follow Up Message</h5>
                <p className="mb-md-0">{followUp?.title || 'N/A'}</p>
              </div>
              <div className="col-md-3">
                <h5>Next Follow-up Date & Time</h5>
                <p className="mb-md-0">{followUp?.next_date || 'N/A'}</p>
              </div>
              <div className="col-md-3">
                <h5>Attachment</h5>
                {followUp?.attachment_file ? (
                  <a
                    href={`${REACT_APP_ATTACHMENT_URL}${followUp?.attachment_file}`}
                    target="_blank"
                    className="link_underline_primary"
                  >
                    {followUp?.attachment_file?.split('/')?.pop()}
                  </a>
                ) : (
                  'N/A'
                )}
              </div>
            </div>
            <hr className="mb-1" />
            <p className="opacity-50 text-end">{`${followUp?.created_by || 'N/A'}, ${
              followUp?.created_at || 'N/A'
            }`}</p>
          </div>
        ))
      ) : (
        <p className="text-center opacity-50">No record found</p>
      )}
    </div>
  );
}

export default FollowUpHistory;
