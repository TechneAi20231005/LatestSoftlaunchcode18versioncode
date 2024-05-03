import React, { useEffect, useState } from "react";
import MyTicketService from "../../../services/TicketService/MyTicketService";
import PageHeader from "../../../components/Common/PageHeader";
import DataTable from "react-data-table-component";
import Select from "react-select";
import PaymentDetailsService from "../../../services/Bill Checking/PaymentDetailsService";
import { userSessionData } from "../../../settings/constants";
import { useParams } from "react-router-dom";

const PaymentHistory = ({ match }) => {
  const { id } = useParams();

  const [data, setData] = useState();

  const columns = [
    { name: "Sr No", selector: (row) => row.counter, sortable: true },
    {
      name: " Operation",
      selector: (row) => row.operation,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("operation"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },

    { name: "Bill ID", selector: (row) => row.bill_no, sortable: true },

    {
      name: "Bill Type",
      selector: (row) => row.bill_type_id_name,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("bill_type_id_name"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },

    {
      name: " Vendor Name",
      selector: (row) => row.vendor_id_name,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("vendor_id_name"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },

    {
      name: "Amount To Be Paid",
      selector: (row) => row.amount_to_be_paid,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("amount_to_be_paid"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },

    {
      name: "Status",
      selector: (row) => row.payment_status_name,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("payment_status_name"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },

    {
      name: "Payment Date",
      selector: (row) => row.payment_date,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("payment_date"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },

    {
      name: "Remark",
      selector: (row) => row.remark,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("remark"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },

    {
      name: " Actual Payment Date",
      selector: (row) => row.actual_payment_date,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("actual_payment_date"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },

    {
      name: "Payment Ref No",
      selector: (row) => row.payment_reference_number,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("payment_reference_number"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },

    {
      name: "IP Address",
      selector: (row) => row.ip_address,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("ip_address"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },

    {
      name: "Created At",
      selector: (row) => row.created_at,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("created_at"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },
    {
      name: "Created By",
      selector: (row) => row.created_by,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("created_by"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },
    {
      name: "Updated At",
      selector: (row) => row.updated_at,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("updated_at"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },

    {
      name: "Updated By",
      selector: (row) => row.updated_by,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("updated_by"),
          style: {
            color: "red",
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },
  ];

  const loadData = async () => {
    await new PaymentDetailsService()
      .getPaymentDetailsHistory(id)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            let counter = 1;
            const tempData = [];
            const temp = res.data.data;

            for (const key in temp) {
              tempData.push({
                counter: counter++,
                id: temp[key].id,
                bill_no: temp[key].bill_no,
                operation: temp[key].operation,
                tai_bc_bill_checking_transactions_id:
                  temp[key].tai_bc_bill_checking_transactions_id,
                bill_type_name: temp[key].bill_type_name,
                bill_type_id_name: temp[key].bill_type_id_name,
                vendor_name: temp[key].vendor_name,
                expected_bill_received_date:
                  temp[key].expected_bill_received_date,
                amount_to_be_paid: temp[key].amount_to_be_paid,
                payment_date: temp[key].payment_date,
                user_agent: temp[key].user_agent,
                ip_address: temp[key].ip_address,
                actual_payment_date: temp[key].actual_payment_date,
                vendor_id_name: temp[key].vendor_id_name,
                payment_reference_number: temp[key].payment_reference_number,

                payment_status_name: temp[key].payment_status_name,
                remark: temp[key].remark,
                created_at: temp[key].created_at,
                created_by: temp[key].created_by,
                updated_at: temp[key].updated_at,
                updated_by: temp[key].updated_by,
                changes: temp[key].changes,
              });
            }
            setData(tempData);
          }
        }
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div>
        {/* Page Header */}
        <div className="container-xxl">
          <PageHeader headerTitle="Payment History" />
        </div>
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
    </>
  );
};

export default PaymentHistory;
