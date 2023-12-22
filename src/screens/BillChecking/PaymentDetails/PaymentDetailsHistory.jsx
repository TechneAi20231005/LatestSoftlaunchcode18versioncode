import React, { useEffect, useState } from 'react'
import MyTicketService from '../../../services/TicketService/MyTicketService'
import PageHeader from "../../../components/Common/PageHeader";
import DataTable from "react-data-table-component";
import Select from "react-select";
import PaymentDetailsHistory from '../../../services/Bill Checking/PaymentDetailsService';

const PaymentDetailsHistory = ({ match }) => {
  const id = match.params.id

  const [data, setData] = useState()

  const columns = [
    { name: "Sr", selector: (row) => row.counter, sortable: true, },
    {
      name: " Operation", selector: (row) => row.operation, sortable: true,
      conditionalCellStyles: [
        {
          when: row => row.changes && row.changes.length > 1 && row.changes.includes("operation"),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },

      ]
    },

    { name: "Id", selector: (row) => row.bc_id, sortable: true },
    { name: "Bill Type", selector: (row) => row.bill_type, sortable: true },
    { name: "Assign To", selector: (row) => row.assign_to, sortable: true },
    {
      name: " Vendor Name", selector: (row) => row.vendor_name, sortable: true,
      conditionalCellStyles: [
        {
          when: row => row.changes && row.changes.length > 1 && row.changes.includes("expected_solve_date"),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },

      ]
    },
    {
      name: "Expected Bill Received Date", selector: (row) => row.expected_bill_received_date, sortable: true,
      conditionalCellStyles: [
        {
          when: row => row.changes && row.changes.length > 1 && row.changes.includes("expected_solve_date"),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },

      ]
    },
    { name: "Vendor Bill No", selector: (row) => row.vendor_bill_no, sortable: true,
    conditionalCellStyles: [
      {
        when: row => row.changes && row.changes.length > 1 && row.changes.includes("vendor_bill_no"),
        style: {
          color: 'red',
          fontWeight: 'bold',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },

    ]
  },
    { name: "Bill Date", selector: (row) => row.bill_date, sortable: true,
    conditionalCellStyles: [
      {
        when: row => row.changes && row.changes.length > 1 && row.changes.includes("bill_date"),
        style: {
          color: 'red',
          fontWeight: 'bold',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },

    ]
  },
    {
      name: "Recieved Date", selector: (row) => row.recieved_date, sortable: true,
      conditionalCellStyles: [
        {
          when: row => row.changes && row.changes.length > 1 && row.changes.includes("project_name"),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },

      ]
    },
    {
      name: "Debit Advance", selector: (row) => row.debit_advance, sortable: true,
      conditionalCellStyles: [
        {
          when: row => row.changes && row.changes.length > 1 && row.changes.includes("module_name"),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },

      ]
    },
    {
      name: "Taxable Amount", selector: (row) => row.taxable_amount, sortable: true,
      conditionalCellStyles: [
        {
          when: row => row.changes && row.changes.length > 1 && row.changes.includes("sub_module_name"),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },

      ]
    },
    { name: "Igst Amount", selector: (row) => row.igst_amount, sortable: true,
    conditionalCellStyles: [
      {
        when: row => row.changes && row.changes.length > 1 && row.changes.includes("igst_amount"),
        style: {
          color: 'red',
          fontWeight: 'bold',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },

    ]
  },
    { name: "gst Amount", selector: (row) => row.gst_amount, sortable: true,
    conditionalCellStyles: [
      {
        when: row => row.changes && row.changes.length > 1 && row.changes.includes("gst_amount"),
        style: {
          color: 'red',
          fontWeight: 'bold',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },

    ]
  },
    {
      name: "Round Off", selector: (row) => row.round_off, sortable: true,
      conditionalCellStyles: [
        {
          when: row => row.changes && row.changes.length > 1 && row.changes.includes("project_name"),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },

      ]
    },
    {
      name: "TCS", selector: (row) => row.tcs, sortable: true,
      conditionalCellStyles: [
        {
          when: row => row.changes && row.changes.length > 1 && row.changes.includes("assign_to_user"),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },

      ]
    },
    {
      name: "Bill Amount", selector: (row) => row.bill_amount, sortable: true,
      conditionalCellStyles: [
        {
          when: row => row.changes && row.changes.length > 1 && row.changes.includes("department"),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },

      ]
    },
    {
      name: "TDS Applicable", selector: (row) => row.is_tds_applicable, sortable: true,
      conditionalCellStyles: [
        {
          when: row => row.changes && row.changes.length > 1 && row.changes.includes("status"),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },

      ]
    },
    { name: "Tds Percentage", selector: (row) => row.tds_percentage, sortable: true,
    conditionalCellStyles: [
      {
        when: row => row.changes && row.changes.length > 1 && row.changes.includes("tds_percentage"),
        style: {
          color: 'red',
          fontWeight: 'bold',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },

    ]
  },
    { name: "TDS Section", selector: (row) => row.tds_section, sortable: true,
    conditionalCellStyles: [
      {
        when: row => row.changes && row.changes.length > 1 && row.changes.includes("tds_section"),
        style: {
          color: 'red',
          fontWeight: 'bold',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },

    ]
  },
    { name: "TDS Constitution", selector: (row) => row.tds_constitution, sortable: true,
    conditionalCellStyles: [
      {
        when: row => row.changes && row.changes.length > 1 && row.changes.includes("tds_constitution"),
        style: {
          color: 'red',
          fontWeight: 'bold',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },

    ]
  },
    { name: "TDS Amount", selector: (row) => row.tds_amount, sortable: true,
    conditionalCellStyles: [
      {
        when: row => row.changes && row.changes.length > 1 && row.changes.includes("tds_amount"),
        style: {
          color: 'red',
          fontWeight: 'bold',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },

    ]
  },
    {
      name: "Net Payment In Words", selector: (row) => row.net_payment_in_word, sortable: true, conditionalCellStyles: [
        {
          when: row => row.changes && row.changes.length > 1 && row.changes.includes("operation"),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },

      ]
    },
    { name: "Payment Date", selector: (row) => row.payment_date, sortable: true, 
    conditionalCellStyles: [
      {
        when: row => row.changes && row.changes.length > 1 && row.changes.includes("payment_date"),
        style: {
          color: 'red',
          fontWeight: 'bold',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },

    ]
  },
    { name: "Is Active", selector: (row) => (row.is_active === 1 ? 'ACTIVE' : "DEACTIVE"), sortable: true },
    { name: "Remark", selector: (row) => row.remark, sortable: true, 
    conditionalCellStyles: [
      {
        when: row => row.changes && row.changes.length > 1 && row.changes.includes("remark"),
        style: {
          color: 'red',
          fontWeight: 'bold',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },

    ]
  },
    { name: "Audit Remark", selector: (row) => row.audit_remark, sortable: true,
    conditionalCellStyles: [
      {
        when: row => row.changes && row.changes.length > 1 && row.changes.includes("audit_remark"),
        style: {
          color: 'red',
          fontWeight: 'bold',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },

    ]
  },
    { name: "Invoice Attachment", selector: (row) => row.invoice_attachment, sortable: true,
    conditionalCellStyles: [
      {
        when: row => row.changes && row.changes.length > 1 && row.changes.includes("invoice_attachment"),
        style: {
          color: 'red',
          fontWeight: 'bold',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },

    ]
  },
    { name: "External Audit Remark", selector: (row) => row.external_audit_remark, sortable: true,
    conditionalCellStyles: [
      {
        when: row => row.changes && row.changes.length > 1 && row.changes.includes("external_audit_remark"),
        style: {
          color: 'red',
          fontWeight: 'bold',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },

    ]
  },
    { name: "Created At", selector: (row) => row.created_at, sortable: true,
    conditionalCellStyles: [
      {
        when: row => row.changes && row.changes.length > 1 && row.changes.includes("created_at"),
        style: {
          color: 'red',
          fontWeight: 'bold',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },

    ]
  },
    { name: "Created By", selector: (row) => row.created_by, sortable: true,
    conditionalCellStyles: [
      {
        when: row => row.changes && row.changes.length > 1 && row.changes.includes("created_by"),
        style: {
          color: 'red',
          fontWeight: 'bold',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },

    ]
  },
    { name: "Updated At", selector: (row) => row.updated_at, sortable: true,
    conditionalCellStyles: [
      {
        when: row => row.changes && row.changes.length > 1 && row.changes.includes("updated_at"),
        style: {
          color: 'red',
          fontWeight: 'bold',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },

    ]
  },
    { name: "Updated By", selector: (row) => row.updated_by, sortable: true,
    conditionalCellStyles: [
      {
        when: row => row.changes && row.changes.length > 1 && row.changes.includes("updated_by"),
        style: {
          color: 'red',
          fontWeight: 'bold',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },

    ]
  },

  ]

  // const conditionalRowStyles = [
  //   {
  //     when: row => row.operation=="UPDATE",
  //     style: {
  //       color: "red"
  //     }
  //   }
  // ];

  const loadData = async () => {

    await new PaymentDetailsHistory().getPaymentDetails(id).then(res => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          let counter = 1;
          const tempData = [];
          const temp = res.data.data
          for (const key in temp) {
            tempData.push({
              counter: counter++,
              id: temp[key].id,
              operation: temp[key].operation,
              bc_id: temp[key].bc_id,
              bill_type: temp[key].bill_type,
              assign_to: temp[key].assign_to,
              vendor_name: temp[key].vendor_name,
              expected_bill_received_date: temp[key].expected_bill_received_date,
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
              is_tds_applicable: temp[key].is_tds_applicable,
              tds_percentage: temp[key].tds_percentage,
              tds_section: temp[key].tds_section,
              tds_constitution: temp[key].tds_constitution,
              tds_amount: temp[key].tds_amount,
              net_payment: temp[key].net_payment,
              net_payment_in_word: temp[key].net_payment_in_word,
              payment_date: temp[key].payment_date,
              is_active: temp[key].is_active,
              remark: temp[key].remark,
              audit_remark: temp[key].audit_remark,
              invoice_attachment: temp[key].invoice_attachment,
              external_audit_remark: temp[key].external_audit_remark,
              created_at: temp[key].created_at,
              created_by: temp[key].created_by,
              updated_at: temp[key].updated_at,
              updated_by: temp[key].updated_by,
              vendor_id_name: temp[key].vendor_id_name,
              bill_type_name: temp[key].bill_type_name,


            })
          }
          setData(tempData)
        }
      }
    })
  }

  useEffect(() => {
    loadData();
  }, [])

  return (
    <>
      <div>
        {/* Page Header */}
        <div className="container-xxl">
          <PageHeader headerTitle="Bill Check History" />
        </div>
        <div className='card mt-2'>
          <div className='card-body'>
            <div className="row clearfix g-3">
              <div className="col-sm-12">
                {data && <DataTable

                  columns={columns}
                  data={data}
                  defaultSortField="title"
                  pagination
                  selectableRows={false}
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                // conditionalRowStyles={conditionalRowStyles}
                />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentDetailsHistory
