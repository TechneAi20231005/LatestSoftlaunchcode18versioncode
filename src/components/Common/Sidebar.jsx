import React, { useState, useEffect, memo, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// // static import
import { _base } from '../../settings/constants';
import {
  getEmployeeListThunk,
  getMenuListThunk
} from '../../redux/services/Sidebar';

const Sidebar = ({ activekey }) => {
  // // initial state
  const user_id = localStorage.getItem('id');
  const role_id = localStorage.getItem('role_id');
  const sidebarRef = useRef();
  const dispatch = useDispatch();

  //Redux State
  const { sidebarMenuList } = useSelector((state) => state?.sidebar);

  // // local state
  const [isSidebarMini, setIsSidebarMini] = useState(false);
  const [darkLightMode, setDarkLightMode] = useState('light');
  const [updateRtl, setUpdateRtl] = useState(false);

  // // handler
  const openChildren = useCallback((id) => {
    const otherTabs = document.querySelectorAll('.has-children');
    otherTabs.forEach((tab) => {
      if (tab.id !== id) {
        tab.classList.remove('show');
        tab
          .querySelector('[aria-expanded]')
          ?.setAttribute('aria-expanded', 'false');
      }
    });

    const menuTab = document.getElementById(id);
    if (menuTab) {
      const isOpen = menuTab.classList.toggle('show');
      menuTab
        .querySelector('[aria-expanded]')
        ?.setAttribute('aria-expanded', isOpen);
    }
  }, []);

  const onChangeDarkMode = () => {
    const newMode = darkLightMode === 'light' ? 'dark' : 'light';
    document.documentElement?.setAttribute('data-theme', newMode);
    setDarkLightMode(newMode);
  };

  const onChangeRTLMode = () => {
    document.body.classList.toggle('rtl_mode');
    setUpdateRtl((prev) => !prev);
  };

  const toggleSidebarMini = () => {
    setIsSidebarMini((prev) => !prev);
  };

  const handleToggleSidebar = () => {
    const sideBar = sidebarRef.current;
    if (sideBar) {
      sideBar.classList.remove('open');
    }
  };

  const handleClickOutside = useCallback(
    (event) => {
      const sideBar = sidebarRef.current;
      if (sideBar && !sideBar.contains(event.target)) {
        sideBar.classList.remove('open');
      }
    },
    [sidebarRef]
  );

  // // life cycle
  // // backdrop handler
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    dispatch(getEmployeeListThunk({ user_id: user_id }));
    dispatch(getMenuListThunk({ role_id: role_id }));
    document.children[0]?.setAttribute('data-theme', 'light');
  }, [user_id, role_id]);

  return (
    <div
      ref={sidebarRef}
      id="mainSideMenu"
      className={`sidebar px-4 py-4 py-md-5 me-0 ${
        isSidebarMini ? 'sidebar-mini' : ''
      }`}
    >
      <div className="d-flex flex-column h-100">
        <a href="dashboard" className="mb-0 brand-icon">
          <span className="logo-icon">
            <svg
              width="35"
              height="35"
              fill="currentColor"
              className="bi bi-clipboard-check"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"
              ></path>
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"></path>
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"></path>
            </svg>
          </span>
          <span className="logo-text">My-Task</span>
        </a>

        <ul className="menu-list flex-grow-1 mt-3">
          {sidebarMenuList?.map((item, index) => {
            const hasChildren = item.children.length > 0;
            // const isActive = item.children.some(
            //   (data) => `/${data.routerLink[0]}` === activekey
            // );

            return (
              <li key={`menu-item-${index}`} className={`collapsed `}>
                <a
                  className={`m-link`}
                  href={hasChildren ? '#!' : `/${_base}/${item.routerLink[0]}`}
                  onClick={
                    hasChildren
                      ? (e) => {
                          e.preventDefault();
                          openChildren(`menu-Pages-${index}`);
                        }
                      : handleToggleSidebar
                  }
                >
                  <i className={item.iconClass} />
                  <span>{item.name}</span>
                  {hasChildren && (
                    <span className="arrow icofont-dotted-down ms-auto text-end fs-5"></span>
                  )}
                </a>
                {hasChildren && (
                  <ul
                    className="sub-menu collapse has-children"
                    id={`menu-Pages-${index}`}
                  >
                    {item.children.map((data, ind) => (
                      <li key={`submenu-item-${ind}`}>
                        <Link
                          className={`ms-link`}
                          to={`/${_base}/${data.routerLink[0]}`}
                          onClick={handleToggleSidebar}
                        >
                          <i className={data.iconClass} /> {data.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        <ul className="list-unstyled mb-0">
          <li className="d-flex align-items-center justify-content-center">
            <div className="form-check form-switch theme-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={darkLightMode === 'dark'}
                id="theme-switch"
                onChange={onChangeDarkMode}
              />
              <label className="form-check-label" htmlFor="theme-switch">
                Enable Dark Mode!
              </label>
            </div>
          </li>
          <li className="d-flex align-items-center justify-content-center">
            <div className="form-check form-switch theme-rtl">
              <input
                className="form-check-input"
                type="checkbox"
                checked={document.body.classList.contains('rtl_mode')}
                id="theme-rtl"
                onChange={onChangeRTLMode}
              />
              <label className="form-check-label" htmlFor="theme-rtl">
                Enable RTL Mode!
              </label>
            </div>
          </li>
        </ul>
        <button
          type="button"
          className="btn btn-link sidebar-mini-btn text-light"
          onClick={toggleSidebarMini}
        >
          <i className="icofont-bubble-right" />
        </button>
      </div>
    </div>
  );
};

export default memo(Sidebar);
