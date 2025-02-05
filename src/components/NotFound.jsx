import React from 'react';
import NotFoundIcon from '../assets/images/NotFoundIcon.webp';

function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center mt-5">
      <img src={NotFoundIcon} height={300} width={450} alt="Not Found" />
      <div className="text-center fs-5 text_primary fw-bold">
        Oops! It looks like there are no records.
      </div>
    </div>
  );
}

export default NotFound;
