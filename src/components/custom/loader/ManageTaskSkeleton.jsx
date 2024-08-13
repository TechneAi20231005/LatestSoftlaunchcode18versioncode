import React from 'react';
import './ManageTaskSkeleton.css';

const ManageTaskSkeleton = () => {
  return (
    <div className="row">
      {[...Array(9)].map((_, index) => (
        <div className="col-md-4" key={index}>
          <div className="card-body">
            <div
              className="dd-handle mt-2"
              style={{
                borderRadius: '10px',
                boxShadow: '13px 13px 21px -8px rgba(89,89,89,1)'
              }}
            >
              <div className="task-info d-flex align-items-center justify-content-between p-0 skeleton-header">
                <span className="skeleton-manage skeleton-badge"></span>
                <span className="skeleton-manage skeleton-badge"></span>
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Basic outlined example"
                >
                  <span className="skeleton-manage skeleton-button"></span>
                </div>
              </div>
              <span className="skeleton-manage skeleton-task"></span>

              <div className="d-flex align-items-center justify-content-between mt-1 skeleton-lesson-name">
                <div className="lesson_name">
                  <span
                    className="skeleton-manage"
                    style={{ width: '100%' }}
                  ></span>
                </div>
              </div>
              <div className="d-flex justify-content-start skeleton-manage-task-owners">
                <span className="skeleton-manage skeleton-avatar"></span>
                <span className="skeleton-manage skeleton-avatar"></span>
              </div>
              <div className="d-flex justify-content-between mt-1">
                <div>
                  <span className="skeleton-manage skeleton-button"></span>
                </div>
                <div className="d-flex flex-column text-center skeleton-total-worked">
                  <span
                    className="skeleton-manage mx-2"
                    style={{ width: '60px', height: '20px' }}
                  ></span>
                  <span
                    className="skeleton-manage mt-1"
                    style={{ width: '80px', height: '16px' }}
                  ></span>
                </div>
                <div className="dropdown">
                  <span
                    className="skeleton-manage skeleton-button dropdown-toggle custom-dropdown-toggle"
                    style={{ color: 'gray' }}
                  >
                    <i
                      className="icofont-navigation-menu"
                      style={{ color: 'gray' }}
                    ></i>
                  </span>
                  <div className="dropdown-menu" style={{ color: 'gray' }}>
                    <span className="skeleton-manage skeleton-dropdown-item"></span>
                    <span className="skeleton-manage skeleton-dropdown-item"></span>
                    <span className="skeleton-manage skeleton-dropdown-item"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageTaskSkeleton;
