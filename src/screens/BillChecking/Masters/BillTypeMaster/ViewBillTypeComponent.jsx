import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Button, Table, Form } from 'react-bootstrap';
import PageHeader from '../../../../components/Common/PageHeader';
import Select from 'react-select';
import { Astrick } from '../../../../components/Utilities/Style';
import UserService from '../../../../services/MastersService/UserService';
import * as Validation from '../../../../components/Utilities/Validation';
import BillTypeMasterService from '../../../../services/Bill Checking/Masters/BillTypeMasterService';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Alert from '../../../../components/Common/Alert';
import { _base } from '../../../../settings/constants';

const ViewBillTypeComponent = ({ match }) => {
  const history = useNavigate();
  const { id } = useParams();
  const BillId = id;
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

  const [billTypeData, setBilltypeData] = useState();
  const [notify, setNotify] = useState();
  const selectAddRequiredUserRefs = useRef([]);
  const [userData, setUserData] = useState();
  const [assignedUserData, setAssignedUserData] = useState();
  const [requiredUserData, setRequiredUserData] = useState();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedUsersArray, setSelectedUsersArray] = useState([]);

  const handleIncrement = () => {
    const newData = [...approverData.data];

    // Create a new section with default values
    const newSection = {
      amount: null,
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

    newData.push(newSection);
    setApproverData({ data: newData });
  };

  const handleAssignedToPerson = (selectedOptions) => {
    const newData = [...approverData.data];

    // Use map to update each object's assignToUser property
    const updatedData = newData.map((d) => ({
      ...d,
      assignToUser: selectedOptions.map((option) => option.value)
    }));

    // Set the updated array as the new state
    setApproverData({ data: updatedData });
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

  const handleRemoveSection = (index) => {
    const newData = [...approverData.data];
    newData.splice(index, 1);

    // Reindex the remaining sections
    newData.forEach((section, sectionIndex) => {
      section.slab = sectionIndex + 1;
    });

    setApproverData({ data: newData });
  };

  const handleAmountChange = (index, value) => {
    const newData = [...approverData.data];
    const amountValue = parseFloat(value);
    if (!isNaN(amountValue) && amountValue >= 0) {
      newData[index].amount = amountValue; // Ensure 2 decimal places
      setApproverData({ data: newData });
    }
  };

  const validateAmounts = (e, index) => {
    const currentData = approverData.data;
    const previousTabAmount = currentData[index - 1]?.amount || 0;
    const nextTabAmount = currentData[index + 1]?.amount || 0;

    if (
      currentData[index]?.amount <= previousTabAmount ||
      (nextTabAmount !== 0 && nextTabAmount <= currentData[index].amount)
    ) {
      alert(
        'Amount in section ' +
          (index + 1) +
          ' should be greater than previous and less than the next tab'
      );
      e.target.value = '00.00';
      // You can add additional handling here if needed
    }
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

  const handleUserSelection = (sectionIndex, rowIndex, selectedOptions) => {
    const updatedSelectedUsersArray = [...selectedUsersArray];
    const newData = [...approverData.data];

    // Extract values from selectedOptions for the first dropdown (optional users)
    const selectedValues1 = selectedOptions.map((option) => option.value);

    // Update the selected users for the first dropdown
    updatedSelectedUsersArray[sectionIndex][rowIndex] = selectedOptions;
    newData[sectionIndex].level[rowIndex].employee_id = selectedValues1;

    // Set the updated arrays as the new state
    setSelectedUsersArray(updatedSelectedUsersArray);
    setApproverData({ data: newData });

    // Update the selected values in the second dropdown to match the first dropdown
    const updatedData = [...approverData.data];

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

    // Set the updated array as the new state
    setApproverData({ data: newData });
    setSelectedUsersArray(updatedSelectedUsersArray);
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
    const assignEmployeeId = formData.getAll('assign_employee_id[]');
    if (assignEmployeeId == '') {
      alert('Please select Assigned User');
      return;
    }

    // Check if any of the fields are empty or null
    if (isEmpty) {
      alert('Please fill in all required fields');
      return;
    }

    // Proceed with the API request
    formData.append('approverData', JSON.stringify(approverData));
    formData.append('user_id', localStorage.getItem('id'));
    formData.append('bill_type', e.target.bill_type.value);

    try {
      const res = await new BillTypeMasterService().updateBillType(
        BillId,
        formData
      );

      if (res.status === 200) {
        if (res.data.status === 1) {
          history(
            {
              pathname: `/${_base}/billTypeMaster`
            },
            { state: { alert: { type: 'success', message: res.data.message } } }
          );
        } else {
          setNotify({ type: 'danger', message: res.data.message });
        }
      }
    } catch (error) {
      // Handle error appropriately
    }
  };

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
      const amount = item.amount || '00.00';
      const slab = item.slab || 1;

      const level = item.level.map((levelItem, index) => ({
        bill_approval_level: levelItem.bil_approval_level,
        employee_id: levelItem.employee_ids,
        required_users: levelItem.is_required_users,
        required_numbers: levelItem.required_numbers || null
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
      <PageHeader headerTitle="View Bill Type" />
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
                  readOnly={true}
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
                    isDisabled
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
                  readOnly={true}
                />
              </div>
            </div>

            <div className="col-sm-6">
              <div className="row">
                <div className="col-md-2">
                  <label className="form-label font-weight-bold">
                    Status :<Astrick color="red" size="13px" />
                  </label>
                </div>
                <div className="col-md-2">
                  <div className="form-check">
                    {billTypeData && (
                      <input
                        className="form-check-input"
                        type="radio"
                        name="is_active"
                        id="is_active_1"
                        value="1"
                        readOnly
                        disabled={true}
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
                        disabled={true}
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

            {billTypeData &&
              approverData.data.map((item, index) => (
                <div key={index} className="mt-3">
                  <Row>
                    <h6 className="fw-bold">SLAB :- {item.slab}</h6>
                    <Col className="mt-2">
                      <strong>
                        {index + 1 === approverData.data.length
                          ? 'Above Amount'
                          : ' Upto Amount'}
                        :
                      </strong>
                      <input
                        className="form-control-md"
                        type="number"
                        disabled
                        value={item.amount != null ? item.amount : ''}
                        onChange={(e) => {
                          let inputValue = e.target.value;

                          inputValue = inputValue.replace(/-/g, '');

                          // Parse the input value as a number
                          const newValue = parseFloat(inputValue);
                          handleAmountChange(index, newValue);
                        }}
                        onBlur={(e) => validateAmounts(e, index)}
                      />
                    </Col>
                  </Row>

                  <Table className="mt-2">
                    <thead>
                      <tr>
                        <th>Sr</th>
                        <th>Assinged Approvers</th>
                        <th>Required Approvers </th>
                        <th>Required Numbers</th>
                        {/* <th>Actions</th> */}
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
                                  isDisabled
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
                                  isDisabled
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
                                readOnly
                                key={rowIndex}
                                max={
                                  approverData.data[index].level[rowIndex]
                                    .required_users?.length || ''
                                }
                                onKeyPress={(e) => {
                                  Validation.NumbersOnly(e);
                                }}
                                value={levelItem && levelItem.required_numbers}
                                onChange={(e) => {
                                  let inputValue = e.target.value;

                                  // Use a regex to remove any negative sign
                                  inputValue = inputValue.replace(/-/g, '');

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
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewBillTypeComponent;
