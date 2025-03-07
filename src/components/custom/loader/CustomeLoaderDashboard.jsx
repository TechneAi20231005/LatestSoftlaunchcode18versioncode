import React from 'react';
import Placeholder from 'react-bootstrap/Placeholder';

const CustomeLoaderDashboard = () => {
  return (
    <div className="p-4">
      {[...Array(5)].map((_, index) => (
        <Placeholder key={index} className="d-flex gap-2 my-4" as="p" animation="glow">
          <Placeholder bg="primary" className="w-50 rounded" size="lg" />
          <Placeholder bg="primary" className="w-50 rounded" size="lg" />
        </Placeholder>
      ))}
    </div>
  );
};

const ChartSkeleton = () => {
    return (
      <div className="position-relative mt-2" style={{ height: "250px" }}>
        <Placeholder
        as="p"
          animation="glow"
          className=" skeleton-glow rounded-circle position-absolute top-50 start-50 translate-middle"
          style={{
            width: "200px",
            height: "200px",
            backgroundColor: "#e0e0e0",
          }}
        />
          <Placeholder
             as="p"
          animation="glow"
          className="skeleton-glow-light rounded-circle position-absolute top-50 start-50 translate-middle"
          style={{
            width: "120px",
            height: "120px",
            backgroundColor: "#fff",
          }}
        />
      </div>

    );
  };

export default CustomeLoaderDashboard;
export { ChartSkeleton };
