import React from 'react';
import './style.scss';
function CustomTab({ tabsData, currentTab, setCurrentTab }) {
  return (
    <div className="tab_container">
      <ul>
        {tabsData?.map((tab) => (
          <li
            className={tab?.value === currentTab && 'tab_active'}
            onClick={() => setCurrentTab(tab?.value)}
            key={tab?.value}
          >
            {tab?.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomTab;
