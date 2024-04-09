import React, { useEffect, useState, useRef } from "react";
import {
  ButtonComponent,
  DropdownComponent,
  SearchComponent,
} from "../../../components/Utilities/Button/Button";
import PageHeader from "../../../components/Common/PageHeader";
import { Modal } from "react-bootstrap";
import { Astrick } from "../../../components/Utilities/Style";
import TaskTicketTypeService from "../../../services/MastersService/TaskTicketTypeService";
import Alert from "../../../components/Common/Alert";
import DataTable from "react-data-table-component";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";

// for task type created customoption function

const CustomOption = ({ label, options, onClick, closeDropdown }) => {
  const [expanded, setExpanded] = useState(false);
  const [openOptions, setOpenOptions] = useState([]);

  const handleClick = (e) => {
    setExpanded(!expanded);
    onClick(label);
    closeDropdown(); // Close the dropdown after clicking the option
  };

  const handleSelect = () => {
    setOpenOptions([]);
  };

  return (
    <div
      style={{
        padding: "8px",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      {label}
      {expanded && options && (
        <div style={{ marginLeft: "20px" }}>
          {options.map((option) => (
            <CustomOption
              key={option.label}
              label={option.label}
              options={option.options}
              onClick={handleSelect}
              ID={option.ID}
              openOptions={openOptions}
              closeDropdown={closeDropdown} // Pass closeDropdown to nested options
            />
          ))}
        </div>
      )}
    </div>
  );
};

//for ticket type created customeOptionTicket function

const CustomOptionTicket = ({ label, options, onClick, closeDropdown }) => {
  const [expanded, setExpanded] = useState(false);
  const handleClick = (e) => {
    setExpanded(!expanded);
    onClick(label);
    closeDropdown(); // Close the dropdown after clicking the option
  };

  return (
    <div
      style={{
        padding: "8px",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      {label}
      {expanded && options && (
        <div style={{ marginLeft: "20px" }}>
          {options.map((option) => (
            <CustomOptionTicket
              key={option.label}
              label={option.label}
              options={option.options}
              onClick={onClick}
              ID={option.ID}
              closeDropdown={closeDropdown} // Pass closeDropdown to nested options
            />
          ))}
        </div>
      )}
    </div>
  );
};

//for task type created CustomMenuList function

const CustomMenuList = ({ options, onSelect, ID }) => {
  const [openOptions, setOpenOptions] = useState([]);

  const toggleOptions = (label) => {
    if (openOptions.includes(label)) {
      setOpenOptions(openOptions.filter((item) => item !== label));
    } else {
      setOpenOptions([...openOptions, label]);
    }
  };

  const closeDropdown = () => {
    setOpenOptions([]); // Close the dropdown by resetting openOptions
  };

  // const handleSelect = (label, ID) => {
  //   onSelect(label, ID); // Pass the label and ID to the provided onSelect function
  // };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSelect = (label, ID, openOptions) => {
    // Close all open options except the one that was just selected
    setOpenOptions([]);
    closeDropdown();
    setIsMenuOpen(!isMenuOpen);
    // Pass the label and ID to the provided onSelect function
    onSelect(label, ID);
  };

  const renderOptions = (options) => {
    return options.map((option) => (
      <React.Fragment key={option.label}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #ccc",
            fontWeight:
              option.label === "Primary" || option.options.length > 0
                ? "bold"
                : "normal",
          }}
        >
          {option.options.length > 0 && (
            <i
              className="icofont-rounded-right"
              style={{ marginRight: "5px", cursor: "pointer" }}
              onClick={() => toggleOptions(option.label)}
            ></i>
          )}

          <CustomOption
            label={option.label}
            options={option.options}
            onClick={handleSelect}
            openOptions={options}
            isMenuOpen={isMenuOpen}
            ID={option.ID}
            closeDropdown={closeDropdown} // Pass closeDropdown to CustomOption
          />
        </div>
        {openOptions &&
          openOptions.length > 0 &&
          openOptions.includes(option.label) &&
          option.options && (
            <div style={{ marginLeft: "20px" }}>
              {renderOptions(option.options)}
            </div>
          )}
      </React.Fragment>
    ));
  };

  return (
    <>
      {isMenuOpen === false && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            width: "100%", // Adjust the width here
            maxHeight: "400px", // Adjust the maxHeight here
            overflowY: "auto",
            border: "1px solid #ccc", // Border style
            borderWidth: "2px", // Border width
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Box shadow
            backgroundColor: "white",
            borderBottomRightRadius: "4px", // Border radius
            borderBottomLeftRadius: "4px", // Border radius
          }}
        >
          {renderOptions(options)}
        </div>
      )}
    </>
  );
};

//for ticket type created CustomMenuListTicket  function

const CustomMenuListTicket = ({ options, onSelect, ID, selectedOptionId }) => {
  const [openOptions, setOpenOptions] = useState([]);

  const toggleOptions = (label) => {
    if (openOptions.includes(label)) {
      setOpenOptions(openOptions.filter((item) => item !== label));
    } else {
      setOpenOptions([...openOptions, label]);
    }
  };

  const closeDropdown = () => {
    setOpenOptions([]); // Close the dropdown by resetting openOptions
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSelect = (label, ID, openOptions) => {
    // Close all open options except the one that was just selected
    setOpenOptions([]);
    closeDropdown();
    setIsMenuOpen(!isMenuOpen);
    // Pass the label and ID to the provided onSelect function
    onSelect(label, ID);
  };
  const renderOptions = (options) => {
    return options.map((option) => (
      <React.Fragment key={option.label}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #ccc",
            fontWeight:
              option.label === "Primary" || option.options.length > 0
                ? "bold"
                : "normal",
          }}
        >
          {option.options.length > 0 && (
            <i
              className="icofont-rounded-right"
              style={{
                marginRight: "5px",
                cursor: "pointer",
              }}
              onClick={() => toggleOptions(option.label)}
            ></i>
          )}
          <CustomOptionTicket
            label={option.label}
            options={option.options}
            onClick={handleSelect}
            ID={option.ID}
            closeDropdown={closeDropdown} // Pass closeDropdown to CustomOption
          />
        </div>
        {openOptions.includes(option.label) && option.options && (
          <div style={{ marginLeft: "20px" }}>
            {renderOptions(option.options)}
          </div>
        )}
      </React.Fragment>
    ));
  };

  return (
    <>
      {isMenuOpen === false && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            width: "100%", // Adjust the width here
            maxHeight: "400px", // Adjust the maxHeight here
            overflowY: "auto",
            border: "1px solid #ccc", // Border style
            borderWidth: "2px", // Border width
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Box shadow
            backgroundColor: "white",
            borderBottomRightRadius: "4px", // Border radius
            borderBottomLeftRadius: "4px", // Border radius
          }}
        >
          {renderOptions(options)}
        </div>
      )}
    </>
  );
};

function TaskAndTicketTypeMaster(props) {
  const [selectedValue, setSelectedValue] = useState("");
  const [notify, setNotify] = useState();
  const [data, setData] = useState([]);
  const [parent, setParent] = useState();
  const [taskData, setTaskData] = useState([]);
  const [ticketData, setTicketData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [exportData, setExportData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const handleSelect = (label, ID, isMenuOpen) => {
    setSelectedOption(selectedOption === label ? null : label);
    setSelectedOptionId(label);
    closeAllDropdowns();
  };
  const toggleDropdown = (e) => {
    setIsOpen(!isOpen);
  };

  const closeAllDropdowns = () => {
    // Logic to close all dropdowns
    // For example, you could set a state variable to trigger re-rendering
  };

  const typeRef = useRef(null);

  const typeNameRef = useRef(null);

  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });
  const dropdownData = [
    { value: "TASK", label: "TASK" },
    { value: "TICKET", label: "TICKET" },
  ];
  const loadData = async () => {
    const exportTempData = [];

    await new TaskTicketTypeService()
      .getAllTaskTicketType("TASK")
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            let counter = 1;
            var tempData = [];
            const temp = res.data.data;
            for (const key in temp) {
              tempData.push({
                counter: counter++,
                id: temp[key].id,
                type: temp[key].type,
                parent_id: temp[key].parent_id,
                type_name: temp[key].type_name,
                remark: temp[key].remark,
                is_active: temp[key].is_active,
                created_at: temp[key].created_at,
                created_by: temp[key].created_by,
                updated_at: temp[key].updated_at,
                updated_by: temp[key].updated_by,
              });
            }
            setData(null);
            setData(tempData);
            for (const i in temp) {
              exportTempData.push({
                SrNo: exportTempData.length + 1,

                id: temp[i].id,
                type: temp[i].type,

                parent_name: temp[i].parent_name,
                type_name: temp[i].type_name,
                remark: temp[i].remark,
                is_active: temp[i].is_active,
                created_at: temp[i].created_at,
                created_by: temp[i].created_by,
                updated_at: temp[i].updated_at,
                updated_by: temp[i].updated_by,
              });
            }

            setExportData(null);

            setExportData(exportTempData);
          }
        }
      });

    // await new TaskTicketTypeService()
    //   .getAllTaskTicketType(selectedType)
    //   .then((res) => {
    //     if (res.status === 200) {
    //       if (res.data.status == 1) {
    //         let counter = 1;
    //         var tempData = [];
    //         const temp = res.data.data;
    //         console.log("resData", temp);
    //         for (const key in temp) {
    //           tempData.push({
    //             counter: counter++,
    //             id: temp[key].id,
    //             type: temp[key].type,
    //             parent_id: temp[key].parent_id,
    //             type_name: temp[key].type_name,
    //             remark: temp[key].remark,
    //             is_active: temp[key].is_active,
    //             created_at: temp[key].created_at,
    //             created_by: temp[key].created_by,
    //             updated_at: temp[key].updated_at,
    //             updated_by: temp[key].updated_by,
    //           });
    //         }
    //         setData(null);
    //         setData(tempData);
    //         for (const i in temp) {
    //           exportTempData.push({
    //             SrNo: exportTempData.length + 1,

    //             id: temp[i].id,
    //             type: temp[i].type,

    //             parent_name: temp[i].parent_name,
    //             type_name: temp[i].type_name,
    //             remark: temp[i].remark,
    //             is_active: temp[i].is_active,
    //             created_at: temp[i].created_at,
    //             created_by: temp[i].created_by,
    //             updated_at: temp[i].updated_at,
    //             updated_by: temp[i].updated_by,
    //           });
    //         }

    //         setExportData(null);

    //         setExportData(exportTempData);
    //       }
    //     }
    //   });

    // await new TaskTicketTypeService().getAllType().then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       let counter = 1;
    //       var tempData = [];
    //       const temp = res.data.data;

    //       for (const key in temp) {
    //         if (temp[key].type === "TASK" && selectedType === "TASK") {
    //           tempData.push({
    //             counter: counter++,
    //             id: temp[key].id,
    //             type: temp[key].type,
    //             parent_id: temp[key].parent_id,
    //             type_name: temp[key].type_name,
    //             remark: temp[key].remark,
    //             is_active: temp[key].is_active,
    //             created_at: temp[key].created_at,
    //             created_by: temp[key].created_by,
    //             updated_at: temp[key].updated_at,
    //             updated_by: temp[key].updated_by,
    //           });
    //         } else if (
    //           temp[key].type === "TICKET" &&
    //           selectedType === "TICKET"
    //         ) {
    //           tempData.push({
    //             counter: counter++,
    //             id: temp[key].id,
    //             type: temp[key].type,
    //             parent_id: temp[key].parent_id,
    //             type_name: temp[key].type_name,
    //             remark: temp[key].remark,
    //             is_active: temp[key].is_active,
    //             created_at: temp[key].created_at,
    //             created_by: temp[key].created_by,
    //             updated_at: temp[key].updated_at,
    //             updated_by: temp[key].updated_by,
    //           });
    //         }
    //       }
    //       setData(null);
    //       setData(tempData);
    //       for (const i in temp) {
    //         exportTempData.push({
    //           SrNo: exportTempData.length + 1,

    //           id: temp[i].id,
    //           type: temp[i].type,

    //           parent_name: temp[i].parent_name,
    //           type_name: temp[i].type_name,
    //           remark: temp[i].remark,
    //           is_active: temp[i].is_active,
    //           created_at: temp[i].created_at,
    //           created_by: temp[i].created_by,
    //           updated_at: temp[i].updated_at,
    //           updated_by: temp[i].updated_by,
    //         });
    //       }

    //       setExportData(null);

    //       setExportData(exportTempData);
    //     }
    //   }
    // });

    await new TaskTicketTypeService().getParent().then((res) => {
      if (res.status === 200) {
        const mappedData = res.data.data.map((d) => ({
          value: d.id,
          label: d.type_name,
        }));
        setParent(mappedData);
      } else {
      }
    });

    await new TaskTicketTypeService()?.getTaskType()?.then((res) => {
      if (res?.status === 200) {
        setTaskData(res?.data?.data);
      }
    });

    await new TaskTicketTypeService()?.getTicketType()?.then((res) => {
      if (res?.status === 200) {
        setTicketData(res?.data?.data);
      }
    });
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSelectOptionClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // function transformData(taskData) {
  //   return taskData.map((item) => {
  //     const label = item.type_name;

  //     const options =
  //       item.children && item.children.length > 0
  //         ? item.children.map((child) => ({
  //             value: child.id,
  //             label: child.type_name,
  //             options: transformData(child.children), // Recursively process children
  //           }))
  //         : [];

  //     const ID = item.parent_id;
  //     return { ID, label, options };
  //   });
  // }
  // // Transform the taskData
  // const transformedOptions = transformData(taskData);

  // function transformData(taskData) {
  //   const primaryLabel = "Primary";

  //   const options = [];

  //   // Push the primary label separately
  //   options.push({
  //     ID: null,
  //     label: primaryLabel,
  //     isStatic: true,
  //     options: [],
  //   });

  //   // Process the taskData
  //   taskData?.forEach((item) => {
  //     const label = item.type_name;

  //     if (label !== primaryLabel) {
  //       // Push API labels directly into options array
  //       options.push({
  //         ID: item.parent_id,
  //         label: label,
  //         options: item.children ? transformData(item.children) : [],
  //       });
  //     } else {
  //       // Skip pushing the primary label into its own options array
  //       return;
  //     }
  //   });

  //   return options;
  // }

  // const transformedOptions = transformData(taskData);

  function transformData(taskData, hasPrimaryLabel = false) {
    const primaryLabel = "Primary";
    const options = [];

    // Push the primary label if it hasn't been pushed before
    if (!hasPrimaryLabel) {
      options.push({
        ID: null,
        label: primaryLabel,
        isStatic: true,
        options: [],
      });
      hasPrimaryLabel = true; // Update the flag to indicate primary label has been added
    }

    // Process the taskData
    taskData?.forEach((item) => {
      const label = item.type_name;

      if (label !== primaryLabel) {
        // Push API labels directly into options array
        options.push({
          ID: item.parent_id,
          label: label,
          options: item.children
            ? transformData(item.children, hasPrimaryLabel)
            : [],
        });
      }
    });

    return options;
  }

  // Transform the taskData
  const transformedOptions = transformData(taskData);

  // function transformDataTicket(ticketData) {
  //   const primaryLabel = "Primary";

  //   const options = [];

  //   // Push the primary label separately
  //   options.push({
  //     ID: null,
  //     label: primaryLabel,
  //     isStatic: true,
  //     options: [],
  //   });

  //   // Process the taskData
  //   ticketData?.forEach((item) => {
  //     const label = item.type_name;

  //     if (label !== primaryLabel) {
  //       // Push API labels directly into options array
  //       options.push({
  //         ID: item.parent_id,
  //         label: label,
  //         options: item.children ? transformDataTicket(item.children) : [],
  //       });
  //     } else {
  //       // Skip pushing the primary label into its own options array
  //       return;
  //     }
  //   });

  //   return options;
  // }

  // const transformedOptionsTicket = transformDataTicket(ticketData);

  function transformDataTicket(ticketData, hasPrimaryLabel = false) {
    const primaryLabel = "Primary";
    const options = [];

    // Push the primary label if it hasn't been pushed before
    if (!hasPrimaryLabel) {
      options.push({
        ID: null,
        label: primaryLabel,
        isStatic: true,
        options: [],
      });
      hasPrimaryLabel = true; // Update the flag to indicate primary label has been added
    }

    // Process the ticketData
    ticketData?.forEach((item) => {
      const label = item.type_name;

      if (label !== primaryLabel) {
        // Push API labels directly into options array
        options.push({
          ID: item.parent_id,
          label: label,
          options: item.children
            ? transformDataTicket(item.children, hasPrimaryLabel)
            : [],
        });
      }
    });

    return options;
  }

  // Transform the ticketData
  const transformedOptionsTicket = transformDataTicket(ticketData);

  // function transformDataTicket(ticketData) {
  //   return ticketData.map((item) => {
  //     const label = item.type_name;

  //     const options =
  //       item.children && item.children.length > 0
  //         ? item.children.map((child) => ({
  //             value: child.id,
  //             label: child.type_name,
  //             options: transformDataTicket(child.children), // Recursively process children
  //           }))
  //         : [];

  //     const ID = item.parent_id;
  //     return { ID, label, options };
  //   });
  // }
  // Transform the taskData

  const [expandedRows, setExpandedRows] = useState([]);

  const handleRowExpandToggle = (row) => {
    const isRowExpanded = expandedRows.includes(row.id);
    const newExpandedRows = isRowExpanded
      ? expandedRows.filter((id) => id !== row.id)
      : [...expandedRows, row.id];
    setExpandedRows(newExpandedRows);
  };

  const [selectedType, setSelectedType] = useState("TASK"); // State to track selected type
  const handleType = async (e) => {
    setData([]);
    setSelectedType(e.target.value); // Update the selected type when a radio button is clicked
    await new TaskTicketTypeService()
      .getAllTaskTicketType(e.target.value)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            let counter = 1;
            var tempData = [];
            const temp = res.data.data;
            for (const key in temp) {
              tempData.push({
                counter: counter++,
                id: temp[key].id,
                type: temp[key].type,
                parent_id: temp[key].parent_id,
                type_name: temp[key].type_name,
                remark: temp[key].remark,
                is_active: temp[key].is_active,
                created_at: temp[key].created_at,
                created_by: temp[key].created_by,
                updated_at: temp[key].updated_at,
                updated_by: temp[key].updated_by,
              });
            }
            setData(null);
            setData(tempData);
            let exportTempData = [];
            for (const i in temp) {
              exportTempData.push({
                SrNo: exportTempData.length + 1,

                id: temp[i].id,
                type: temp[i].type,

                parent_name: temp[i].parent_name,
                type_name: temp[i].type_name,
                remark: temp[i].remark,
                is_active: temp[i].is_active,
                created_at: temp[i].created_at,
                created_by: temp[i].created_by,
                updated_at: temp[i].updated_at,
                updated_by: temp[i].updated_by,
              });
            }

            setExportData(null);

            setExportData(exportTempData);
          }
        }
      });
  };

  const columns = [
    {
      name: "Action",
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#edit"
            onClick={(e) => {
              // if (!selectedType) {
              //   alert("Please select a type first");
              //   return; // Exit the function if selectedType is not selected
              // }
              const modalHeader =
                selectedType === "TASK" ? "Edit Task Type" : "Edit Ticket Type";
              handleModal({
                showModal: true,
                modalData: row,
                modalHeader: modalHeader,
              });
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
        </div>
      ),
    },
    {
      name: "Sr.No",
      selector: (row) => row.counter,
      sortable: true,
    },

    {
      name: "Type",
      // selectedType === "TASK" ? "Task Type" : "Ticket Type",
      selector: (row) => row.type,

      sortable: true,
      width: "125px",
    },
    {
      name: "Parent",
      width: "150px",
      cell: (row) => {
        if (parent) {
          const parent_name =
            parent &&
            parent

              ?.filter((d) => d.value == row.parent_id)
              .map((d) => ({ value: d.value, label: d.label }));
          return <span>{parent_name[0]?.label}</span>;
        }
      },
    },
    {
      name: "Type Name",
      selector: (row) => row.type_name,
      sortable: true,
      width: "125px",
    },

    {
      name: "Status",
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_active == 1 && (
            <span className="badge bg-primary" style={{ width: "4rem" }}>
              Active
            </span>
          )}
          {row.is_active == 0 && (
            <span className="badge bg-danger" style={{ width: "4rem" }}>
              Deactive
            </span>
          )}
        </div>
      ),
    },
    {
      name: "Created At",
      selector: (row) => row.created_at,
      sortable: true,
      width: "175px",
    },
    {
      name: "Created By",
      selector: (row) => row.created_by,
      sortable: true,
      width: "150px",
    },
    {
      name: "Updated At",
      selector: (row) => row.updated_at,
      sortable: true,
      width: "175px",
    },
    {
      name: "Updated By",
      selector: (row) => row.updated_by,
      sortable: true,
      width: "150px",
    },
  ];
  const searchRef = useRef();

  function searchInData(data, search) {
    const lowercaseSearch = search.toLowerCase();

    return data.filter((d) => {
      for (const key in d) {
        if (
          typeof d[key] === "string" &&
          d[key].toLowerCase().includes(lowercaseSearch)
        ) {
          return true;
        }
      }
      return false;
    });
  }

  const handleSearch = () => {
    const searchValue = searchRef.current.value;
    const result = searchInData(data, searchValue);
    setData(result);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  const handleButtonClick = (e) => {
    setModal({ showModal: false });
  };

  const handleModal = (data) => {
    setModal(data);
  };

  const handleDropdownChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleForm = (id) => async (e) => {
    e.preventDefault();

    // if (!id) {
    //   if (selectedValue === "") {
    //     alert("Type is required.");
    //     return;
    //   }
    // }
    if (id) {
      if (modal.modalData.type === "") {
        alert("Type is required.");
        return;
      }
    }
    setNotify(null);
    const form = new FormData(e.target);
    if (selectedOptionId === "Primary") {
      form.append("parent_id", 0);
    } else {
      form.append("parent_id", selectedOptionId);
    }
    form.append("type", selectedType);

    if (!id) {
      await new TaskTicketTypeService().postType(form).then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            setNotify({ type: "success", message: res.data.message });
            setModal({ showModal: false });
            loadData();
          } else {
            setNotify({ type: "danger", message: res.data.message });
          }
        } else {
          setNotify({ type: "danger", message: res.data.message });
        }
      });
    } else {
      await new TaskTicketTypeService()._updateType(id, form).then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setNotify({ type: "success", message: res.data.message });
            setModal({ showModal: false });
            loadData();
          } else {
            setNotify({ type: "danger", message: res.data.message });
          }
        } else {
          // setLoading(false);
          setNotify({ type: "danger", message: res.data.message });
        }
      });
    }
    // setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container-xxl">
      {notify && (
        <>
          {" "}
          <Alert alertData={notify} />{" "}
        </>
      )}
      <PageHeader
        headerTitle="Ticket And Task Type Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              <button
                className="btn btn-dark btn-set-task w-sm-100"
                // onClick={() => {
                //   handleModal({
                //     showModal: true,
                //     modalData: "",
                //     modalHeader:  {selectedType && selectedType === "task" ?  "Add Task Type" : "Add Ticket Type"}
                //   });
                //   setSelectedValue("");
                // }}

                onClick={() => {
                  if (!selectedType) {
                    alert("Please select a type first");
                    return; // Exit the function if selectedType is not selected
                  }
                  const modalHeader =
                    selectedType === "TASK"
                      ? "Add Task Type"
                      : "Add Ticket Type";
                  handleModal({
                    showModal: true,
                    modalData: "",
                    modalHeader: modalHeader,
                  });
                  setSelectedValue(""); // Reset any selected value if needed
                }}
              >
                <i className="icofont-plus-circle me-2 fs-6"></i>Add
              </button>
            </div>
          );
        }}
      />

      <div>
        <div className="row">
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              placeholder="Search by State Name...."
              ref={searchRef}
              // onKeyDown={handleKeyDown}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-sm btn-warning text-white"
              type="button"
              value={searchTerm}
              onClick={() => handleSearch(searchTerm)}
              style={{ marginTop: "0px", fontWeight: "600" }}
            >
              <i className="icofont-search-1 "></i> Search
            </button>
            <button
              className="btn btn-sm btn-info text-white"
              type="button"
              onClick={() => window.location.reload(false)}
              style={{ marginTop: "0px", fontWeight: "600" }}
            >
              <i className="icofont-refresh text-white"></i> Reset
            </button>
            <ExportToExcel
              className="btn btn-sm btn-danger"
              apiData={exportData}
              fileName="State master Records"
            />
          </div>
        </div>
      </div>

      <div className="col-sm-8 mt-3">
        <div className="row">
          <div className="col-md-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="type"
                id="TASK"
                value="TASK"
                onClick={(e) => handleType(e)}
                checked={selectedType === "TASK"} // Set checked based on selected type
              />
              <label className="form-check-label" htmlFor="TASK">
                Task Type
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="type"
                id="TICKET"
                value="TICKET"
                onClick={(e) => handleType(e)}
                checked={selectedType === "TICKET"} // Set checked based on selected type
              />
              <label className="form-check-label" htmlFor="TICKET">
                Ticket Type
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Modal For Add and Edit Data */}
      <Modal
        centered
        show={modal.showModal}
        onHide={(e) => {
          handleModal({
            showModal: false,
            modalData: "",
            modalHeader: "",
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            method="post"
            onSubmit={handleForm(modal.modalData ? modal.modalData.id : "")}
          >
            <div className="deadline-form">
              <div className="row g-3 mb-3">
                {selectedType && selectedType === "TICKET" ? (
                  <div>
                    <div>
                      <label
                        className="form-label font-weight-bold"
                        readOnly={true}
                      >
                        Parent ticket Type: <Astrick color="red" size="13px" />
                      </label>

                      <div>
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              padding: "8px",
                              border: "1px solid #ccc",
                              cursor: "pointer",
                              width: "100%",
                              borderRadius: "1px",
                            }}
                            onClick={(e) => handleSelectOptionClick(e)}
                          >
                            {selectedOption
                              ? selectedOption
                              : "Select an option"}
                          </div>
                          {isMenuOpen && (
                            <div
                              style={{
                                position: "absolute",
                                width: "100%", // Set the width to 100% to match the parent's width
                                top: "100%",
                              }}
                            >
                              <CustomMenuListTicket
                                options={transformedOptionsTicket}
                                onSelect={(label, ID) =>
                                  handleSelect(label, ID)
                                }
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-sm-12 mt-2">
                        <label className="form-label font-weight-bold">
                          Ticket Type Name :<Astrick color="red" size="13px" />
                        </label>

                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="type_name"
                          name="type_name"
                          ref={typeNameRef}
                          required
                          defaultValue={
                            modal.modalData && modal?.modalData?.type_name
                          }
                        />
                      </div>

                      <div className="col-sm-12 mt-2">
                        <label className="form-label font-weight-bold">
                          Remark :
                        </label>
                        <textarea
                          type="text"
                          rows={4}
                          className="form-control form-control-sm"
                          id="remark"
                          name="remark"
                          defaultValue={
                            modal.modalData && modal.modalData.remark
                          }
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label
                      className="form-label font-weight-bold"
                      readOnly={true}
                    >
                      Parent Task Type: <Astrick color="red" size="13px" />
                    </label>

                    <div>
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            padding: "8px",
                            border: "1px solid #ccc",
                            cursor: "pointer",
                            width: "100%",
                            borderRadius: "1px",
                          }}
                          onClick={(e) => handleSelectOptionClick(e)}
                        >
                          {selectedOption ? selectedOption : "Select an option"}
                        </div>

                        {isMenuOpen && (
                          <div
                            style={{
                              position: "absolute",
                              width: "100%", // Set the width to 100% to match the parent's width
                              top: "100%",
                            }}
                          >
                            <CustomMenuList
                              options={transformedOptions}
                              onSelect={(label, ID) => handleSelect(label, ID)}
                              closeAllDropdowns={closeAllDropdowns}
                              isMenuOpen={isMenuOpen}
                              onClick={(e) => handleSelectOptionClick(e)}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-sm-12 mt-2">
                      <label className="form-label font-weight-bold">
                        Task Type Name :<Astrick color="red" size="13px" />
                      </label>

                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="type_name"
                        name="type_name"
                        ref={typeNameRef}
                        required
                        defaultValue={
                          modal.modalData && modal?.modalData?.type_name
                        }
                      />
                    </div>

                    <div className="col-sm-12 mt-2">
                      <label className="form-label font-weight-bold">
                        Remark :
                      </label>
                      <textarea
                        type="text"
                        rows={4}
                        className="form-control form-control-sm"
                        id="remark"
                        name="remark"
                        defaultValue={modal.modalData && modal.modalData.remark}
                      />
                    </div>
                  </div>
                )}

                <>
                  {modal.modalData && (
                    <div className="col-sm-12">
                      <label className="form-label font-weight-bold">
                        Status :<Astrick color="red" size="13px" />
                      </label>
                      <div className="row">
                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="is_active"
                              id="is_active_1"
                              value="1"
                              defaultChecked={
                                modal.modalData &&
                                modal.modalData.is_active === 1
                                  ? true
                                  : !modal.modalData
                                  ? true
                                  : false
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="is_active_1"
                            >
                              Active
                            </label>
                          </div>
                        </div>
                        <div className="col-md-1">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="is_active"
                              id="is_active_0"
                              value="0"
                              readOnly={modal.modalData ? false : true}
                              defaultChecked={
                                modal.modalData &&
                                modal.modalData.is_active === 0
                                  ? true
                                  : false
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="is_active_0"
                            >
                              Deactive
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              </div>
            </div>
            <Modal.Footer>
              <ButtonComponent
                type="submit"
                text={modal?.modalData ? "Update" : "Submit"}
              />
              <ButtonComponent
                type="button"
                buttonColor="danger"
                textColor="white"
                getClick={handleButtonClick}
                text="Cancel"
              />
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {data && (
                <DataTable
                  columns={columns}
                  // data={data}
                  data={data.filter((customer) => {
                    if (typeof searchTerm === "string") {
                      if (typeof customer === "string") {
                        return customer
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase());
                      } else if (typeof customer === "object") {
                        return Object.values(customer).some(
                          (value) =>
                            typeof value === "string" &&
                            value
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        );
                      }
                    }
                    return false;
                  })}
                  defaultSortField="title"
                  pagination
                  selectableRows={false}
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskAndTicketTypeMaster;
