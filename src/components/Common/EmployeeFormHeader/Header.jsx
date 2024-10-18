import React from 'react';

// // static import
import './style.scss';
import { _attachmentUrl } from '../../../settings/constants';

function Header({ mobileNo, emailId, themeColor, logo, companyName }) {
  return (
    <div className="header_container" style={{ backgroundColor: themeColor }}>
      {(mobileNo || emailId) && (
        <div className="contact_info">
          {mobileNo && (
            <p>
              <i style={{ color: themeColor }} class="icofont-phone fa-lg"></i>
              {`+91-${mobileNo}`}
            </p>
          )}
          {emailId && (
            <p>
              <i style={{ color: themeColor }} class="icofont-email fa-lg"></i>
              {`${emailId}`}
            </p>
          )}
        </div>
      )}
      {companyName && (
        <div>
          <p className="company_name">{companyName}</p>
        </div>
      )}
      {logo && <img src={_attachmentUrl + logo} alt='' />}
    </div>
  );
}

export default Header;
