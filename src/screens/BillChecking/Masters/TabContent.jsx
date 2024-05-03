import React, {useState} from 'react';
import Select from 'react-select';
import { Astrick } from '../../../components/Utilities/Style';

function TabContent({ userData, key, name, onChange, updateTabData }) {
  const [ selectedusers, setSelectedUsers] = useState()
  const handleTabContentChange = (selectedOption, action) => {

    const value = selectedOption
    setSelectedUsers(value)
      if (action.name === 'employee_id') {
      const employeeIds = selectedOption.map((option) => option.value);
      const requiredUsers = selectedOption.map((option) => option.label);

      // Update the data in the state
      updateTabData(name, {
        employee_id: employeeIds,
        required_users: requiredUsers,
      });
    } else if (action.name === 'required_users') {
      const requiredUsers = selectedOption.map((option) => option.label);

      // Update the data in the state
      updateTabData(name, {
        required_users: requiredUsers,
      });
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Update the data in the state
    updateTabData(name, {
      required_numbers: value,
    });
  };

  return (
    <div className="card mb-3 mt-3">
      <div className="card-body">
        <div className="row">
          <div className="col-sm-3">
            <label className="form-label font-weight-bold">
              Assigned user(s) :<Astrick color="red" size="13px" />
            </label>
            {userData && (
              <Select
                isMulti
                options={userData}
                id="employee_id"
                name="employee_id"
                required={true}
                onChange={handleTabContentChange}
              />
            )}
          </div>
          <div className="col-sm-3">
            <label className="form-label font-weight-bold">
              Required users :<Astrick color="red" size="13px" />
            </label>
            {userData && (
              <Select
                isMulti
                options={selectedusers}
                id="required_users"
                name="required_users"
                required={true}
                // onChange={handleTabContentChange}
              />
            )}
          </div>
          <div className="col-sm-3">
            <label className="form-label font-weight-bold">
              Required Members :<Astrick color="red" size="13px" />
            </label>
            <input
              type="number"
              className="form-control"
              id="required_numbers"
              name="required_numbers"
              required={key && key === 1 ? true : false}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TabContent;