import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Button, Table, Form } from 'react-bootstrap';
import PageHeader from '../../../../components/Common/PageHeader';
import Select from 'react-select';
import { Astrick } from '../../../../components/Utilities/Style';
import UserService from '../../../../services/MastersService/UserService';
import * as Validation from '../../../../components/Utilities/Validation';
import BillTypeMasterService from '../../../../services/Bill Checking/Masters/BillTypeMasterService';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../../../components/Common/Alert';
import { _base } from '../../../../settings/constants';
import './styles.css'; // Import your CSS file

const CreateBillTypeComponent = () => {
  const history = useNavigate();
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
            required_numbers: null
          }
        ]
      }
    ]
  });
  const [notify, setNotify] = useState();
  const selectAddRequiredUserRefs = useRef([]);
  const [userData, setUserData] = useState();
  const [assignedUserData, setAssignedUserData] = useState();
  const [requiredUserData, setRequiredUserData] = useState();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedUsersArray, setSelectedUsersArray] = useState([]);
  // Inside your functional component
  const secondDropdownRefs = useRef([]);

  // Initialize the refs for each second dropdown based on your data structure
  if (secondDropdownRefs.current.length !== approverData.data.length) {
    secondDropdownRefs.current = approverData.data.map(() => []);
  }
  const inputRefs = useRef([]);
  const select1Refs = useRef([]);
  const assignedUserRef = useRef();
  const requiredUserRef = useRef();

  const handleIncrement = (e, index) => {
    const newData = [...approverData.data];

    // Extract the amount from the current slab
    let firstAmount = newData[index].amount;

    // If the amount is not a number or null, set it to 0
    if (isNaN(firstAmount)) {
      firstAmount = 0.0;
    }

    // On the first click, if the amount is 0 or null, show an alert
    if (firstAmount === null || firstAmount === 0) {
      alert('Please enter an amount first.');
      return;
    }

    // If this is not the first click, increment the amount by 1
    if (newData.length > 1) {
      firstAmount += 1;
    }

    // Use a for loop to validate the new amount against all existing amounts
    for (let i = 0; i < newData.length; i++) {
      if (i === index) {
        // Skip the current slab
        continue;
      }

      // Check if the new amount is greater than or equal to the previous amount
      if (firstAmount <= newData[i].amount) {
        alert(
          `Amount in section ${
            index + 1
          } should be greater than the previous tab.`
        );
        return; // Exit the function without adding a new slab
      }
    }

    // Create a new section with the calculated amount
    const newSection = {
      amount: firstAmount,
      slab: newData.length + 1,
      level: [
        {
          bill_approval_level: 1,
          employee_id: null,
          required_users: null,
          required_numbers: null
        }
      ]
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

    // Update the last amount after adding new sections
    newData[newData.length - 1].amount = firstAmount;

    // Update state with the modified data
    setApproverData({ data: newData });
  };

  const handleAddRow = (sectionIndex) => {
    const newData = [...approverData.data];

    // Add a new row to the specified section's level
    newData[sectionIndex].level.push({
      bill_approval_level: newData[sectionIndex].level.length + 1,
      employee_id: null,
      required_users: null,
      required_numbers: null
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

  const handleRemoveRow = (sectionIndex, rowIndex) => {
    const newData = [...approverData.data];
    newData[sectionIndex].level.splice(rowIndex, 1);
    setApproverData({ data: newData });
  };

  const handleRemoveSection = (indexToRemove) => {
    setAmountErr('');
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

  const [amountErr, setAmountErr] = useState('');
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

    if (newData[index + 1]?.amount <= newData[index - 1]?.amount) {
      setAmountErr(
        `Amount in section ${
          index + 1
        } should be greater than the previous tab.`
      );
    } else {
      setAmountErr('');
    }
  };

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
      const previousAmount =
        index === 0
          ? slabsData[index + 1]?.amount
          : slabsData[index - 1]?.amount;
      if (index === 0 && newValue > previousAmount) {
        alert(
          `Amount in section ${
            index + 1
          } should not be greater than the previous tab`
        );
        e.target.value = previousAmount;
        slabsData[index].amount = previousAmount;
        newValue = previousAmount;
      } else {
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
      if (index > 0) {
        var previousAmount = slabsData[index - 1].amount;
        var nextAmount = slabsData[index + 1].amount;
      }

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

  const loadData = async () => {
    const inputRequired =
      'id,employee_id,first_name,last_name,middle_name,is_active';
    await new UserService().getUserForMyTickets(inputRequired).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const a = res.data.data.filter((d) => d.is_active == 1);
          setUserData(
            a.map((d) => ({
              value: d.id,
              label: d.first_name + ' ' + d.last_name + ' ' + '(' + d.id + ')'
            }))
          );
          setAssignedUserData(
            a.map((d) => ({
              value: d.id,
              label: d.first_name + ' ' + d.last_name + ' ' + '(' + d.id + ')'
            }))
          );
          setRequiredUserData(
            a.map((d) => ({
              value: d.id,
              label: d.first_name + ' ' + d.last_name + ' ' + '(' + d.id + ')'
            }))
          );
        }
      }
    });
  };
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
      inputRefs.current[sectionIndex][rowIndex].value = '';
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
        if (i == rowIndex) {
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
            'Same user cannot be selected in multiple rows within the same slab.'
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
      ...addedValues
    ];
    // Clear the required_numbers field
    setApproverData({ data: updatedData });
  };

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
      inputRefs.current[sectionIndex][rowIndex].value = '';
    }
  };

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

  const handleForm = async (e) => {
    e.preventDefault();
    // Create a new FormData object
    const formData = new FormData(e.target);
    if (
      assignedUserRef &&
      assignedUserRef.current.commonProps.hasValue == false
    ) {
      // Show an alert or error message
      alert("Please select at least one user in the 'Assigned To' field");
      return;
    }

    if (
      requiredUserRef &&
      requiredUserRef.current.commonProps.hasValue == false
    ) {
      // Show an alert or error message
      alert("Please select at least one user in the 'Required To' field");
      return;
    }

    if (amountErr) {
      alert('Please fix the error before submitting the form.');
      return;
    }
    // Check if any field is empty
    const isEmpty = approverData.data.some((section) => {
      return section.level.some((levelItem) => {
        return (
          levelItem.employee_id === null ||
          levelItem.required_users === null ||
          levelItem.required_numbers === null ||
          section.amount === null ||
          section.slab === null
        );
      });
    });
    if (isEmpty) {
      // Show an alert or error message
      alert('Please fill in all fields');
      return;
    } else {
      formData.append('approverData', JSON.stringify(approverData));
      formData.append('user_id', localStorage.getItem('id'));
      formData.append('bill_type', e.target.bill_type.value);
      try {
        const res = await new BillTypeMasterService().createBillType(formData);

        if (res.status === 200) {
          if (res.data.status === 1) {
            history(
              {
                pathname: `/${_base}/billTypeMaster`
              },
              {
                state: {
                  alert: { type: 'success', message: res.data.message }
                }
              }
            );
          } else {
            setNotify({ type: 'danger', message: res.data.message });
          }
        }
      } catch (error) {
        // Handle error appropriately
      }
    }
  };

  // Initialize selectedOptions for each row
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
      <PageHeader headerTitle="Add Bill Type" />
      {notify && <Alert alertData={notify} />}
      <div className="card">
        <form method="post" onSubmit={handleForm}>
          <div className="card-body mt-2">
            <div className="row g-3 mb-4">
              <input
                type="hidden"
                id="user_id"
                value={localStorage.getItem('id')}
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
                  maxLength={25}
                />
              </div>

              <div className="col-sm-4 ">
                <label className="form-label font-weight-bold">
                  Assigned To :<Astrick color="red" size="13px" />
                </label>
                {userData && (
                  <Select
                    name="assign_employee_id[]"
                    id="assign_employee_id"
                    isMulti
                    ref={assignedUserRef}
                    options={userData && userData}
                    placeholder="Please Select User"
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
                  required={true}
                />
              </div>
            </div>
            {approverData.data.map((item, index) => (
              <div key={index}>
                <Row>
                  <h6 className="fw-bold">SLAB :- {item.slab}</h6>
                  <Col className="mt-2">
                    <strong>
                      {index === approverData.data.length - 1
                        ? 'Above Amount:'
                        : 'Upto Amount:'}
                    </strong>
                    <Astrick color="red" size="13px" />

                    <input
                      className="form-control-sm"
                      style={
                        index > 0 && index === approverData.data.length - 1
                          ? { backgroundColor: '#D1D1D9' }
                          : null
                      }
                      type="number"
                      required
                      key={index}
                      min={
                        approverData &&
                        index > 0 &&
                        approverData.data
                          ?.filter((d) => d.slab == 1)
                          .map((i) => i.amount + 1)
                      }
                      maxLength="10"
                      value={item.amount ? item.amount : ''}
                      onKeyPress={(e) => {
                        if (
                          !/^[0-9]*(\.[0-9]{0,2})?$/.test(
                            e.target.value + e.key
                          ) ||
                          e.target.value.length >= 10
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        let inputValue = e.target.value;
                        const newValue = parseFloat(inputValue);
                        handleAmountChange(index, newValue);
                      }}
                      readOnly={
                        index > 0 && index === approverData.data.length - 1
                      }
                      onBlur={(e) => validateAmounts(e, index)}
                    />
                    {index === 0 || index !== approverData.data.length - 1 ? (
                      <Button
                        type="button"
                        variant="primary"
                        className="sm"
                        disabled={!item.amount ? true : false}
                        onClick={(e) => handleIncrement(e, index)}
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
                  {index > 0 && index === approverData.data.length - 2 && (
                    <small style={{ color: 'red', display: 'block' }}>
                      {amountErr}
                    </small>
                  )}
                </Row>

                <Table className="mt-2">
                  <thead>
                    <tr>
                      <th>Sr</th>
                      <th>
                        Assinged Approvers <Astrick color="red" size="13px" />
                      </th>
                      <th>
                        Required Approvers <Astrick color="red" size="13px" />{' '}
                      </th>
                      <th>
                        Required Members <Astrick color="red" size="13px" />
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.level.map((levelItem, rowIndex) => (
                      <tr key={rowIndex}>
                        <td> {rowIndex + 1}</td>
                        <td>
                          {assignedUserData && (
                            <Select
                              ref={(el) => {
                                if (!select1Refs.current[index]) {
                                  select1Refs.current[index] = [];
                                }
                                select1Refs.current[index][rowIndex] = el; // Attach the ref to the input field
                              }}
                              key={rowIndex}
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
                                  levelItem.required_users.includes(user.value)
                                )
                              }
                              ref={requiredUserRef}
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
                            disabled={
                              levelItem.employee_id &&
                              levelItem.employee_id != null
                                ? false
                                : true
                            }
                            max={
                              approverData.data[index].level[rowIndex]
                                .required_users?.length || 0
                            }
                            onKeyPress={(e) => {
                              Validation.RequiredNumbersOnly(e);
                            }}
                            min={1}
                            ref={(el) => {
                              if (!inputRefs.current[index]) {
                                inputRefs.current[index] = [];
                              }
                              inputRefs.current[index][rowIndex] = el; // Attach the ref to the input field
                            }}
                            onChange={(e) => {
                              let inputValue = e.target.value;

                              // Use a regex to remove any negative sign
                              inputValue = inputValue.replace(/-/g, '');

                              const newValue = parseFloat(inputValue);

                              const maxLength =
                                approverData.data[index].level[rowIndex]
                                  .required_users?.length || 0;

                              if (isNaN(newValue) || newValue < 0) {
                                // Clear the input value if it's not a valid number or negative
                                e.target.value = '';
                              } else if (newValue > maxLength) {
                                // Set the value to the maximum length if it exceeds it
                                e.target.value = maxLength.toString();
                                const newData = [...approverData.data];
                                newData[index].level[
                                  rowIndex
                                ].required_numbers = maxLength;
                                setApproverData({ data: newData });
                              } else {
                                // Update the data if the input value is valid
                                const newData = [...approverData.data];
                                newData[index].level[
                                  rowIndex
                                ].required_numbers = newValue;
                                setApproverData({ data: newData });
                              }
                            }}
                          />
                        </td>

                        <td>
                          {item.level.length > 1 && rowIndex !== 0 ? ( // Only render the button if there's more than one row
                            <Button
                              type="button"
                              variant="danger"
                              onClick={() => handleRemoveRow(index, rowIndex)}
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
            <Link
              to={`/${_base}/billTypeMaster`}
              className="pull-right btn btn-danger text-white"
            >
              Cancel
            </Link>
            <Button className="pull-right" type="submit" variant="primary">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBillTypeComponent;
