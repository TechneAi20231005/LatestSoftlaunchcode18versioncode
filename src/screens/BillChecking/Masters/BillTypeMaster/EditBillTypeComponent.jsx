import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Button, Table, Form } from "react-bootstrap";
import PageHeader from "../../../../components/Common/PageHeader";
import Select from "react-select";
import { Astrick } from "../../../../components/Utilities/Style";
import UserService from "../../../../services/MastersService/UserService";
import * as Validation from "../../../../components/Utilities/Validation";
import BillTypeMasterService from "../../../../services/Bill Checking/Masters/BillTypeMasterService";
import { Link, useNavigate, useParams } from "react-router-dom";
import Alert from "../../../../components/Common/Alert";
import { _base } from "../../../../settings/constants";
import "./styles.css"; // Import your CSS file

const EditBillTypeComponent = ({ match }) => {
  const history = useNavigate();

  const {id} =useParams()
  const  BillId =id
  const [approverData, setApproverData] = useState({
    data: [
      {
        amount: null,
        slab: 1,
        level: [
          {
            bill_approval_level: 1,
            employee_id: null,
            required_users: null,
            required_numbers: null,
          },
        ],
      },
    ],
  });
  const [billTypeData, setBilltypeData] = useState();
  const [notify, setNotify] = useState();
  const selectAddRequiredUserRefs = useRef([]);
  const [userData, setUserData] = useState();
  const [assignedUserData, setAssignedUserData] = useState();
  const [requiredUserData, setRequiredUserData] = useState();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedUsersArray, setSelectedUsersArray] = useState([]);
  const inputRefs = useRef([]);
  const select1Refs = useRef([]);

  // Function for add new slab
  const handleIncrement = (e, index) => {
    const newData = [...approverData.data];
    var firstAmount = newData[index].amount;
    if (isNaN(firstAmount)) {
      firstAmount = 0.0;
    }
    if (firstAmount === null || firstAmount === 0) {
      alert("Please enter an amount first.");
      return;
    }

    // Use a for loop to check the new amount against all existing amounts
    for (let i = 0; i < newData.length; i++) {
      if (i === index) {
        // Skip the current slab
        continue;
      }

      // Check if the new amount is greater than or equal to the previous amount
      if (i === newData.length - 1 && firstAmount >= newData[i].amount) {
        // The last slab can have the same amount as the previous one
        continue;
      }
      if (firstAmount <= newData[i].amount) {
        if (firstAmount >= newData[i].amount) {
          alert(
            `Amount in section ${
              index + 1
            } should be greater than the previous tab.`
          );
          return; // Exit the function without adding a new slab
        }
      }
    }

    // Calculate the new amount based on the previous section
    const previousSection = newData[newData.length - 1];
    const newAmount = previousSection ? previousSection.amount || 0 : 1;

    // Create a new section with the calculated amount
    const newSection = {
      amount: firstAmount,
      slab: newData.length + 1,
      level: [
        {
          bill_approval_level: 1,
          employee_id: null,
          required_users: null,
          required_numbers: null,
        },
      ],
    };

    // Insert the new section in between the current and the next section
    if (index < newData.length - 1) {
      newData.splice(index + 1, 0, newSection);
    } else {
      // If index is the last section, simply add the new section to the end
      newData.push(newSection);
    }

    // Reindex the sections
    for (let i = 0; i < newData.length; i++) {
      newData[i].slab = i + 1;
    }
    setApproverData({ data: newData });
  };
  //Created By Rushikesh harkare 12/10/2023

  // Function for add assigned person Data into main state
  const handleAssignedToPerson = (selectedOptions) => {
    const newData = [...approverData.data];

    // Use map to update each object's assignToUser property
    const updatedData = newData.map((d) => ({
      ...d,
      assignToUser: selectedOptions.map((option) => option.value),
    }));

    // Set the updated array as the new state
    setApproverData({ data: updatedData });
  };
  //Created By Rushikesh harkare 12/10/2023

  // Function for add new row in each slab
  const handleAddRow = (sectionIndex) => {
    const newData = [...approverData.data];

    // Add a new row to the specified section's level
    newData[sectionIndex].level.push({
      bill_approval_level: newData[sectionIndex].level.length + 1,
      employee_id: null,
      required_users: null,
      required_numbers: null,
    });

    // Push an empty array for the new row in selectedUsersArray
    const updatedSelectedUsersArray = [...selectedUsersArray];
    if (!updatedSelectedUsersArray[sectionIndex]) {
      updatedSelectedUsersArray[sectionIndex] = [];
    }
    updatedSelectedUsersArray[sectionIndex].push([]);

    // Update both state values
    setApproverData({ data: newData });
    setSelectedUsersArray(updatedSelectedUsersArray);
  };
  //Created By Rushikesh harkare 12/10/2023

  //Function For Remove Row From Each Slab
  const handleRemoveRow = (sectionIndex, rowIndex) => {
    const newData = [...approverData.data];
    newData[sectionIndex].level.splice(rowIndex, 1);
    setApproverData({ data: newData });
  };
  //Created By Rushikesh harkare 12/10/2023

// Function To Remove Slab
  const handleRemoveSection = (indexToRemove) => {
    const newData = [...approverData.data];

    // Remove the section at the specified index
    newData.splice(indexToRemove, 1);

    // Reindex the remaining sections
    newData.forEach((section, index) => {
      section.slab = index + 1;
    });

    // Check if there is at least one section left
    if (newData.length > 0) {
      // Update the last section's amount to match the second last section's amount
      const lastIndex = newData.length - 1;
      const secondLastIndex = lastIndex;
      newData[lastIndex].amount = newData[secondLastIndex].amount;
    }
    if (newData.length >= 2) {
      // Update the last section's amount to match the second last section's amount
      const lastIndex = newData.length - 1;
      const secondLastIndex = lastIndex - 1;
      newData[lastIndex].amount = newData[secondLastIndex].amount;
    }

    // Update the state with the modified data
    setApproverData({ data: newData });
  };
//Created By Rushikesh harkare 12/10/2023

//Function for on Changing amount update in state
  const handleAmountChange = (index, value) => {
    const newData = [...approverData.data];
    var amountValue = parseFloat(value);

    // Ensure the value is a valid number and greater than or equal to 0
    if (isNaN(amountValue)) {
      amountValue = 0.0;
    }
    // Round the amount to two decimal places
    amountValue = parseFloat(amountValue.toFixed(2));

    newData[index].amount = amountValue;
    setApproverData({ data: newData });

    if (index === newData.length - 2) {
      // Automatically set the last section's amount to the same value
      newData[index + 1].amount = amountValue;
      setApproverData({ data: newData });
    }
  };
//Created By Rushikesh harkare 12/10/2023

//Validation For amount 
// const validateAmounts = (e, index) => {
//   const slabsData = approverData.data;
//   const numSlabs = slabsData.length;

//   // Check if the input value has changed
//   if (e.target.value === slabsData[index].amount) {
//     return; // Exit the function if the value hasn't changed
//   }

//   // Update the current slab's amount
//   const newValue = parseFloat(e.target.value);

//   if (index === 0) {
//     // Special case for the last index
//     const previousAmount = index === 0 ? slabsData[index+1].amount :slabsData[index - 1].amount;
//     if (index === 0 && newValue > previousAmount) {
//       alert(
//         `Amount in section ${
//           index + 1
//         } should not be greater than the previous tab`
//       );
//       e.target.value = previousAmount;
//       slabsData[index].amount = previousAmount;
//       newValue = previousAmount;
//     }else {
//       // Update the last slab's amount
//       slabsData[index].amount = newValue;
//     }
//     if (index > 0 && newValue < previousAmount) {
//       alert(
//         `Amount in section ${
//           index + 1
//         } should be greater than the previous tab`
//       );
//       e.target.value = previousAmount;
//       slabsData[index].amount = previousAmount;
//     } else {
//       // Update the last slab's amount
//       slabsData[index].amount = newValue;
//     }
//   } else {
//     // For all other indices
//     const previousAmount = slabsData[index - 1].amount;
//     const nextAmount = slabsData[index + 1].amount;

//     if (index === numSlabs - 2) {
//       // Special case for the second-last index
//       if (newValue < previousAmount) {
//         alert(
//           `Amount in section ${
//             index + 1
//           } should be greater than the previous tab`
//         );
//         e.target.value = previousAmount;
//         slabsData[index].amount = previousAmount;
//         slabsData[index + 1].amount = previousAmount;
//       } else {
//         // Update the current slab's amount
//         slabsData[index].amount = newValue;
//       }
//     } else {
//       // For all other indices except the last and second-last
//       if (newValue <= previousAmount || newValue >= nextAmount) {
//         alert(
//           `Amount in section ${
//             index + 1
//           } should be greater than the previous tab and less than the next tab`
//         );
//         e.target.value = previousAmount;
//         slabsData[index].amount = previousAmount;
//       } else {
//         // Update the current slab's amount
//         slabsData[index].amount = newValue;
//       }
//     }
//   }

//   // Update the state with the modified data
//   setApproverData({ data: slabsData });
// };





//Validation For amount
const validateAmounts = (e, index) => {
  const slabsData = approverData.data;
  const numSlabs = slabsData.length;

  // Check if the input value has changed
  if (e.target.value === slabsData[index].amount) {
    return; // Exit the function if the value hasn't changed
  }

  // Update the current slab's amount
  const newValue = parseFloat(e.target.value);

  if (index === 0) {
    // Special case for the last index
    const previousAmount = index === 0 ? slabsData[index+1].amount :slabsData[index - 1].amount;
    if (index === 0 && newValue > previousAmount) {
      alert(
        `Amount in section ${
          index + 1
        } should not be greater than the previous tab`
      );
      e.target.value = previousAmount;
      slabsData[index].amount = previousAmount;
      newValue = previousAmount;
    }else {
      // Update the last slab's amount
      slabsData[index].amount = newValue;
    }
    if (index > 0 && newValue < previousAmount) {
      alert(
        `Amount in section ${
          index + 1
        } should be greater than the previous tab`
      );
      e.target.value = previousAmount;
      slabsData[index].amount = previousAmount;
    } else {
      // Update the last slab's amount
      slabsData[index].amount = newValue;
    }
  } else {
    // For all other indices
    const previousAmount = slabsData[index - 1].amount;
    const nextAmount = slabsData[index + 1].amount;

    if (index === numSlabs - 2) {
      // Special case for the second-last index
      if (newValue < previousAmount) {
        alert(
          `Amount in section ${
            index + 1
          } should be greater than the previous tab`
        );
        e.target.value = previousAmount;
        slabsData[index].amount = previousAmount;
        slabsData[index + 1].amount = previousAmount;
      } else {
        // Update the current slab's amount
        slabsData[index].amount = newValue;
      }
    } else {
      // For all other indices except the last and second-last
      if (newValue <= previousAmount || newValue >= nextAmount) {
        alert(
          `Amount in section ${
            index + 1
          } should be greater than the previous tab and less than the next tab`
        );
        e.target.value = previousAmount;
        slabsData[index].amount = previousAmount;
      } else {
        // Update the current slab's amount
        slabsData[index].amount = newValue;
      }
    }
  }

  // Update the state with the modified data
  setApproverData({ data: slabsData });
};





//Created By Rushikesh harkare 12/10/2023

// onLoad function to collect data from API's
  const loadData = async () => {
    const inputRequired = "id,employee_id,first_name,last_name,middle_name,is_active";
    await new UserService().getUserForMyTickets(inputRequired).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const a = res.data.data.filter((d) => d.is_active == 1);
          setUserData(
            a.map((d) => ({
              value: d.id,
              label: d.first_name + " " + d.last_name + " " + "(" + d.id + ")",
            }))
          );
          setAssignedUserData(
            a.map((d) => ({
              value: d.id,
              label: d.first_name + " " + d.last_name + " " + "(" + d.id + ")",
            }))
          );
          setRequiredUserData(
            a.map((d) => ({
              value: d.id,
              label: d.first_name + " " + d.last_name + " " + "(" + d.id + ")",
            }))
          );
        }
      }
    });
    await new BillTypeMasterService()
      .getBillTypeDataById(BillId)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            let data = res.data.data;
            setBilltypeData(data);
          }
        }
      });
  };
//Created By Rushikesh harkare 12/10/2023

//Function for update state selected values from each slab and each row perticularly 
  const handleUserSelection = (sectionIndex, rowIndex, selectedOptions) => {
    const updatedSelectedUsersArray = [...selectedUsersArray];
    const newData = [...approverData.data];

    // Extract values from selectedOptions for the first dropdown (optional users)
    const selectedValues1 = selectedOptions.map((option) => option.value);

    // Update the selected users for the first dropdown
    updatedSelectedUsersArray[sectionIndex][rowIndex] = selectedOptions;
    newData[sectionIndex].level[rowIndex].employee_id = selectedValues1;
    // Clear the input field's value using the ref
    if (
      inputRefs.current[sectionIndex] &&
      inputRefs.current[sectionIndex][rowIndex]
    ) {
      inputRefs.current[sectionIndex][rowIndex].value = "";
    }

    // Set the updated arrays as the new state
    setSelectedUsersArray(updatedSelectedUsersArray);
    setApproverData({ data: newData });

    // Update the selected values in the second dropdown to match the first dropdown
    const updatedData = [...approverData.data];
    // Check if same user is selected in the current slab
    if (updatedData[sectionIndex].level.length > 1) {
      const currentEmployeeIds =
        updatedData[sectionIndex].level[rowIndex].employee_id;

      // Loop through previous rows within the same slab
      for (let i = 0; i < updatedData[sectionIndex].level.length; i++) {
        if (i === rowIndex) {
          // Skip the current row
          continue;
        }
        const previousEmployeeIds =
          updatedData[sectionIndex].level[i].employee_id;

        // Check if any of the current employee IDs exist in previous rows' employee IDs
        const duplicateEmployeeIds = currentEmployeeIds.some((employeeId) =>
          previousEmployeeIds.includes(employeeId)
        );

        if (duplicateEmployeeIds) {
          alert(
            "Same user cannot be selected in multiple rows within the same slab."
          );
          const inputElement = select1Refs.current[sectionIndex][rowIndex];
          if (inputElement) {
            inputElement.removeValue(duplicateEmployeeIds);
          }
          return; // Exit the function to prevent further processing
        }
      }
    }

    // Get the previous selected values from the second dropdown (required users)
    const prevSelectedValues2 =
      updatedData[sectionIndex].level[rowIndex].required_users || [];

    // Find values that were removed
    const removedValues = prevSelectedValues2.filter(
      (value) => !selectedValues1.includes(value)
    );

    // Find values that were added
    const addedValues = selectedValues1.filter(
      (value) => !prevSelectedValues2.includes(value)
    );

    // Update the selected values in the second dropdown
    updatedData[sectionIndex].level[rowIndex].required_users = [
      ...prevSelectedValues2.filter((value) => !removedValues.includes(value)),
      ...addedValues,
    ];

    setApproverData({ data: updatedData });
    // Clear the input field's value
  };
//Created By Rushikesh harkare 12/10/2023

//Function for update state selected values from each slab and each row perticularly 
  const handleUserSelection2 = (sectionIndex, rowIndex, selectedOptions) => {
    // Copy the current selectedUsersArray to avoid mutating state directly
    const updatedSelectedUsersArray = [...selectedUsersArray];
    const newData = [...approverData.data];
    // Ensure that the array for this section exists
    if (!updatedSelectedUsersArray[sectionIndex]) {
      updatedSelectedUsersArray[sectionIndex] = [];
    }

    // Extract values from selectedOptions
    const selectedValues = selectedOptions.map((option) => option.value);

    // Update the selected users for the specified row in the second dropdown
    updatedSelectedUsersArray[sectionIndex][rowIndex + 1] = selectedOptions;
    // Update the corresponding field in the approverData state with extracted values
    newData[sectionIndex].level[rowIndex].required_users = selectedValues;
    newData[sectionIndex].level[rowIndex].required_numbers = null; // Clear the value

    // Set the updated array as the new state
    setApproverData({ data: newData });
    setSelectedUsersArray(updatedSelectedUsersArray);
    // Clear the input field's value using the ref
    if (
      inputRefs.current[sectionIndex] &&
      inputRefs.current[sectionIndex][rowIndex]
    ) {
      inputRefs.current[sectionIndex][rowIndex].value = "";
    }
  };
//Created By Rushikesh harkare 12/10/2023

//Function for get only selected users from optional approvers dropdown 
  const getAvailableOptions = (options, sectionIndex, rowIndex) => {
    const selectedUsersInSection = selectedUsersArray[sectionIndex];

    // If selections have been made in this section, filter the options
    if (selectedUsersInSection && selectedUsersInSection[rowIndex]) {
      const selectedOptionValues = selectedUsersInSection[rowIndex].map(
        (selected) => selected.value
      );
      return options.filter((option) =>
        selectedOptionValues.includes(option.value)
      );
    }

    // If no selection has been made, show all options
    return options;
  };
//Created By Rushikesh harkare 12/10/2023

//Update in state Required Numbers
  const handleRequiredNumbersChange = (index, rowIndex, newValue) => {
    // Get the maximum length from the required_users array
    const maxLength =
      approverData.data[index].level[rowIndex].required_users?.length || 0;

    // Ensure the new value is a positive number
    const validValue = Math.max(0, Math.min(newValue, maxLength));

    // Update the data in a copy of the approverData state
    const newData = [...approverData.data];
    newData[index].level[rowIndex].required_numbers = validValue;

    // Update the state with the new data
    setApproverData({ data: newData });
  };
//Created By Rushikesh harkare 12/10/2023

//Function To Sumbmit the main form
  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const isEmpty = approverData.data.some((section) => {
      return section.level.some((levelItem) => {
        return (
          levelItem.employee_id.length === 0 ||
          levelItem.required_users.length === 0 ||
          isNaN(levelItem.required_numbers) ||
          levelItem.required_numbers == null ||
          isNaN(section.amount) ||
          section.slab === null
        );
      });
    });
    

    // Check if assign_employee_id[] is empty
    const assignEmployeeId = formData.getAll("assign_employee_id[]");
    if (assignEmployeeId == "") {
      alert("Please select Assigned User");
      return;
    }

    // Check if any of the fields are empty or null
    if (isEmpty) {
      alert("Please fill in all required fields");
      return;
    }

    // Proceed with the API request
    formData.append("approverData", JSON.stringify(approverData));
    formData.append("user_id", sessionStorage.getItem("id"));
    formData.append("bill_type", e.target.bill_type.value);

    try {
      const res = await new BillTypeMasterService().updateBillType(
        BillId,
        formData
      );

      if (res.status === 200) {
        if (res.data.status === 1) {
          history({
            pathname: `/${_base}/billTypeMaster`,
            message: "once",
         
          },   {state: { alert: { type: "success", message: res.data.message } }});
        } else {
          setNotify({ type: "danger", message: res.data.message });
        }
      }
    } catch (error) {
      // Handle error appropriately
      console.error("Error:", error);
    }
  };
//Created By Rushikesh harkare 12/10/2023

  // Initialize approverData with default values from billTypeData
  useEffect(() => {
    if (billTypeData) {
      const transformedData = transformData(billTypeData);
      setApproverData({ data: transformedData });
    }
  }, [billTypeData]);

  // Function to transform billTypeData into the desired structure
  const transformData = (billTypeData) => {
    if (!billTypeData || !billTypeData.bill_type) return [];

    const { bill_type, assigned_users, is_active, remark, ...approverData } =
      billTypeData;

    const transformedData = Object.keys(approverData).map((key) => {
      const item = approverData[key];
      const amount = item.amount || "00.00";
      const slab = item.slab || 1;

      const level = item.level.map((levelItem, index) => ({
        bill_approval_level: levelItem.bil_approval_level,
        employee_id: levelItem.employee_ids,
        required_users: levelItem.is_required_users,
        required_numbers: levelItem.required_numbers || null,
      }));

      return { amount, slab, level };
    });

    return transformedData;
  };

  useEffect(() => {
    const initialSelectedOptions = approverData.data.map((section) =>
      section.level.map(() => [])
    );
    setSelectedUsersArray(initialSelectedOptions);
  }, [approverData.data]);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Edit Bill Type" />
      {notify && <Alert alertData={notify} />}
      <div className="card">
        <form method="post" onSubmit={handleForm}>
          <div className="card-body mt-2">
            <div className="row g-3 mb-4">
              <input
                type="hidden"
                id="user_id"
                value={sessionStorage.getItem("id")}
              />

              <div className="col-sm-4 ">
                <label className="form-label font-weight-bold">
                  Bill Type :<Astrick color="red" size="13px" />
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="bill_type"
                  required={true}
                  defaultValue={billTypeData && billTypeData.bill_type}
                  maxLength={20}
                />
              </div>

              <div className="col-sm-4 ">
                <label className="form-label font-weight-bold">
                  Assigned To :<Astrick color="red" size="13px" />
                </label>
                {userData && billTypeData && (
                  <Select
                    isMulti
                    name="assign_employee_id[]"
                    defaultValue={
                      billTypeData &&
                      billTypeData.assigned_users &&
                      userData.filter((user) =>
                        billTypeData.assigned_users.includes(user.value)
                      )
                    }
                    options={userData && userData}
                    placeholder="Please Select User"
                    onChange={(e) => {
                      handleAssignedToPerson(e);
                    }}
                  />
                )}
              </div>
              <div className="col-sm-4 ">
                <label className="form-label font-weight-bold">
                  Remark :<Astrick color="red" size="13px" />
                </label>

                <textarea
                  type="text"
                  cols="4"
                  className="form-control"
                  name="remark"
                  defaultValue={billTypeData && billTypeData.remark}
                  required={true}
                />
              </div>
              <div className="col-sm-12">
                <label className="form-label font-weight-bold">
                  Status :<Astrick color="red" size="13px" />
                </label>
                <div className="row">
                  <div className="col-md-2">
                    <div className="form-check">
                      {billTypeData && (
                        <input
                          className="form-check-input"
                          type="radio"
                          name="is_active"
                          id="is_active_1"
                          value="1"
                          defaultChecked={
                            billTypeData && billTypeData.is_active === 1
                              ? true
                              : false
                          }
                        />
                      )}
                      <label className="form-check-label" htmlFor="is_active_1">
                        Active
                      </label>
                    </div>
                  </div>
                  <div className="col-md-1">
                    <div className="form-check">
                      {billTypeData && (
                        <input
                          className="form-check-input"
                          type="radio"
                          name="is_active"
                          id="is_active_0"
                          value="0"
                          defaultChecked={
                            billTypeData && billTypeData.is_active === 0
                              ? true
                              : false
                          }
                        />
                      )}
                      <label className="form-check-label" htmlFor="is_active_0">
                        Deactive
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {billTypeData &&
              approverData.data.map((item, index) => (
                <div key={index}>
                  <Row>
                    <h6 className="fw-bold">SLAB :- {item.slab}</h6>
                    <Col className="mt-2">
                      <strong>
                        {index === approverData.data.length - 1
                          ? "Above Amount:"
                          : "Upto Amount:"}
                      </strong>

                      
                      <input
                        className="form-control-sm"
                        style={
                          index > 0 && index === approverData.data.length - 1
                            ? { backgroundColor: "#D1D1D9" }
                            : null
                        }
                        type="number" // Change type to text
                        key={index}
                        value={item.amount ? item.amount : ""}
                        onKeyPress={(e) => {
                          if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(e.target.value + e.key) || e.target.value.length >= 10) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          let inputValue = e.target.value;
                          const newValue = parseFloat(inputValue);
                          handleAmountChange(index, newValue);
                        }}
                        onBlur={(e) => validateAmounts(e, index)}
                        readOnly={
                          index > 0 && index === approverData.data.length - 1
                        }
                      />
                      {index + 1 === item.slab && index === 0 ? (
                        <Button
                          type="button"
                          variant="primary"
                          className="sm"
                          onClick={(e) => {
                            handleIncrement(e, index);
                          }}
                        >
                          <i className="icofont-plus-circle" />
                        </Button>
                      ) : null}

                      {approverData.data.length > 1 &&
                      index !== approverData.data.length - 1 ? (
                        <Button
                          variant="danger"
                          className="sm"
                          onClick={() => handleRemoveSection(index)}
                        >
                          <i className="icofont-minus-circle" />
                        </Button>
                      ) : null}
                    </Col>
                  </Row>

                  <Table className="mt-2">
                    <thead>
                      <tr>
                        <th>Sr</th>
                        <th>Assinged Approvers</th>
                        <th>Required Approvers </th>
                        <th>Required Numbers</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item &&
                        item.level?.length > 0 &&
                        item.level.map((levelItem, rowIndex) => (
                          <tr key={rowIndex}>
                            <td> {rowIndex + 1}</td>
                            <td>
                              {assignedUserData && (
                                <Select
                                  key={rowIndex}
                                  ref={(el) => {
                                    if (!select1Refs.current[index]) {
                                      select1Refs.current[index] = [];
                                    }
                                    select1Refs.current[index][rowIndex] = el; // Attach the ref to the input field
                                  }}
                                  options={assignedUserData && assignedUserData}
                                  value={
                                    levelItem.employee_id &&
                                    assignedUserData.filter((user) =>
                                      levelItem.employee_id.includes(user.value)
                                    )
                                  }
                                  onChange={(selectedOptions) =>
                                    handleUserSelection(
                                      index,
                                      rowIndex,
                                      selectedOptions
                                    )
                                  }
                                  isMulti={true} // Enable multiple selections
                                />
                              )}
                            </td>
                            <td>
                              {assignedUserData && (
                                <Select
                                  key={rowIndex}
                                  value={
                                    levelItem.required_users &&
                                    assignedUserData.filter((user) =>
                                      levelItem.required_users.includes(
                                        user.value
                                      )
                                    )
                                  }
                                  options={getAvailableOptions(
                                    assignedUserData,
                                    index,
                                    rowIndex
                                  )}
                                  onChange={(selectedOptions) =>
                                    handleUserSelection2(
                                      index,
                                      rowIndex,
                                      selectedOptions
                                    )
                                  }
                                  isMulti={true} // Enable multiple selections
                                />
                              )}
                            </td>

                            <td>
                              <input
                                type="number"
                                key={rowIndex}
                                max={
                                  approverData.data[index].level[rowIndex]
                                    .required_users?.length || ""
                                }
                                onKeyPress={(e) => {
                                  Validation.RequiredNumbersOnly(e);
                                }}
                                ref={(el) => {
                                  if (!inputRefs.current[index]) {
                                    inputRefs.current[index] = [];
                                  }
                                  inputRefs.current[index][rowIndex] = el; // Attach the ref to the input field
                                }}
                                value={levelItem && levelItem.required_numbers}
                                onChange={(e) => {
                                  let inputValue = e.target.value;

                                  // Use a regex to remove any negative sign
                                  inputValue = inputValue.replace(/-/g, "");

                                  // Parse the input value as a number
                                  const newValue = parseFloat(inputValue);

                                  // Call the handleRequiredNumbersChange function
                                  handleRequiredNumbersChange(
                                    index,
                                    rowIndex,
                                    newValue
                                  );
                                }}
                              />
                            </td>

                            <td>
                              {item.level.length > 1 && rowIndex !== 0 ? ( // Only render the button if there's more than one row
                                <Button
                                  type="button"
                                  variant="danger"
                                  onClick={() =>
                                    handleRemoveRow(index, rowIndex)
                                  }
                                >
                                  <i className="icofont-ui-delete" />
                                </Button>
                              ) : null}
                              {rowIndex === 0 && (
                                <Button
                                  type="button"
                                  variant="primary"
                                  onClick={() => handleAddRow(index, rowIndex)}
                                >
                                  <i className="icofont-plus-circle" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                  <hr />
                  <br />
                </div>
              ))}
            {/* <Button type="button" className="pull-right" variant="danger">
              Cancel
            </Button> */}

            
            <Link to={`/${_base}/billTypeMaster`}
            className="pull-right btn btn-danger text-white"
            
            >
                   Cancel
            
            </Link>
            <Button className="pull-right" type="submit" variant="primary">
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBillTypeComponent;
