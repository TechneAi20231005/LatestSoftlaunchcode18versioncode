import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useParams } from 'react-router-dom';
import SubModuleService from '../../services/ProjectManagementService/SubModuleService';
import PageHeader from '../../components/Common/PageHeader';
const ProjectWiseModuleHistory = ({ match }) => {
  const { id } = useParams();
  const [data, setData] = useState();

  const columns = [
    { name: 'Sr', selector: (row) => row.counter, sortable: true },

    {
      name: 'Document Name',
      selector: (row) => row.document_attachment,
      sortable: true,
      width: '250px',
      cell: (row) => {
        let file = row.document_attachment;
        let splittedName = file ? file.split('/') : '';
        let fileName = splittedName[splittedName.length - 1];

        return (
          <div
            className="btn-group"
            role="group"
            aria-label="Basic outlined example"
          >
            {file && (
              <OverlayTrigger overlay={<Tooltip>{fileName}</Tooltip>}>
                <div>
                  <span className="ms-1 d-block">
                    {fileName && fileName.length < 20
                      ? fileName
                      : fileName.substring(0, 50) + '....'}
                  </span>
                </div>
              </OverlayTrigger>
            )}
          </div>
        );
      },
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('level_approver'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ]
    },

    {
      name: ' Updated At',
      selector: (row) => row.updated_at,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('updated_at'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ]
    },
    {
      name: ' Updated By',
      selector: (row) => row.updated_by,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('updated_by'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ]
    },
    {
      name: ' Deleted At',
      selector: (row) => row.deleted_at,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('deleted_at'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ]
    },
    {
      name: ' Deleted By',
      selector: (row) => row.deleted_by,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) =>
            row.changes &&
            row.changes.length > 1 &&
            row.changes.includes('deleted_by'),
          style: {
            color: 'red',
            fontWeight: 'bold',
            '&:hover': {
              cursor: 'pointer'
            }
          }
        }
      ]
    }
  ];

  const loadData = async () => {
    await new SubModuleService().getHistoryOfDOcument(id).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          let counter = 1;
          const tempData = [];
          const temp = res.data.data;
          console.log('temp', temp);
          for (const key in temp) {
            tempData.push({
              counter: counter++,
              id: temp[key].id,
              document_attachment: temp[key].document_attachment,
              updated_at: temp[key].updated_at,
              updated_by: temp[key].updated_by,
              deleted_at: temp[key].deleted_at,
              deleted_by: temp[key].deleted_by
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
          <PageHeader headerTitle="Project Wise Module History" />
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

export default ProjectWiseModuleHistory;
