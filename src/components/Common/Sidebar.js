import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import menu from '../Data/menu.json';
import menu2 from '../Data/menu2.json';
import { _base, menuUrl, userSessionData } from '../../settings/constants';
import { getMenu } from '../../services/OtherService/MenuService';
import axios from 'axios';
import UserService, {
  getUser
} from '../../services/MastersService/UserService';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSidebarMini: false,
      isOpenMenu2: false,
      menuData: [],
      darkLightMode: 'light',
      updateRtl: false,
      redirect: false,
      employeeMaster: [],
      user_id: localStorage.getItem('id'),
      role_id: localStorage.getItem('role_id'),
      account_for: ''
    };
    this.sidebarRef = React.createRef();
  }

  decodeToken = (token) => {
    // Decode JWT token payload
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  };
  ///madhura

  async componentDidMount() {
    try {
      await new UserService().getUserById(this.state.user_id).then((res) => {
        if (res.data.status === 1) {
          const response = res?.data?.data;
          this.setState({ account_for: response?.account_for });
        }
      });

      const res = await getMenu(this.state.role_id);
      if (res.data.status === 1) {
        const tempMenu = res.data.data.menu.filter((menu) => {
          if (this.state.account_for === 'SELF') {
            return menu;
          } else {
            return menu.id == 16;
          }
        });

        this.setState({ menuData: tempMenu });
      } else {
      }

      window.document.children[0].setAttribute('data-theme', 'light');
    } catch (error) {
    } finally {
    }
  }

  openChildren(id) {
    var otherTabs = document.getElementsByClassName('has-children');
    if (otherTabs) {
      for (var i = 0; i < otherTabs.length; i++) {
        if (otherTabs[i].id !== id) {
          otherTabs[i].className = otherTabs[i].className.replace(' show', '');
          if (otherTabs[i].parentElement.children.length > 1) {
            otherTabs[i].parentElement.children[0].setAttribute(
              'aria-expanded',
              'false'
            );
          }
        }
      }
    }
    var menutab = document.getElementById(id);
    if (menutab) {
      if (menutab.classList.contains('show')) {
        menutab.classList.remove('show');
        if (menutab.parentElement.children.length > 1) {
          menutab.parentElement.children[0].setAttribute(
            'aria-expanded',
            'false'
          );
        }
      } else {
        menutab.classList.add('show');
        if (menutab.parentElement.children.length > 1) {
          menutab.parentElement.children[0].setAttribute(
            'aria-expanded',
            'true'
          );
        }
      }
    }
  }
  openChildren1(id) {
    var otherTabs = document.getElementsByClassName('has-children');
    if (otherTabs) {
      for (var i = 0; i < otherTabs.length; i++) {
        otherTabs[i].className = otherTabs[i].className.replace(' show', '');
      }
    }
    var menutab = document.getElementById(id);
    if (menutab) {
      menutab.classList.add('show');
      if (menutab.parentElement.children.length > 1) {
        menutab.parentElement.children[0].setAttribute('aria-expanded', 'true');
      }
    }
  }
  closeChildren() {
    var otherTabs = document.getElementsByClassName('has-children');
    if (otherTabs) {
      for (var i = 0; i < otherTabs.length; i++) {
        otherTabs[i].className = otherTabs[i].className.replace(' show', '');
        if (otherTabs[i].parentElement.children.length > 1) {
          otherTabs[i].parentElement.children[0].setAttribute(
            'aria-expanded',
            'false'
          );
        }
      }
    }
  }
  GotoChangeMenu(val) {
    if (val === 'UI Components') {
      this.props.history('ui-alerts');
      this.setState({ menuData: [...menu2] });
    } else {
      this.props.history('hr-dashboard');
      this.setState({ menuData: [...menu] });
    }
  }
  onChangeDarkMode() {
    if (window.document.children[0].getAttribute('data-theme') === 'light') {
      window.document.children[0].setAttribute('data-theme', 'dark');
      this.setState({
        darkLightMode: 'dark'
      });
    } else {
      window.document.children[0].setAttribute('data-theme', 'light');
      this.setState({
        darkLightMode: 'light'
      });
    }
  }
  onChangeRTLMode() {
    if (document.body.classList.contains('rtl_mode')) {
      document.body.classList.remove('rtl_mode');
    } else {
      document.body.classList.add('rtl_mode');
    }
    this.setState({ updateRtl: !this.state.updateRtl });
  }

  handelToggleSidebar = () => {
    const sideBar = this.sidebarRef.current;
    if (sideBar) {
      sideBar.classList.remove('open');
    }
  };

  render() {
    const { activekey } = this.props;
    const { isSidebarMini, menuData, darkLightMode } = this.state;
    return (
      <div
        ref={this.sidebarRef}
        id="mainSideMenu"
        className={`sidebar px-4 py-4 py-md-5 me-0 ${
          isSidebarMini ? 'sidebar-mini' : ''
        }`}
      >
        <div className="d-flex flex-column h-100">
          <a href="hr-dashboard" className="mb-0 brand-icon">
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
            {this.state?.menuData?.map((d, i) => {
              if (d.isToggled) {
                return (
                  <li key={'shsdg' + i}>
                    <a
                      className={`m-link `}
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                        this.GotoChangeMenu(d.name);
                      }}
                    >
                      <i className={d.iconClass}></i>
                      <span>{d.name}hii</span>
                    </a>
                  </li>
                );
              }

              if (d.children.length === 0) {
                return (
                  <li key={'dsfshsdg' + i} className=" collapsed">
                    <Link
                      to={`/${_base + '/' + d.routerLink[0]}`}
                      className={`m-link`}
                      onClick={this.handelToggleSidebar}
                    >
                      <i className={d.iconClass}></i>
                      <span>{d.name}</span>
                      <span className="arrow icofont-dotted-down ms-auto text-end fs-5"></span>
                    </Link>
                  </li>
                );
              }
              return (
                <li key={'shsdg' + i} className=" collapsed ">
                  <a
                    className={`m-link ${
                      d.children.filter(
                        (d) => '/' + d.routerLink[0] === activekey
                      ).length > 0
                        ? 'active'
                        : ''
                    }`}
                    href="#!"
                    onClick={(e) => {
                      e.preventDefault();
                      this.openChildren('menu-Pages' + i);
                    }}
                  >
                    <i className={d.iconClass}></i>
                    <span style={{ fontSize: '1rem' }}>{d.name}</span>
                    <span className="arrow icofont-dotted-down ms-auto text-end fs-5"></span>
                  </a>
                  {d.children?.length > 0 ? (
                    <ul
                      className="sub-menu collapse has-children"
                      id={'menu-Pages' + i}
                    >
                      {d.children?.map((data, ind) => {
                        if (d.children.length > 0) {
                          if (activekey === '/' + data.routerLink[0]) {
                            setTimeout(() => {
                              this.openChildren1('menu-Pages' + i);
                            }, 500);
                          }
                        }
                        return (
                          <li key={'jfdgj' + ind}>
                            <Link
                              className={
                                activekey === '/' + data.routerLink[0]
                                  ? 'ms-link active'
                                  : 'ms-link'
                              }
                              to={`/${_base + '/' + data.routerLink[0]}`}
                              onClick={this.handelToggleSidebar}
                            >
                              {' '}
                              <span style={{ fontSize: '0.8rem' }}>
                                <i className={data.iconClass}></i> {data.name}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
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
                  checked={darkLightMode === 'dark' ? true : false}
                  id="theme-switch"
                  onChange={() => {
                    this.onChangeDarkMode();
                  }}
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
                  onChange={() => {
                    this.onChangeRTLMode();
                  }}
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
            onClick={() => {
              this.setState({ isSidebarMini: !isSidebarMini });
            }}
          >
            <span className="ms-2">
              <i className="icofont-bubble-right"></i>
            </span>
          </button>
        </div>
      </div>
    );
  }
}

export default Sidebar;
