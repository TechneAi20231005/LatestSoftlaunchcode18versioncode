import React, { useEffect, useState, useRef } from "react";

import UserService from "../../../services/MastersService/UserService";

function AuthorityMappingViewDetails() {
  const [assign, SetAssign] = useState([{ label: null, value: null }]);
  const [userData, setUserData] = useState([]);
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const tempUserData = [];
  const loadData = async () => {
    const inputRequired = 'id,employee_id,first_name,last_name,middle_name';
    await new UserService().getUserForMyTickets(inputRequired).then((res) => {
            if (res.status === 200) {
        setShowLoaderModal(false);
        const data = res.data.data.filter((d) => d.is_active === 1);
        for (const key in data) {
          tempUserData.push({
            value: data[key].id,
            label:
              data[key].first_name +
              " " +
              data[key].last_name +
              " (" +
              data[key].id +
              ")",
          });
        }
        const aa = tempUserData.sort(function (a, b) {
          return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
        });
        setUserData(aa);
      }
    });
    return (
      <div>
        <h1>
          <table
            className="table table-bordered mt-3 table-responsive mt-5"
            id="tab_logic"
          >
            <thead>
              <tr>
                <th className="text-center"> Sr </th>
                <th className="text-center"> Assign authority to users </th>
                <th className="text-center"> Valid Form </th>
                <th className="text-center"> Valid Till</th>
              </tr>
            </thead>
            <tbody>
              {assign &&
                assign.map((item, idx) => (
                  <tr id={`addr_${idx}`} key={idx}>
                    <td>{idx + 1}</td>

                    <td>
                      <input
                        type="text"
                        isSearchable={true}
                        name="user_id"
                        className="form-control"
                        classNamePrefix="select"
                        options={userData}
                        defaultValue={item.employee}
                        // onChange={handleUserSelect}
                        readOnly
                        required
                        style={{ zIndex: "100" }}
                      />
                    </td>

                    <td>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        name="from_date"
                        //   defaultValue={item.from_date}
                        //   readOnly={modal.modalHeader == "Details"}
                        //   onChange={handleFromDate}
                        required
                      />
                    </td>

                    <td>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        name="to_date"
                        defaultValue={item.to_date}
                        //   readOnly={modal.modalHeader == "Details"}
                        //   onChange={handleToDate}
                        //   min={date}
                        required
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </h1>
      </div>
    );
  };
}
export default AuthorityMappingViewDetails;
