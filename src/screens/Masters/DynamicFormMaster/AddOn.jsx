import React, { useState, useEffect } from 'react';
import DynamicFormDropdownMasterService from '../../../services/MastersService/DynamicFormDropdownMasterService';

function AddOn(props) {
  const [selectedDropdown, setSelectedDropdown] = useState();
  const [selectedDropdownValues, setSelectedDropdownValues] = useState();

  const loadData = async () => {
    if (
      props &&
      props.data.inputType == 'select' &&
      props.data.inputAddOn.inputDataSource
    ) {
      await new DynamicFormDropdownMasterService()
        .getDropdownById(props.data.inputAddOn.inputDataSource)
        .then((res) => {
          if (res.status == 200) {
            if (res.data.status == 1) {
              setSelectedDropdown(res.data.data.master.id);

              setSelectedDropdownValues(
                res.data.data.dropdown.map((d) => ({
                  label: d.label,
                  value: d.value
                }))
              );
            }
          }
        });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (props) {
    var range = null;

    return (
      <>
        {props.data.inputType === 'time' && (
          <div className="d-flex justify-content-between" key={props.key}>
            <div class="form-group">
              <label>Min Time:</label>
              <input
                type="time"
                onChange={props.onGetChange}
                id="inputRangeMin"
                name="inputRangeMin"
                className="form-control form-control-sm"
                defaultValue={props.data.inputAddOn.inputRangeMin}
                min={props.data.inputAddOn.inputRangeMin}
              />
            </div>
            <div className="form-group">
              <label>Max Time:</label>
              <input
                type="time"
                onChange={props.onGetChange}
                id="inputRangeMax"
                name="inputRangeMax"
                className="form-control form-control-sm"
                defaultValue={props.data.inputAddOn.inputRangeMax}
                max={props.data.inputAddOn.inputRangeMax}
              />
            </div>
          </div>
        )}

        {props.data.inputType === 'datetime-local' && (
          <div className="d-flex justify-content-between">
            <div class="form-group">
              <label>Date-time:</label>
              <input
                type="datetime-local"
                onChange={props.onGetChange}
                id="datetime-local"
                name="datetime-local"
                className="form-control form-control-sm"
                defaultValue={props.data.inputAddOn.inputDateTime}
                min={props.data.inputAddOn.inputDateTime}
              />
            </div>
          </div>
        )}

        {props.data.inputType === 'radio' && (
          <span>
            <select
              className="form-control form-control-sm"
              onChange={props.onGetChange}
              id="inputRadio"
              name="inputRadio"
            >
              <option>Select Data Source</option>
              {props.radioSelect &&
                props.radioSelect.map((d, i) => {
                  if (selectedDropdown == d.value) {
                    return <option value={d.value}>{d.label}</option>;
                  } else {
                    return <option value={d.value}>{d.label}</option>;
                  }
                })}
            </select>
            <small style={{ color: 'red' }}>
              <b>Select Data Source</b>
            </small>
          </span>
        )}

        {props.data.inputType === 'number' && (
          <div className="d-flex justify-content-between">
            <div class="form-group">
              <label>Min Number:</label>
              <input
                type="number"
                // onChange={props.onGetChange}
                id="inputRangeMin"
                name="inputRangeMin"
                className="form-control form-control-sm"
                defaultValue={props.data.inputAddOn.inputRangeMin}
                min={props.data.inputAddOn.inputRangeMin}
              />
            </div>
            <div className="form-group">
              <label>Max Number:</label>
              <input
                type="number"
                id="inputRangeMax"
                name="inputRangeMax"
                className="form-control form-control-sm"
                defaultValue={props.data.inputAddOn.inputRangeMax}
                max={props.data.inputAddOn.inputRangeMax}
              />
            </div>
          </div>
        )}

        {props.data.inputType === 'decimal' && (
          <div className="d-flex justify-content-between">
            <div class="form-group">
              <label>Min Number:</label>
              <input
                type="number"
                onChange={props.onGetChange}
                id="inputRangeMin"
                name="inputRangeMin"
                className="form-control form-control-sm"
                defaultValue={props.data.inputAddOn.inputRangeMin}
                min={props.data.inputAddOn.inputRangeMin}
              />
            </div>
            <div className="form-group">
              <label>Max Number:</label>
              <input
                type="number"
                onChange={props.onGetChange}
                id="inputRangeMax"
                name="inputRangeMax"
                className="form-control form-control-sm"
                defaultValue={props.data.inputAddOn.inputRangeMax}
                max={props.data.inputAddOn.inputRangeMax}
              />
            </div>
          </div>
        )}

        {props.data.inputType === 'select' && (
          <span>
            <select
              className="form-control form-control-sm"
              onChange={props.onGetChange}
              id="inputOnChangeSource"
              name="inputOnChangeSource"
            >
              <option>Select Data Source</option>

              {props &&
                props.dropdown &&
                props.dropdown.map((d, i) => {
                  if (selectedDropdown == d.id) {
                    return (
                      <option value={d.id} selected>
                        {d.dropdown_name}
                      </option>
                    );
                  } else {
                    return <option value={d.id}>{d.dropdown_name}</option>;
                  }
                })}
            </select>
            <small style={{ color: 'red' }}>
              <b>Select Data Source</b>
            </small>
          </span>
        )}

        {props.data.inputType === 'select-master' && (
          <span>
            <select
              className="form-control form-control-sm"
              onChange={props.onGetChange}
              id="inputDataSource"
              name="inputDataSource"
            >
              <option>Select Data Source</option>
              <option value="user|id|name">User Master</option>
              <option value="department|id|department">
                Department Master
              </option>
              <option value="role|id|role">Role Master</option>
              <option value="customer|id|customer">Customer Master</option>
              <option value="country|id|country">Country Master</option>
              <option value="state|id|state">State Master</option>
              <option value="city|id|city">City Master</option>
              <option value="designation|id|designation">
                Designation Master
              </option>
              <option value="status|id|status">Status Master</option>
            </select>
            <small style={{ color: 'red' }}>
              <b>Select Data Source</b>
            </small>
          </span>
        )}

        {props.data.inputType === 'date' && (
          <div className="d-flex justify-content-between">
            <div class="form-group">
              <label>Min Date:</label>
              <input
                type="date"
                onChange={props.onGetChange}
                id="inputRangeMin"
                name="inputRangeMin"
                className="form-control form-control-sm"
                defaultValue={props.data.inputAddOn.inputRangeMin}
                min={props.data.inputAddOn.inputRangeMin}
              />
            </div>
            <div className="form-group">
              <label>Max Date:</label>
              <input
                type="date"
                onChange={props.onGetChange}
                id="inputRangeMax"
                name="inputRangeMax"
                className="form-control form-control-sm"
                defaultValue={props.data.inputAddOn.inputRangeMax}
                max={props.data.inputAddOn.inputRangeMax}
              />
            </div>
          </div>
        )}
      </>
    );
  } else {
    return <></>;
  }
}

export default AddOn;
