import React from "react";
import PageHeader from "../../../components/Common/PageHeader";
import { Astrick } from "../../../components/Utilities/Style";
import Select from "react-select";

function CreateRoastedShiftMaster() {
  const options = [
    { value: "Flexi Tuesday", label: "Fexi Tuesday" },
    { value: "Rotational Shift", label: "Rotational Shift" },
    { value: "Flexi Thursday", label: "Flexi Thursday" },
    { value: "Flexi Friday", label: "Flexi Friday" },
    { value: "Flexi Sunday", label: "Flexi Sunday" },
    { value: "Flexi Monday", label: "Flexi Monday" },
    { value: "Flexi Wednesday", label: "Flexi Wednesday" },
    { value: "Flexi Saturday", label: "Flexi Saturday" },
    { value: "Rotational Shift Bmt HO", label: "Rotational Shift Bmt HO" },
    { value: "Security Shift ", label: "Security Shift" },
  ];

  

  return (
    <div>
      <div className="container-xxl">
        <PageHeader headerTitle="Roasted Shift Master" />
        <div className="card mt-2">
          <div className="card-body">
            <form>
              <div className="row">
                <div className="col-md-4 m-2">
                  <label>
                    <b>
                      Emp Id : <Astrick color="red" size="13px" />{" "}
                    </b>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-md mt-2"
                  />
                </div>
                <div className="col-md-4 m-2">
                  <label>
                    <b>
                      Employee: <Astrick color="red" size="13px" />{" "}
                    </b>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-md mt-2"
                  />
                </div>
                <div className="col-md-4 m-2">
                  <label>
                    <b>
                      From Date : <Astrick color="red" size="13px" />{" "}
                    </b>
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-md mt-2"
                  />
                </div>
                <div className="col-md-4 m-2">
                  <label>
                    <b>
                      To Date: <Astrick color="red" size="13px" />{" "}
                    </b>
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-md mt-2"
                  />
                </div>
                <div className="col-md-4 m-2">
                  <label>
                    <b>
                      Shift Type : <Astrick color="red" size="13px" />{" "}
                    </b>
                  </label>
                  <Select
                    options={options}
                    name="options"
                    id="options"
                    placeholder="----Select Shift Type----"
                  />
                </div>
              </div>
              <div className="mt-4">
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{ backgroundColor: "#484C7F" }}
              >
                Submit
              </button>
              <button
                type="submit"
                className="btn btn-danger text-white"
               
              >
                Cancel
              </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRoastedShiftMaster;
