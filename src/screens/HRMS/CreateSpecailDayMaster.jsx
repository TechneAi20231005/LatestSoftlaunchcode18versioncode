import React from "react";
import PageHeader from "../../components/Common/PageHeader";
import { Astrick } from "../../components/Utilities/Style";

function CreateSpecailDayMaster() {
  return (
    <div className="container-xxl ">
      <PageHeader headerTitle="Special Day Master" />
      <div className="card mt-2 ">
        <div className="card-body">
          <div className="row">
            <div class="col mt-2">
              <div className="row mt-4">
                <div className="col-1">
                  <label>
                    <b>
                      Year :
                      <Astrick color="red" size="13px" />
                    </b>
                  </label>
                </div>
                <div className="col-md-3">
                  <input
                    type="year"
                    className="form-control form-control-md"
                    onKeyPress={(e) => {
                      //   Validation.CharactersNumbersOnly(e);
                    }}
                    name="dropdown_name"
                    id="dropdown_name"
                    required
                    // onInput={e => handleChange(e)}
                  />
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-1">
                  <label>
                    <b>
                      Date :
                      <Astrick color="red" size="13px" />
                    </b>
                  </label>
                </div>
                <div className="col-md-3">
                  <input
                    type="date"
                    className="form-control form-control-md"
                    onKeyPress={(e) => {
                      //   Validation.CharactersNumbersOnly(e);
                    }}
                    name="dropdown_name"
                    id="dropdown_name"
                    required
                    // onInput={e => handleChange(e)}
                  />
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-1">
                  <label>
                    <b>
                      Month :
                      <Astrick color="red" size="13px" />
                    </b>
                  </label>
                </div>
                <div className="col-md-3">
                  <input
                    type="month"
                    className="form-control form-control-md"
                    onKeyPress={(e) => {
                      //   Validation.CharactersNumbersOnly(e);
                    }}
                    name="dropdown_name"
                    id="dropdown_name"
                    required
                    // onInput={e => handleChange(e)}
                  />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-1">
                  <label>
                    <b>
                      Weightage:
                      <Astrick color="red" size="13px" />
                    </b>
                  </label>
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control form-control-md"
                    onKeyPress={(e) => {
                      //   Validation.CharactersNumbersOnly(e);
                    }}
                    name="dropdown_name"
                    id="dropdown_name"
                    required
                    // onInput={e => handleChange(e)}
                  />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-2">
                  <label>
                    <b>
                      Is Active:
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
                    />
                    <label className="form-check-lable">Yes</label>
                  </div>
                </div>
                <div className="col-md-1">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="is_active"
                      id="is_active_1"
                      value="0"
                    />
                    <label className="form-check-lable">No</label>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-2">
                  <label>
                    <b>
                     Only For Present
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
                    />
                    <label className="form-check-lable">Yes</label>
                  </div>
                </div>
                <div className="col-md-1">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="is_active"
                      id="is_active_1"
                      value="0"
                    />
                    <label className="form-check-lable">No</label>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-5">
                <button type="submit" className="btn btn-sm btn-primary mx-">
                  Submit
                </button>
                <button type="submit" className="btn btn-sm btn-danger">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSpecailDayMaster;
