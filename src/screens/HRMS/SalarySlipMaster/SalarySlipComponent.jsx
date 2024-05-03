import React, { useEffect, useState, useRef } from "react";
import PageHeader from "../../../components/Common/PageHeader";
import { Astrick } from "../../../components/Utilities/Style";
import Select from "react-select";
import CountryService from "../../../services/MastersService/CountryService";
import Alert from "../../../components/Common/Alert";

function SalarySlipComponent() {
  const options = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const YearOptions = [
    { value: 1, label: "2015" },
    { value: 2, label: "2016" },
    { value: 3, label: "2017" },
    { value: 4, label: "2018" },
    { value: 5, label: "2019" },
    { value: 6, label: "2020" },
    { value: 7, label: "2021" },
    { value: 8, label: "2022" },
    { value: 9, label: "2023" },
  ];

  const [roletype, setRoleType] = useState();
  const [salarySlip, setSalarySlip] = useState();
  const [notify, setNotify] = useState();
  const [selectrole, setSelectRole] = useState();
  const [error, setError] = useState("");
  const selectRef = useRef(null);

  const handleForm = async () => {
    await new CountryService().getRoleType().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setSelectRole(res.data.data.filter((d) => d.is_active === 1));
          const roleTypes = res.data.data[0].on_roll_type;
          setSelectRole(roleTypes.filter((d) => d.is_active === 1));
          setRoleType(
            roleTypes
              .filter((d) => d.is_active === 1)
              .map((d) => ({
                value: d.id,
                label: d.name,
              }))
          );
        }
      }
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    // Check if any mandatory field is empty
    if (!data.get("roll_type") || !data.get("month") || !data.get("year")) {
      setError("Please fill all mandatory fields");
      return;
    }

    setError(""); // Clear error message

    const selectedOnRollType = roletype.find(
      (option) => option.value === parseInt(data.get("roll_type"))
    );
    const selectedMonth = options.find(
      (option) => option.value === parseInt(data.get("month"))
    );
    const selectedYear = YearOptions.find(
      (option) => option.value === parseInt(data.get("year"))
    );

    if (selectedOnRollType) {
      data.set("roll_type", selectedOnRollType.label);
    }
    if (selectedMonth) {
      data.set("month", selectedMonth.label);
    }
    if (selectedYear) {
      data.set("year", selectedYear.label);
    }

    const currentDate = new Date();
    const selectedDate = new Date(data.get("year"), data.get("month") - 1); // Month is zero-based

    if (selectedDate > currentDate) {
      setError("Invalid date. Please select a past or current date.");
      return;
    }
    await new CountryService()
      .salarySlip(data)
      .then((res) => {
        setNotify(null);
        if (res.status === 200) {
          if (res.data.status === 1) {
            setNotify({ type: "success", message: res.data.message });

            setSalarySlip(res.data.data);
            const a = document.createElement("a");

            a.href = res.data.data;

            a.download = "salary_slip.pdf";
            a.click();
            const newData = res.data;
            selectRef.current.focus();

            const data = res.data;
          } else {
            setNotify({ type: "danger", message: res.data.message });
          }
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
      });
  };

  useEffect(() => {
    handleForm();
  }, []);

  return (
    <div>
      <div className="container-xxl">
        {notify && (
          <>
            {" "}
            <Alert alertData={notify} />{" "}
          </>
        )}
        <PageHeader headerTitle="Salary Slip" renderRight={() => {}} />
      </div>

      <form
        onSubmit={submitHandler}
        method="post"
        enctype="multipart/form-data"
      >
        <div className="card card-body m-4" style={{ height: "150px" }}>
          {error && <Alert alertData={{ type: "danger", message: error }} />}

          <div className="form-group row">
            <label className="col-sm-3 col-form-label">
              <b>
                Your Role Type : <Astrick color="red" />
                <div className="mt-3">
                  <Select
                    options={roletype}
                    id="roll_type"
                    name="roll_type"
                    required={true}
                    autoFocus
                    ref={selectRef}
                  />
                </div>
              </b>
            </label>
            <label className="col-sm-3 col-form-label">
              <b>
                Month : <Astrick color="red" />
                <div className="mt-3">
                  <Select
                    options={options}
                    id="month"
                    name="month"
                    required={true}
                    isRequired={true}
                  />
                </div>
              </b>
            </label>
            <label className="col-sm-3 col-form-label">
              <b>
                Year : <Astrick color="red" />
                <div className="mt-3">
                  <Select
                    options={YearOptions}
                    id="year"
                    name="year"
                    required={true}
                    isRequired={true}
                  />
                </div>
              </b>
            </label>
          </div>
        </div>

        <div className="button-container">
          <button
            type="du"
            className="btn btn-primary text-white"
            style={{ backgroundColor: "#484C7F" }}
          >
            Submit
          </button>

          <button type="button" className="btn btn-danger text-white">
            Close
          </button>
        </div>
      </form>
    </div>
  );
}

export default SalarySlipComponent;
