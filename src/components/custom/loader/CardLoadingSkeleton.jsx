// import React from 'react';
// import './Skeleton.css';

// export default function CardLoadingSkeleton() {
//   return (
//     <div className="row">
//       <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-6 mb-4 mt-3">
//         <div className="card" style={{ borderRadius: '10px', width: '100%' }}>
//           <div
//             className="card-body shadow-lg p-4"
//             style={{ borderRadius: '10px' }}
//           >
//             <div className="d-flex align-items-center justify-content-between mt-3">
//               <div className="lesson_name">
//                 <div
//                   className="project-block skeleton"
//                   style={{ width: '50px', height: '50px' }}
//                 >
//                   <i className="icofont-bag-alt"></i>
//                 </div>
//               </div>
//             </div>
//             <div className="skeleton skeleton-title mt-3"></div>{' '}
//             <div className="row g-2 mt-3">
//               <div className="col-6">
//                 <div className="skeleton skeleton-line"></div>
//                 <div className="skeleton skeleton-line mt-2"></div>
//               </div>
//               <div className="col-6">
//                 <div className="skeleton skeleton-line"></div>
//                 <div className="skeleton skeleton-line mt-2"></div>
//               </div>
//             </div>
//             <div className="skeleton skeleton-divider mt-4 mb-3"></div>{' '}
//             <div className="d-flex justify-content-start">
//               <div
//                 className="skeleton skeleton-circle"
//                 style={{ width: '30px', height: '30px' }}
//               ></div>{' '}
//               <div
//                 className="skeleton skeleton-small-text ms-2"
//                 style={{ width: '100px' }}
//               ></div>{' '}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react';
import './Skeleton.css';

export default function CardLoadingSkeleton() {
  return (
    <div className="row">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-6 mb-4 mt-3"
        >
          <div className="card" style={{ borderRadius: '10px', width: '100%' }}>
            <div
              className="card-body shadow-lg p-4"
              style={{ borderRadius: '10px' }}
            >
              <div className="d-flex align-items-center justify-content-between mt-3">
                <div className="lesson_name">
                  <div
                    className="project-block skeleton"
                    style={{ width: '50px', height: '50px' }}
                  >
                    <i className="icofont-bag-alt"></i>
                  </div>
                </div>
              </div>
              <div className="skeleton skeleton-title mt-3"></div>
              <div className="row g-2 mt-3">
                <div className="col-6">
                  <div className="skeleton skeleton-line"></div>
                  <div className="skeleton skeleton-line mt-2"></div>
                </div>
                <div className="col-6">
                  <div className="skeleton skeleton-line"></div>
                  <div className="skeleton skeleton-line mt-2"></div>
                </div>
              </div>
              <div className="skeleton skeleton-divider mt-4 mb-3"></div>
              <div className="d-flex justify-content-start">
                <div
                  className="skeleton skeleton-circle"
                  style={{ width: '30px', height: '30px' }}
                ></div>
                <div
                  className="skeleton skeleton-small-text ms-2"
                  style={{ width: '100px' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
