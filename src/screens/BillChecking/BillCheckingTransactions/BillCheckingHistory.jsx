import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MyTicketService from "../../../services/TicketService/MyTicketService";
import PageHeader from "../../../components/Common/PageHeader";
import DataTable from "react-data-table-component";
import Select from "react-select";
import BillCheckingService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
const BillCheckingHistory = ({ match }) => {
  const { id } = useParams();

  const [data, setData] = useState();

  const columns = [
    { name: "Sr", selector: (row) => row.counter, sortable: true },
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

    {
      name: "Bill Id",
      selector: (row) => row.bc_id,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("bc_id"),
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
      name: "Bill Type",
      selector: (row) => row.bill_type,
      sortable: true,
      width: "220px",
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("bill_type"),
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
      name: "Assign To",
      selector: (row) => row.assign_to,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("assign_to"),
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
      name: "Vendor Name",
      selector: (row) => row.vendor_name,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("vendor_name"),
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
      name: "Vendor Bill No",
      selector: (row) => row.vendor_bill_no,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("vendor_bill_no"),
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
      name: "Bill Date",
      selector: (row) => row.bill_date,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("bill_date"),
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
      name: "Received Date",
      selector: (row) => row.received_date,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("received_date"),
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
      name: "Debit Advance",
      selector: (row) => row.debit_advance,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("debit_advance"),
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
      name: "Taxable Amount",
      selector: (row) => row.taxable_amount,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("taxable_amount"),
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
      name: "Igst Amount",
      selector: (row) => row.igst_amount,
      sortable: true,

      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("igst_amount"),
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
      name: "Gst Amount",
      selector: (row) => row.gst_amount,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("gst_amount"),
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
      name: "Round Off",
      selector: (row) => row.round_off,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("round_off"),
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
      name: "TCS",
      selector: (row) => row.tcs,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("tcs"),
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
      name: "Bill Amount",
      selector: (row) => row.bill_amount,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("bill_amount"),
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
      name: "TDS Applicable",
      selector: (row) => row.is_tds_applicable,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_tds_applicable === 1 && (
            <span className="badge bg-primary">YES</span>
          )}
          {row.is_tds_applicable === 0 && (
            <span className="badge bg-danger">NO</span>
          )}
        </div>
      ),
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("is_tds_applicable"),
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
      name: "TCS Applicable",
      selector: (row) => row.is_tcs_applicable,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_tcs_applicable === 1 && (
            <span className="badge bg-primary">YES</span>
          )}
          {row.is_tcs_applicable === 0 && (
            <span className="badge bg-danger">NO</span>
          )}
        </div>
      ),
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("is_tcs_applicable"),
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
      name: "Original Bill Needed",
      selector: (row) => row.is_original_bill_needed,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_original_bill_needed === 1 && (
            <span className="badge bg-primary">YES</span>
          )}
          {row.is_original_bill_needed === 0 && (
            <span className="badge bg-danger">NO</span>
          )}
        </div>
      ),
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("is_original_bill_needed"),
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
      name: "TDS Section",
      selector: (row) => row.tds_section,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("tds_section"),
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
      name: "TDS Constitution",
      selector: (row) => row.tds_constitution,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("tds_constitution"),
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
      name: "TDS Percentage",
      selector: (row) => row.tds_percentage,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("tds_percentage"),
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
      name: "TDS Amount",
      selector: (row) => row.tds_amount,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("tds_amount"),
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
      name: "Net Payment",
      selector: (row) => row.net_payment,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("net_payment"),
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
      selector: (row) => row.payment_status,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("payment_status"),
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
      selector: (row) => row.narration,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("narration"),
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
      name: "Internal Audit Remark",
      selector: (row) => row.audit_remark,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("audit_remark"),
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
      name: "External Audit Remark",
      selector: (row) => row.external_audit_remark,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("external_audit_remark"),
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
      name: "Upload Attachment",
      selector: (row) => row.invoice_attachment,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("invoice_attachment"),
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
      name: "Authorized by management",
      selector: (row) => row.authorized_by_management,
      sortable: true,
      cell: (row) => (
        <div>
          {row.authorized_by_management == 1 && (
            <span className="badge bg-primary">YES</span>
          )}
          {row.authorized_by_management == 0 && (
            <span className="badge bg-danger">NO</span>
          )}
        </div>
      ),
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("authorized_by_management"),
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
      name: "Authorized by HOD",
      selector: (row) => row.authorized_by_hod,
      sortable: true,
      cell: (row) => (
        <div>
          {row.authorized_by_hod == 1 && (
            <span className="badge bg-primary">YES</span>
          )}
          {row.authorized_by_hod == 0 && (
            <span className="badge bg-danger">NO</span>
          )}
        </div>
      ),
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("authorized_by_hod"),
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
      name: "Itration",
      selector: (row) => row.iteration,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("iteration"),
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
      name: "Levels Of Approval",
      selector: (row) => row.level,
      sortable: true,

      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("level"),
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
      name: "Pending from",
      selector: (row) => row.level_approver,
      sortable: true,
      width: "250px",
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.level_approver && (
            <OverlayTrigger overlay={<Tooltip>{row.level_approver} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.level_approver && row.level_approver.length < 20
                    ? row.level_approver
                    : row.level_approver.substring(0, 50) + "...."}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("level_approver"),
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
      name: "Approved by",
      selector: (row) => row.approved_by,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("approved_by"),
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
      name: "Rejected by",
      selector: (row) => row.is_rejected_by,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("is_rejected_by"),
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
      name: "Is canceled",
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_active == 0 && <span className="badge bg-danger">YES</span>}
          {row.is_active == 1 && <span className="badge bg-primary">NO</span>}
        </div>
      ),
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes("is_canceled"),
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
    await new BillCheckingService().getBillCheckHistory(id).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          let counter = 1;
          const tempData = [];
          const temp = res.data.data;
          for (const key in temp) {
            tempData.push({
              counter: counter++,
              id: temp[key].id,
              main_id: temp[key].main_id,
              operation: temp[key].operation,
              bc_id: temp[key].bc_id,
              bill_type: temp[key].bill_type,
              assign_to: temp[key].assign_to,
              vendor_name: temp[key].vendor_name,
              expected_bill_received_date:
                temp[key].expected_bill_received_date,
              vendor_bill_no: temp[key].vendor_bill_no,
              expected_bill_received_date: temp[key].passed_status,
              bill_date: temp[key].bill_date,
              received_date: temp[key].received_date,
              debit_advance: temp[key].debit_advance,
              taxable_amount: temp[key].taxable_amount,
              igst_amount: temp[key].igst_amount,
              gst_amount: temp[key].gst_amount,
              round_off: temp[key].round_off,
              tcs: temp[key].tcs,
              bill_amount: temp[key].bill_amount,
              payment_status: temp[key].payment_status,
              is_tds_applicable: temp[key].is_tds_applicable,
              is_tcs_applicable: temp[key].is_tcs_applicable,
              level_approver: temp[key].level_approver,
              is_original_bill_needed: temp[key].is_original_bill_needed,

              tds_percentage: temp[key].tds_percentage,
              tds_section: temp[key].tds_section,
              tds_percentage: temp[key].tds_percentage,
              is_rejected_by: temp[key].is_rejected_by,
              level: temp[key].level,

              tds_constitution: temp[key].tds_constitution,
              tds_amount: temp[key].tds_amount,
              net_payment: temp[key].net_payment,
              net_payment_in_word: temp[key].net_payment_in_word,
              payment_date: temp[key].payment_date,
              is_active: temp[key].is_active,
              remark: temp[key].remark,
              narration: temp[key].narration,
              audit_remark: temp[key].audit_remark,
              invoice_attachment: temp[key].invoice_attachment,
              external_audit_remark: temp[key].external_audit_remark,
              created_at: temp[key].created_at,
              created_by: temp[key].created_by,
              updated_at: temp[key].updated_at,
              updated_by: temp[key].updated_by,
              vendor_id: temp[key].vendor_id,
              bill_type_name: temp[key].bill_type_name,
              changes: temp[key].changes,
              is_canceled: temp[key].is_canceled,
              operation: temp[key].operation,
              ip_address: temp[key].ip_address,
              hold_amount: temp[key].hold_amount,
              actual_amount_paid: temp[key].actual_amount_paid,
              actual_payment_date: temp[key].actual_payment_date,
              net_payment: temp[key].net_payment,
              iteration: temp[key].iteration,
              payment_status: temp[key].payment_status,
              assigned_from: temp[key].assigned_from,
              total_level: temp[key].total_level,
              approved_by: temp[key].approved_by,
              authorized_by_hod: temp[key].authorized_by_hod,
              authorized_by_management: temp[key].authorized_by_management,
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
          <PageHeader headerTitle="Bill Check History" />
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

export default BillCheckingHistory;
