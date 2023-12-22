import React from "react";
import { Link, useNavigate } from "react-router-dom";
import menu from "../Data/menu.json";
import menu2 from "../Data/menu2.json";
import { _base, userSessionData } from "../../settings/constants";
import { getMenu } from "../../services/OtherService/MenuService";

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSidebarMini: false,
      isOpenMenu2: false,
      menuData: menu,
      darkLightMode: "light",
      updateRtl: false,
      redirect: false,
    };
  }

  componentWillUnmount() {
    // Remove the event listener when the component is about to unmount
    window.removeEventListener("unload", this.handleBeforeUnload);
  }

  handleBeforeUnload = () => {
    // Perform any cleanup tasks or clear the session here
    // For example, you can clear session storage or local storage
    window.sessionStorage.clear();
    window.localStorage.clear();

    // NOTE: Modern browsers may not show a custom message anymore, but you can still use it
    // to perform cleanup tasks before the user leaves the page.
    const confirmationMessage = "Are you sure you want to leave?";
    alert(confirmationMessage);
    return confirmationMessage;
  };
  
  decodeToken = (token) => {
    // Decode JWT token payload
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  };


  async componentDidMount() {
      // Set token expiration time

     

    var role_id = localStorage.getItem("role_id");
    var a = sessionStorage.getItem("user_id")
    // window.addEventListener('unload', this.handleBeforeUnload);
    await getMenu(role_id).then((res) => {        
      if (res.data.status == 1) {
        // if (res.data.data && res.data.data.menu.length > 0) {
          const tempMenu = res.data.data;
          this.setState({ menuData: tempMenu });
         } else {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href =`${process.env.PUBLIC_URL}/`;
      }
    });
    window.document.children[0].setAttribute("data-theme", "light");
  }

  openChildren(id) {
    var otherTabs = document.getElementsByClassName("has-children");
    if (otherTabs) {
      for (var i = 0; i < otherTabs.length; i++) {
        if (otherTabs[i].id !== id) {
          otherTabs[i].className = otherTabs[i].className.replace(" show", "");
          if (otherTabs[i].parentElement.children.length > 1) {
            otherTabs[i].parentElement.children[0].setAttribute(
              "aria-expanded",
              "false"
            );
          }
        }
      }
    }
    var menutab = document.getElementById(id);
    if (menutab) {
      if (menutab.classList.contains("show")) {
        menutab.classList.remove("show");
        if (menutab.parentElement.children.length > 1) {
          menutab.parentElement.children[0].setAttribute(
            "aria-expanded",
            "false"
          );
        }
      } else {
        menutab.classList.add("show");
        if (menutab.parentElement.children.length > 1) {
          menutab.parentElement.children[0].setAttribute(
            "aria-expanded",
            "true"
          );
        }
      }
    }
  }
  openChildren1(id) {
    var otherTabs = document.getElementsByClassName("has-children");
    if (otherTabs) {
      for (var i = 0; i < otherTabs.length; i++) {
        otherTabs[i].className = otherTabs[i].className.replace(" show", "");
      }
    }
    var menutab = document.getElementById(id);
    if (menutab) {
      menutab.classList.add("show");
      if (menutab.parentElement.children.length > 1) {
        menutab.parentElement.children[0].setAttribute("aria-expanded", "true");
      }
    }
  }
  closeChildren() {
    var otherTabs = document.getElementsByClassName("has-children");
    if (otherTabs) {
      for (var i = 0; i < otherTabs.length; i++) {
        otherTabs[i].className = otherTabs[i].className.replace(" show", "");
        if (otherTabs[i].parentElement.children.length > 1) {
          otherTabs[i].parentElement.children[0].setAttribute(
            "aria-expanded",
            "false"
          );
        }
      }
    }
  }
  GotoChangeMenu(val) {
    if (val === "UI Components") {
      this.props.history.push("ui-alerts");
      this.setState({ menuData: [...menu2] });
    } else {
      this.props.history.push("hr-dashboard");
      this.setState({ menuData: [...menu] });
    }
  }
  onChangeDarkMode() {
    if (window.document.children[0].getAttribute("data-theme") === "light") {
      window.document.children[0].setAttribute("data-theme", "dark");
      this.setState({
        darkLightMode: "dark",
      });
    } else {
      window.document.children[0].setAttribute("data-theme", "light");
      this.setState({
        darkLightMode: "light",
      });
    }
  }
  onChangeRTLMode() {
    if (document.body.classList.contains("rtl_mode")) {
      document.body.classList.remove("rtl_mode");
    } else {
      document.body.classList.add("rtl_mode");
    }
    this.setState({ updateRtl: !this.state.updateRtl });
  }

  render() {
    const { activekey } = this.props;
    const { isSidebarMini, menuData, darkLightMode } = this.state;
    return (
      <div
        id="mainSideMenu"
        className={`sidebar px-4 py-4 py-md-5 me-0 ${
          isSidebarMini ? "sidebar-mini" : ""
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
            {this.state.menuData.menu.map((d, i) => {
              if (d.isToggled) {
                return (
                  <li key={"shsdg" + i}>
                    <a
                      className={`m-link `}
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                        this.GotoChangeMenu(d.name);
                      }}
                    >
                      <i className={d.iconClass}></i>
                      <span>{d.name}</span>
                    </a>
                  </li>
                );
              }

              if (d.children.length === 0) {
                return (
                  <li key={"dsfshsdg" + i} className=" collapsed">
                    <Link
                      to={`/${_base + "/" + d.routerLink[0]}`}
                      className={`m-link`}
                    >
                      <i className={d.iconClass}></i>
                      <span>{d.name}</span>
                      <span className="arrow icofont-dotted-down ms-auto text-end fs-5"></span>
                    </Link>
                  </li>
                );
              }
              return (
                <li key={"shsdg" + i} className=" collapsed ">
                  <a
                    className={`m-link ${
                      d.children.filter(
                        (d) => "/" + d.routerLink[0] === activekey
                      ).length > 0
                        ? "active"
                        : ""
                    }`}
                    href="#!"
                    onClick={(e) => {
                      e.preventDefault();
                      this.openChildren("menu-Pages" + i);
                    }}
                  >
                    <i className={d.iconClass}></i>
                    <span style={{ fontSize: "1rem" }}>{d.name}</span>
                    <span className="arrow icofont-dotted-down ms-auto text-end fs-5"></span>
                  </a>
                  {d.children.length > 0 ? (
                    <ul
                      className="sub-menu collapse has-children"
                      id={"menu-Pages" + i}
                    >
                      {d.children.map((data, ind) => {
                        if (d.children.length > 0) {
                          if (activekey === "/" + data.routerLink[0]) {
                            setTimeout(() => {
                              this.openChildren1("menu-Pages" + i);
                            }, 500);
                          }
                        }
                        return (
                          <li key={"jfdgj" + ind}>
                            <Link
                              className={
                                activekey === "/" + data.routerLink[0]
                                  ? "ms-link active"
                                  : "ms-link"
                              }
                              to={`/${_base + "/" + data.routerLink[0]}`}
                            >
                              {" "}
                              <span style={{ fontSize: "0.8rem" }}>
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
                  checked={darkLightMode === "dark" ? true : false}
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
                  checked={document.body.classList.contains("rtl_mode")}
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

export default  Sidebar;

// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import menu from "../Data/menu.json";
// import menu2 from "../Data/menu2.json";
// import { _base } from "../../settings/constants";
// import { getMenu } from "../../services/OtherService/MenuService";

// class Sidebar extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isSidebarMini: false,
//       isOpenMenu2: false,
//       menuData: menu,
//       darkLightMode: "light",
//       updateRtl: false,
//       redirect: false,
//     };
//   }

//   async componentDidMount() {

//     // alert(window.location.pathname);
//     sessionStorage.setItem("URL",`${process.env.PUBLIC_URL}`);
//     if(`${process.env.PUBLIC_URL}` != sessionStorage.getItem("URL")){
//       sessionStorage.clear();
//       localStorage.clear();
//     }
//     var check = localStorage.getItem("password");
//     if (
//       check &&
//       (window.location.pathname == `${process.env.PUBLIC_URL}/` ||
//         window.location.pathname == `${process.env.PUBLIC_URL}`)
//     ) {
//       window.location.href = `${process.env.PUBLIC_URL}/dashboard`;
//     }
//     await getMenu().then((res) => {
//       const main = {
//         breadcrumbMessage: "Welcome",
//         children: [],
//         created_at: null,
//         department_id: "2",
//         iconClass: "icofont-home fs-5",
//         id: 0,
//         identifier: "dashboard",
//         isApp: "0",
//         isCategory: "0",
//         is_active: 1,
//         name: "Dashboard",
//         parent_id: null,
//         remark: null,
//         routerLink: ["Dashboard-1"],
//         tenant_id: 1,
//         updated_at: null,
//       };

//       // if(res.data.status==1){
//       // alert(localStorage["old_path"] + " " + window.location.pathname);
//       if (
//         localStorage["old_path"] != null &&
//         localStorage["old_path"] != window.location.pathname
//       ) {
//         localStorage.setItem("old_path", window.location.pathname);
//         if (localStorage["reload"] == null) {
//           localStorage.setItem("reload", "0");
//           window.location.reload();
//         } else if (localStorage["reload"] == "0") {
//           localStorage.setItem("reload", "1");
//           window.location.reload();
//         } else {
//           localStorage.setItem("reload", "0");
//         }
//       }

//       if (res.data.data && res.data.data.menu.length > 0) {
//         const tempMenu = res.data.data;
//         this.setState({ menuData: tempMenu });

//       }else{
//           localStorage.clear();
//           sessionStorage.clear();
//           window.location.href =`${process.env.PUBLIC_URL}/`;
//       }
//     });
//     window.document.children[0].setAttribute("data-theme", "light");
//   }
//   refreshPage() {
//     setTimeout(() => {
//       window.location.reload(false);
//     }, 500);
//   }

//   openChildren(id) {
//     var otherTabs = document.getElementsByClassName("has-children");
//     if (otherTabs) {
//       for (var i = 0; i < otherTabs.length; i++) {
//         if (otherTabs[i].id !== id) {
//           otherTabs[i].className = otherTabs[i].className.replace(" show", "");
//           if (otherTabs[i].parentElement.children.length > 1) {
//             otherTabs[i].parentElement.children[0].setAttribute(
//               "aria-expanded",
//               "false"
//             );
//           }
//         }
//       }
//     }
//     var menutab = document.getElementById(id);
//     if (menutab) {
//       if (menutab.classList.contains("show")) {
//         menutab.classList.remove("show");
//         if (menutab.parentElement.children.length > 1) {
//           menutab.parentElement.children[0].setAttribute(
//             "aria-expanded",
//             "false"
//           );
//         }
//       } else {
//         menutab.classList.add("show");
//         if (menutab.parentElement.children.length > 1) {
//           menutab.parentElement.children[0].setAttribute(
//             "aria-expanded",
//             "true"
//           );
//         }
//       }
//     }
//   }
//   openChildren1(id) {
//     var otherTabs = document.getElementsByClassName("has-children");
//     if (otherTabs) {
//       for (var i = 0; i < otherTabs.length; i++) {
//         otherTabs[i].className = otherTabs[i].className.replace(" show", "");
//       }
//     }
//     var menutab = document.getElementById(id);
//     if (menutab) {
//       menutab.classList.add("show");
//       if (menutab.parentElement.children.length > 1) {
//         menutab.parentElement.children[0].setAttribute("aria-expanded", "true");
//       }
//     }
//   }
//   closeChildren() {
//     var otherTabs = document.getElementsByClassName("has-children");
//     if (otherTabs) {
//       for (var i = 0; i < otherTabs.length; i++) {
//         otherTabs[i].className = otherTabs[i].className.replace(" show", "");
//         if (otherTabs[i].parentElement.children.length > 1) {
//           otherTabs[i].parentElement.children[0].setAttribute(
//             "aria-expanded",
//             "false"
//           );
//         }
//       }
//     }
//   }
//   GotoChangeMenu(val) {
//     if (val === "UI Components") {
//       this.props.history.push("ui-alerts");
//       this.setState({ menuData: [...menu2] });
//     } else {
//       this.props.history.push("hr-dashboard");
//       this.setState({ menuData: [...menu] });
//     }
//   }
//   onChangeDarkMode() {
//     if (window.document.children[0].getAttribute("data-theme") === "light") {
//       window.document.children[0].setAttribute("data-theme", "dark");
//       this.setState({
//         darkLightMode: "dark",
//       });
//     } else {
//       window.document.children[0].setAttribute("data-theme", "light");
//       this.setState({
//         darkLightMode: "light",
//       });
//     }
//   }
//   onChangeRTLMode() {
//     if (document.body.classList.contains("rtl_mode")) {
//       document.body.classList.remove("rtl_mode");
//     } else {
//       document.body.classList.add("rtl_mode");
//     }
//     this.setState({ updateRtl: !this.state.updateRtl });
//   }

//   render() {
//     const { activekey } = this.props;
//     const { isSidebarMini, menuData, darkLightMode } = this.state;
//     return (
//       <div
//         id="mainSideMenu"
//         className={`sidebar px-4 py-4 py-md-5 me-0 ${
//           isSidebarMini ? "sidebar-mini" : ""
//         }`}
//       >
//         <div className="d-flex flex-column h-100">
//           <a href="hr-dashboard" className="mb-0 brand-icon">
//             <span className="logo-icon">
//               <svg
//                 width="35"
//                 height="35"
//                 fill="currentColor"
//                 className="bi bi-clipboard-check"
//                 viewBox="0 0 16 16"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"
//                 ></path>
//                 <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"></path>
//                 <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"></path>
//               </svg>
//             </span>
//             <span className="logo-text">My-Task</span>
//           </a>
//           <ul className="menu-list flex-grow-1 mt-3">
//             {this.state.menuData.menu.map((d, i) => {
//               if (d.isToggled) {
//                 return (
//                   <li key={"shsdg" + i}>

//                     <a
//                       className={`m-link `}
//                       href="#!"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         this.GotoChangeMenu(d.name);
//                       }}
//                     >
//                       <i className={d.iconClass}></i>
//                       <span>{d.name}</span>
//                     </a>
//                   </li>
//                 );
//               }

//               if (d.children.length === 0) {
//                 return (
//                   <li key={"dsfshsdg" + i} className=" collapsed">
//                     <Link
//                       to={`/${_base + "/" + d.routerLink[0]}`}
//                       className={`m-link`}
//                     >
//                       <i className={d.iconClass}></i>
//                       <span>{d.name}</span>
//                       <span className="arrow icofont-dotted-down ms-auto text-end fs-5"></span>
//                     </Link>
//                   </li>
//                 );
//               }
//               return (
//                 <li key={"shsdg" + i} className=" collapsed">
//                   <a
//                     className={`m-link ${
//                       d.children.filter(
//                         (d) => "/" + d.routerLink[0] === activekey
//                       ).length > 0
//                         ? "active"
//                         : ""
//                     }`}
//                     href="#!"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       this.openChildren("menu-Pages" + i);
//                     }}
//                   >
//                     <i className={d.iconClass}></i>
//                     <span>{d.name}</span>
//                     <span className="arrow icofont-dotted-down ms-auto text-end fs-6"></span>
//                   </a>
//                   {d.children.length > 0 ? (
//                     <ul
//                       className="sub-menu collapse has-children"
//                       id={"menu-Pages" + i}
//                     >
//                       {d.children.map((data, ind) => {
//                         if (d.children.length > 0) {
//                           if (activekey === "/" + data.routerLink[0]) {
//                             setTimeout(() => {
//                               this.openChildren1("menu-Pages" + i);
//                             }, 500);
//                           }
//                         }
//                         return (
//                           <li key={"jfdgj" + ind}>
//                             <Link
//                               className={
//                                 activekey === "/" + data.routerLink[0]
//                                 ? "ms-link active"
//                                   : "ms-link"
//                               }
//                               to={`/${_base + "/" + data.routerLink[0]}`}
//                             >
//                               {" "}
//                               <span>
//                                 <i className={data.iconClass}></i> {data.name}
//                               </span>
//                             </Link>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   ) : null}
//                 </li>
//               );
//             })}
//           </ul>

//           <ul className="list-unstyled mb-0">
//             <li className="d-flex align-items-center justify-content-center">
//               <div className="form-check form-switch theme-switch">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   checked={darkLightMode === "dark" ? true : false}
//                   id="theme-switch"
//                   onChange={() => {
//                     this.onChangeDarkMode();
//                   }}
//                 />
//                 <label className="form-check-label" htmlFor="theme-switch">
//                   Enable Dark Mode!
//                 </label>
//               </div>
//             </li>
//             <li className="d-flex align-items-center justify-content-center">
//               <div className="form-check form-switch theme-rtl">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   checked={document.body.classList.contains("rtl_mode")}
//                   id="theme-rtl"
//                   onChange={() => {
//                     this.onChangeRTLMode();
//                   }}
//                 />
//                 <label className="form-check-label" htmlFor="theme-rtl">
//                   Enable RTL Mode!
//                 </label>
//               </div>
//             </li>
//           </ul>
//           <button
//             type="button"
//             className="btn btn-link sidebar-mini-btn text-light"
//             onClick={() => {
//               this.setState({ isSidebarMini: !isSidebarMini });
//             }}
//           >
//             <span className="ms-2">
//               <i className="icofont-bubble-right"></i>
//             </span>
//           </button>
//         </div>
//       </div>
//     );
//   }
// }

// export default Sidebar;
