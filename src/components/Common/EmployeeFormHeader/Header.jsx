import React from 'react';

// // static import
import './style.scss';
// import { REACT_APP_ATTACHMENT_URL } from "../../config/envConfig";
import { _attachmentUrl } from '../../../settings/constants';

function Header({ mobileNo, emailId, themeColor, logo }) {
  return (
    <div className="header_container" style={{ backgroundColor: themeColor }}>
      {(mobileNo || emailId) && (
        <div className="contact_info">
          {mobileNo && (
            <p>
              <i class="icofont-phone fa-lg"></i>
              {`+91-${mobileNo}`}
            </p>
          )}
          {emailId && (
            <p>
              <i class="icofont-email fa-lg"></i>
              {`${emailId}`}
            </p>
          )}
        </div>
      )}
      <img src={_attachmentUrl + logo} />
    </div>
  );
}

export default Header;
