import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Astrick } from "../../../components/Utilities/Style";
import PageHeader from "../../../components/Common/PageHeader";
import * as Validation from "../../../components/Utilities/Validation";
import Select from "react-select";

function CreateShiftMaster() {
  const options = [
    { value: "Select Shift Type", label: "Select Shift Type" },
    { value: "Fixed", label: "Fixed" },
    { value: "Fixed Days", label: "Fixed Days" },
    { value: "Flexi", label: "Flexi" },
  ];
  const weekoffOption = [
    { value: "Sunday", label: "Sunday" },
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
  ];
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleOptionChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Create Shift Master" />
      {/* {data && JSON.stringify(data)} */}
      <div className="card mt-2">
        <div className="card-body">
          <form>
            <div>
              <div>
                <div className="row">
                  <div class="col">
                    <div className="row mt-3">
                      <div className="col-6">
                        <label>
                          <b>
                            Shift Name :
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control form-control-md"
                          onKeyPress={(e) => {
                            Validation.CharactersNumbersOnly(e);
                          }}
                          name="dropdown_name"
                          id="dropdown_name"
                          required
                          // onInput={e => handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>

                  <div class="col">
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <label>
                          <b>
                            Grace Period In Min :
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control form-control-md"
                          onKeyPress={(e) => {
                            Validation.CharactersNumbersOnly(e);
                          }}
                          name="dropdown_name"
                          id="dropdown_name"
                          required
                          // onInput={e => handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div class="row">
                  <div class="col">
                    <div className="row mt-2">
                      <div className="col-md-3">
                        <label>
                          <b>
                            Shift Name :<Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          onKeyPress={(e) => {
                            Validation.CharactersNumbersOnly(e);
                          }}
                          name="dropdown_name"
                          id="dropdown_name"
                          required
                          // onInput={e => handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div className="row mt-2">
                      <div className="col-md-3">
                        <label>
                          <b>
                            Shift Type :<Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col">
                        <Select
                          options={options}
                          name="from_department_id"
                          id="from_department_id"
                          value={selectedOption}
                          onChange={handleOptionChange}
                          required={true}
                        />
                      </div>
                    </div>
                    {selectedOption.value === "Fixed" && (
                      <div>
                        <div className="row mt-2">
                          <div className="col-md-3">
                            <label>
                              <b>
                                Start Time: <Astrick color="red" size="13px" />
                              </b>
                            </label>
                          </div>
                          <div className="col-md-4">
                            <input
                              type="time"
                              className="form-control from-control-sm"
                              name="start_time"
                            ></input>
                          </div>
                        </div>

                        <div className="row mt-2">
                          <div className="col-md-3">
                            <label>
                              <b>
                                End Time :<Astrick color="red" size="13px" />
                              </b>
                            </label>
                          </div>
                          <div className="col-md-4">
                            <input
                              type="time"
                              name="end_time"
                              className=" form-control from-control-sm"
                            ></input>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedOption.value === "Flexi" && (
                      <div className="row mt-2">
                        <div className="col-md-3">
                          <label>
                            {" "}
                            <b>
                              No of Working Hours
                              <Astrick color="red" size="15px" />
                            </b>
                          </label>
                        </div>
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div class="col">
                    <div className="row mt-2">
                      <div className="col-md-3">
                        <label>
                          <b>
                            Grace Period In Min :
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control form-control-md"
                          onKeyPress={(e) => {
                            Validation.CharactersNumbersOnly(e);
                          }}
                          name="dropdown_name"
                          id="dropdown_name"
                          required
                          // onInput={e => handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="row">
                  <div class="col">
                    <div className="row mt-4">
                      <div className="col-6">
                        <label>
                          <b>
                            Late Mark period in min after grace period: :
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control form-control-md"
                          onKeyPress={(e) => {
                            Validation.CharactersNumbersOnly(e);
                          }}
                          name="dropdown_name"
                          id="dropdown_name"
                          required
                          // onInput={e => handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>

                  <div class="col">
                    <div className="row mt-4">
                      <div className="col-md-6">
                        <label>
                          <b>
                            Early Out Allowed In Month :
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control form-control-md"
                          onKeyPress={(e) => {
                            Validation.CharactersNumbersOnly(e);
                          }}
                          name="dropdown_name"
                          id="dropdown_name"
                          required
                          // onInput={e => handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div class="col">
                    <div className="row mt-4">
                      <div className="col-6">
                        <label>
                          <b>
                            Early Out Allowed In Min:
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control form-control-md"
                          onKeyPress={(e) => {
                            Validation.CharactersNumbersOnly(e);
                          }}
                          name="dropdown_name"
                          id="dropdown_name"
                          required
                          // onInput={e => handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>

                  <div class="col">
                    <div className="row mt-4">
                      <div className="col-md-6">
                        <label>
                          <b>
                            No Of Late Mark For Half Day:
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control form-control-md"
                          onKeyPress={(e) => {
                            Validation.CharactersNumbersOnly(e);
                          }}
                          name="dropdown_name"
                          id="dropdown_name"
                          required
                          // onInput={e => handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div class="col">
                    <div className="row mt-4">
                      <div className="col-6">
                        <label>
                          <b>
                            Min To Consider In Half Day :
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control form-control-md"
                          onKeyPress={(e) => {
                            Validation.CharactersNumbersOnly(e);
                          }}
                          name="dropdown_name"
                          id="dropdown_name"
                          required
                          // onInput={e => handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>

                  <div class="col">
                    <div className="row mt-4">
                      <div className="col-md-6">
                        <label>
                          <b>
                            Min To consider one and half day:
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control form-control-md"
                          onKeyPress={(e) => {
                            Validation.CharactersNumbersOnly(e);
                          }}
                          name="dropdown_name"
                          id="dropdown_name"
                          required
                          // onInput={e => handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div class="col">
                    <div className="row mt-4">
                      <div className="col-6">
                        <label>
                          <b>
                            Min To consider double day :
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control form-control-md"
                          onKeyPress={(e) => {
                            Validation.CharactersNumbersOnly(e);
                          }}
                          name="dropdown_name"
                          id="dropdown_name"
                          required
                          // onInput={e => handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>

                  <div class="col">
                    <div className="row mt-4">
                      <div className="col-6">
                        <label>
                          <b>
                            Week off :
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col-md-6">
                        <Select
                          options={weekoffOption}
                          name="from_department_id"
                          id="from_department_id"
                          isMulti
                          required={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div class="col">
                    <div className="row mt-4">
                      <div className="col-md-6">
                        <label>
                          <b>
                            Shift Type :
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col">
                        <Select
                          options={options}
                          name="from_department_id"
                          id="from_department_id"
                          value={selectedOption}
                          onChange={handleOptionChange}
                          required={true}
                        />
                      </div>
                      {selectedOption.value === "Fixed" && (
                        <div className="co-md-6">
                          <div className="row mt-2">
                            <div className="col-md-6">
                              <label>
                                <b>
                                  Start Time:{" "}
                                  <Astrick color="red" size="13px" />
                                </b>
                              </label>
                            </div>
                            <div className="col">
                              <input
                                type="time"
                                className="form-control from-control-sm"
                                name="start_time"
                              ></input>
                            </div>
                          </div>

                          <div className="row mt-2">
                            <div className="col-md-6">
                              <label>
                                <b>
                                  End Time :<Astrick color="red" size="13px" />
                                </b>
                              </label>
                            </div>
                            <div className="col">
                              <input
                                type="time"
                                name="end_time"
                                className=" form-control from-control-sm"
                              ></input>
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedOption.value === "Flexi" && (
                        <div className="co-md-6">
                          <div className="row mt-3">
                            <div className="col-md-6">
                              <label>
                                {" "}
                                <b>
                                  No of Working Hours :
                                  <Astrick color="red" size="15px" />
                                </b>
                              </label>
                            </div>
                            <div className="col-md-6">
                              <input
                                type="text"
                                className="form-control form-control-md"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div class="col">
                    <div className="row mt-4">
                      <div className="col-6">
                        <label>
                          <b>
                            Remark :
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control form-control-md"
                          onKeyPress={(e) => {
                            Validation.CharactersNumbersOnly(e);
                          }}
                          name="dropdown_name"
                          id="dropdown_name"
                          required
                          // onInput={e => handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div class="col">
                    <div className="row mt-4">
                      <div className="col-md-3">
                        <label>
                          <b>
                            Is Active
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col-md-1">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="is_active"
                            id="is_active_1"
                            value="1"
                            // checked={queryTypeData.is_active===1 || queryTypeData.is_active==='1'}
                            // onChange={e => { changeHandler(e); } }
                          />
                          <label className="form-check-label">Yes</label>
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
                            // checked={queryTypeData.is_active===0 || queryTypeData.is_active==='0'}
                            // onChange={e => { changeHandler(e); } }
                          />
                          <label className="form-check-label">No</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="row mt-2">
                  <div className="col-md-3">
                    <label>
                      <b>
                        Shift Name :<Astrick color="red" size="13px" />
                      </b>
                    </label>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersOnly(e);
                      }}
                      name="dropdown_name"
                      id="dropdown_name"
                      required
                      // onInput={e => handleChange(e)}
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-3">
                    <label>
                      <b>
                        Shift Type :<Astrick color="red" size="13px" />
                      </b>
                    </label>
                  </div>
                  <div className="col-md-4">
                    <Select
                      options={options}
                      name="from_department_id"
                      id="from_department_id"
                      value={selectedOption}
                      onChange={handleOptionChange}
                      required={true}
                    />
                  </div>
                </div>
                {selectedOption.value === "Fixed" && (
                  <div>
                    <div className="row mt-2">
                      <div className="col-md-3">
                        <label>
                          <b>
                            Start Time: <Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col-md-3">
                        <input
                          type="time"
                          className="form-control from-control-sm"
                          name="start_time"
                        ></input>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-md-3">
                        <label>
                          <b>
                            End Time :<Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>
                      <div className="col-md-4">
                        <input
                          type="time"
                          name="end_time"
                          className=" form-control from-control-sm"
                        ></input>
                      </div>
                    </div>
                  </div>
                )}
                {selectedOption.value === "Flexi" && (
                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label>
                        {" "}
                        <b>
                          No of Working Hours
                          <Astrick color="red" size="15px" />
                        </b>
                      </label>
                    </div>
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                      />
                    </div>
                  </div>
                )} */}

                {/* <div className="row mt-3">
                  <div className="col-md-3">
                    <label>
                      <b>
                        Grace Period In Min :<Astrick color="red" size="13px" />
                      </b>
                    </label>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersOnly(e);
                      }}
                      required
                    />
                  </div>
                </div> */}

                {/* <div className="row mt-3">
                  <div className="col-md-3">
                    <label>
                      <b>
                        Late Mark period in min after grace period:
                        <Astrick color="red" size="13px" />
                      </b>
                    </label>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersOnly(e);
                      }}
                      name="dropdown_name"
                      id="dropdown_name"
                      required
                      // onInput={e => handleChange(e)}
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-3">
                    <label>
                      <b>
                        Early Out Allowed In Month :
                        <Astrick color="red" size="13px" />
                      </b>
                    </label>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersOnly(e);
                      }}
                      name="dropdown_name"
                      id="dropdown_name"
                      required
                      // onInput={e => handleChange(e)}
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-3">
                    <label>
                      <b>
                        Early Out Allowed In Month :
                        <Astrick color="red" size="13px" />
                      </b>
                    </label>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersOnly(e);
                      }}
                      name="dropdown_name"
                      id="dropdown_name"
                      required
                      // onInput={e => handleChange(e)}
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-3">
                    <label>
                      <b>
                        No Of Late Mark For Half Day :
                        <Astrick color="red" size="13px" />
                      </b>
                    </label>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersOnly(e);
                      }}
                      name="dropdown_name"
                      id="dropdown_name"
                      required
                      // onInput={e => handleChange(e)}
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-3">
                    <label>
                      <b>
                        Min To Consider In Half Day :
                        <Astrick color="red" size="13px" />
                      </b>
                    </label>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersOnly(e);
                      }}
                      name="dropdown_name"
                      id="dropdown_name"
                      required
                      // onInput={e => handleChange(e)}
                    />
                  </div>
                </div> */}

                {/* <div className="row mt-3">
                  <div className="col-md-3">
                    <label>
                      <b>
                        Min To consider one and half day :
                        <Astrick color="red" size="13px" />
                      </b>
                    </label>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersOnly(e);
                      }}
                      name="dropdown_name"
                      id="dropdown_name"
                      required
                      // onInput={e => handleChange(e)}
                    />
                  </div>
                </div> */}

                {/* <div className="row mt-3">
                  <div className="col-md-3">
                    <label>
                      <b>
                        Min To consider double day :
                        <Astrick color="red" size="13px" />
                      </b>
                    </label>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersOnly(e);
                      }}
                      name="dropdown_name"
                      id="dropdown_name"
                      required
                      // onInput={e => handleChange(e)}
                    />
                  </div>
                </div> */}

                {/* <div className="row mt-3">
                  <div className="col-md-3">
                    <label>
                      {" "}
                      <b>
                        {" "}
                        Week off : <Astrick color="red" size="15px" />
                      </b>
                    </label>
                  </div>
                  <div className="col-md-4">
                    <Select
                      options={weekoffOption}
                      name="from_department_id"
                      id="from_department_id"
                      isMulti
                      required={true}
                    />
                  </div>
                </div> */}

                {/* <div className="row mt-3">
                  <div className="col-md-3">
                    <label>
                      <b>
                        Remark :<Astrick color="red" size="13px" />
                      </b>
                    </label>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersOnly(e);
                      }}
                      name="dropdown_name"
                      id="dropdown_name"
                      required
                      // onInput={e => handleChange(e)}
                    />
                  </div>
                </div> */}

                {/* <div className="row mt-4">
                  <div className="col-md-3">
                    <label>
                      <b>
                        Is Active :<Astrick color="red" size="13px" />
                      </b>
                    </label>
                  </div>
                  <div className="col-md-1">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="is_active"
                        id="is_active_1"
                        value="1"
                        // checked={queryTypeData.is_active===1 || queryTypeData.is_active==='1'}
                        // onChange={e => { changeHandler(e); } }
                      />
                      <label className="form-check-label">Yes</label>
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
                        // checked={queryTypeData.is_active===0 || queryTypeData.is_active==='0'}
                        // onChange={e => { changeHandler(e); } }
                      />
                      <label className="form-check-label">No</label>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            {/* } */}

            <div className="d-flex justify-content-end mt-5">
              <button type="submit" className="btn btn-sm btn-primary">
                Submit
              </button>
              {/* <Link to={`/${_base}/DynamicForm`} className="btn btn-sm btn-danger text-white">Cancel</Link> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateShiftMaster;
