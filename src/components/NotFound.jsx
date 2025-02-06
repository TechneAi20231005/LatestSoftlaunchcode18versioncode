import React from "react";
import NotFoundIcon from "../assets/images/No data-cuate (1).svg";

function NotFound({ topMargin = 5 }) {
  return (
    <div className={`container d-flex flex-column justify-content-center align-items-center mt-${topMargin} px-3`}>
      <img
        src={NotFoundIcon}
        alt="Not Found"
        className="img-fluid h-auto"
        style={{ maxWidth: "80%", maxHeight: "280px" }}
      />

      <div className="text-center fs-5 fs-md-5 text-primary fw-bold mt-3">
        Oops! It looks like there are no records.
      </div>
    </div>
  );
}

export default NotFound;
