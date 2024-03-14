import React, { useEffect, useState, useRef } from "react";
import { Modal, Dropdown } from "react-bootstrap";
import DataTable from "react-data-table-component";
import ErrorLogService from "../../../services/ErrorLogService";
import CountryService from "../../../services/MastersService/CountryService";
import PageHeader from "../../../components/Common/PageHeader";
import Select from "react-select";
import { Astrick } from "../../../components/Utilities/Style";
import * as Validation from "../../../components/Utilities/Validation";
import Alert from "../../../components/Common/Alert";
import StateService from "../../../services/MastersService/StateService";
import CityService from "../../../services/MastersService/CityService";
import PaymentTemplateService from "../../../services/Bill Checking/Masters/PaymentTemplateService";

import BillCheckingService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService";
import { useParams } from "react-router-dom";

function AssignedPerson({ match }) {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [notify, setNotify] = useState();
  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const searchRef = useRef();
  const handleSearch = () => {
    const search = searchRef.current.value;

    const temp = data.filter((d) => {
      return d.assign_to
        .toLowerCase()
        .match(new RegExp(search.toLowerCase(), "g"));
    });
    setData(temp);
  };
  const [country, setCountry] = useState();
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [CountryDropdown, setCountryDropdown] = useState();
  const [stateDropdown, setStateDropdown] = useState();
  const [cityDropdown, setCityDropdown] = useState();
  const fileInputRef = useRef(null);

  const columns = [
    { name: "Sr", selector: (row) => row.counter, sortable: true },
    {
      name: "Bill Id",
      selector: (row) => row.tai_bc_bill_checking_transactions_id,
      sortable: true,
    },
    {
      name: "Approving level",
      selector: (row) => row.approving_level,
      sortable: true,
    },
    { name: "Assign To", selector: (row) => row.assign_to, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
    { name: "Days Count.", selector: (row) => row.days_count, sortable: true },
    { name: "Created At", selector: (row) => row.created_at, sortable: true },
  ];

  const loadData = async () => {
    const data = [];
    await new BillCheckingService().getAssignPersonDetail(id).then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const temp = res.data.data;
        for (const key in temp) {
          data.push({
            counter: counter++,
            id: temp[key].id,
            tai_bc_bill_checking_transactions_id:
              temp[key].tai_bc_bill_checking_transactions_id,
            assign_to: temp[key].assign_to,
            days_count: temp[key].days_count,
            created_at: temp[key].created_at,
            status: temp[key].status,
          });
        }
        setData(null);
        setData(data);
      }
    });

    await new CountryService().getCountry().then((res) => {
      if (res.status === 200) {
        setCountry(res.data.data);
        setCountryDropdown(
          res.data.data.map((d) => ({
            value: d.id,
            label: d.country,
          }))
        );
      }
    });

    await new StateService().getState().then((res) => {
      if (res.status === 200) {
        setState(res.data.data);
        setStateDropdown(
          res.data.data.map((d) => ({
            value: d.id,
            label: d.state,
          }))
        );
      }
    });

    await new CityService().getCity().then((res) => {
      if (res.status === 200) {
        setCity(res.data.data);
        setCityDropdown(
          res.data.data.map((d) => ({
            value: d.id,
            label: d.city,
          }))
        );
      }
    });
  };
  const [importModal, setImportModal] = useState({
    ishowModal: false,
    imodalData: "",
    imodalHeader: "",
  });

  const handleImportModal = (data) => {
    setImportModal(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader headerTitle="Assigned Persons Details" />
      <div className="card card-body">
        <div className="row">
          <div className="col-md-10">
            <input
              type="text"
              className="form-control"
              placeholder="Search...."
              ref={searchRef}
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-sm btn-warning text-white"
              type="button"
              onClick={handleSearch}
              style={{ marginTop: "0px", fontWeight: "600" }}
            >
              <i className="icofont-search-1 "></i> Search
            </button>
            <button
              className="btn btn-sm btn-info text-white"
              type="button"
              onClick={() => window.location.reload(false)}
              style={{ marginTop: "0px", fontWeight: "600" }}
            >
              <i className="icofont-refresh text-white"></i> Reset
            </button>
          </div>
        </div>
      </div>
      {/* DATA TABLE */}
      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {data && (
                <DataTable
                  columns={columns}
                  data={data}
                  defaultSortField="title"
                  pagination
                  selectableRows={false}
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignedPerson;
