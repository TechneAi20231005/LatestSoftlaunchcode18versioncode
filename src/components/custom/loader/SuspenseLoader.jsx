import React from 'react';
import { BRAND_LOGO_TOP } from '../../../assets/images/logo';
function SuspenseLoader() {
  return (
    <div className="suspense_loader_container">
      <img src={BRAND_LOGO_TOP} alt="techneAi" className="img-fluid" />
      <div className="loading">
        <span>T</span>
        <span>E</span>
        <span>C</span>
        <span>H</span>
        <span>N</span>
        <span>E</span>
        <span className="ms-3">A</span>
        <span>I</span>
      </div>
    </div>
  );
}

export default SuspenseLoader;

export const MainLoader = () => {
  return (
    <div className="suspense_loader_container">
      <img src={BRAND_LOGO_TOP} alt="techneAi" className="img-fluid" />
      <div className="loading">
        <span>T</span>
        <span>E</span>
        <span>C</span>
        <span>H</span>
        <span>N</span>
        <span>E</span>
        <span className="ms-3">A</span>
        <span>I</span>
      </div>
    </div>
  );
};
