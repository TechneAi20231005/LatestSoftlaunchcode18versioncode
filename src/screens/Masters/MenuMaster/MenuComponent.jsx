import React, { useState } from 'react';
import { Accordion } from 'react-bootstrap';
import PageHeader from '../../../components/Common/PageHeader';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { handleModalInStore } from '../../Dashboard/DashbordSlice';
import { useDispatch } from 'react-redux';
import EditMenu from './AddEditMenu';
function MenuComponent() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="mb-5">
        <PageHeader
          headerTitle="Menu Master"
          renderRight={() => {
            return (
              <div>
                {/* {checkRole && checkRole[0]?.can_create === 1 ? ( */}
                <button
                  className="btn btn-dark px-5"
                  onClick={() => {
                    setShow(true);
                  }}
                >
                  <i className="icofont-plus me-2 fs-6" />
                  Add Menu
                </button>
                {/* ) : (
                ''
              )} */}
              </div>
            );
          }}
        />
        <SearchBoxHeader
          // setSearchTerm={setSearchTerm}
          // handleSearch={handleSearch}
          // handleReset={handleReset}
          placeholder="Search by menu name...."
          // exportFileName="Menu Master Record"
          // exportData={exportMenuData}
          // showExportButton={true}
        />
      </div>

      <Accordion>
        <div className="mb-4 shadow">
          <Accordion.Item eventKey="0">
            <Accordion.Header className="fs-4 fw-bold text-primary accordian-button:after ">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div className="d-flex align-items-center">
                  <i className="icofont-home fs-4 text-primary ms-3"></i>
                  <span className="fs-5 ms-3"> Benefits Invoices </span>
                </div>
                <div>
                  <i
                    onClick={() => setShow(true)}
                    className="icofont-edit text-primary fs-6"
                  ></i>
                </div>
              </div>
            </Accordion.Header>

            <Accordion.Body className="p-0">
              <table className="table table-bordered table-hover">
                <thead style={{ borderBottom: '2px solid #dad5d5' }}>
                  <tr>
                    <th
                      style={{ border: '1px solid #dad5d5' }}
                      className="col-1 px-2 py-3 text-center"
                    >
                      Sr.No.
                    </th>
                    <th
                      style={{ border: '1px solid #dad5d5' }}
                      className="col-1 px-2 py-3 text-center"
                    >
                      Action
                    </th>
                    <th
                      style={{ border: '1px solid #dad5d5' }}
                      className="col-2 px-2 py-3 text-center"
                    >
                      Status
                    </th>
                    <th
                      style={{ border: '1px solid #dad5d5' }}
                      className="col-4 px-2 py-3"
                    >
                      Name
                    </th>
                    <th
                      style={{ border: '1px solid #dad5d5' }}
                      className="col-4 px-2 py-3"
                    >
                      Creation Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      1
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <i className="icofont-edit text-success"></i>
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <span
                        className="badge bg-primary"
                        style={{ width: '4rem', border: '1px solid #dad5d5' }}
                      >
                        Active
                      </span>
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      DN Limited
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      03/27/2017
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      2
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <i className="icofont-edit text-success"></i>
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <span
                        className="badge bg-primary"
                        style={{ width: '4rem', border: '1px solid #dad5d5' }}
                      >
                        Active
                      </span>
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      DN Limited
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      03/27/2017
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      3
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <i className="icofont-edit text-success"></i>
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <span
                        className="badge bg-primary"
                        style={{ width: '4rem', border: '1px solid #dad5d5' }}
                      >
                        Active
                      </span>
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      DN Limited
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      03/27/2017
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      4
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <i className="icofont-edit text-success"></i>
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <span
                        className="badge bg-primary"
                        style={{ width: '4rem', border: '1px solid #dad5d5' }}
                      >
                        Active
                      </span>
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      DN Limited
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      03/27/2017
                    </td>
                  </tr>
                </tbody>
              </table>
            </Accordion.Body>
          </Accordion.Item>
        </div>
        <div className="mb-4 shadow">
          <Accordion.Item eventKey="1">
            <Accordion.Header className="fs-4 fw-bold text-primary accordian-button:after">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div className="d-flex align-items-center">
                  <i className="icofont-home fs-4 text-primary ms-3"></i>
                  <span className="fs-5 ms-3"> Harbinger Invoices </span>
                </div>
                <div>
                  <i
                    onClick={() => console.log('hello')}
                    className="icofont-edit text-primary fs-6"
                  ></i>
                </div>
              </div>
            </Accordion.Header>

            <Accordion.Body className="p-0">
              <table className="table table-bordered table-hover">
                <thead style={{ borderBottom: '2px solid #dad5d5' }}>
                  <tr>
                    <th
                      style={{ border: '1px solid #dad5d5' }}
                      className="col-1 px-2 py-3 text-center"
                    >
                      Sr.No.
                    </th>
                    <th
                      style={{ border: '1px solid #dad5d5' }}
                      className="col-1 px-2 py-3 text-center"
                    >
                      Action
                    </th>
                    <th
                      style={{ border: '1px solid #dad5d5' }}
                      className="col-2 px-2 py-3 text-center"
                    >
                      Status
                    </th>
                    <th
                      style={{ border: '1px solid #dad5d5' }}
                      className="col-4 px-2 py-3"
                    >
                      Name
                    </th>
                    <th
                      style={{ border: '1px solid #dad5d5' }}
                      className="col-4 px-2 py-3"
                    >
                      Creation Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      1
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <i className="icofont-edit text-success"></i>
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <span
                        className="badge bg-primary"
                        style={{ width: '4rem', border: '1px solid #dad5d5' }}
                      >
                        Active
                      </span>
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      DN Limited
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      03/27/2017
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      2
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <i className="icofont-edit text-success"></i>
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <span
                        className="badge bg-primary"
                        style={{ width: '4rem', border: '1px solid #dad5d5' }}
                      >
                        Active
                      </span>
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      DN Limited
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      03/27/2017
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      3
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <i className="icofont-edit text-success"></i>
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <span
                        className="badge bg-primary"
                        style={{ width: '4rem', border: '1px solid #dad5d5' }}
                      >
                        Active
                      </span>
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      DN Limited
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      03/27/2017
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      4
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <i className="icofont-edit text-success"></i>
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <span
                        className="badge bg-primary"
                        style={{ width: '4rem', border: '1px solid #dad5d5' }}
                      >
                        Active
                      </span>
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      DN Limited
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      03/27/2017
                    </td>
                  </tr>
                </tbody>
              </table>
            </Accordion.Body>
          </Accordion.Item>
        </div>
        <div className="mb-4 shadow">
          <Accordion.Item eventKey="2">
            <Accordion.Header className="fs-4 fw-bold text-primary accordian-button:after">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div className="d-flex align-items-center">
                  <i className="icofont-home fs-4 text-primary ms-3"></i>
                  <span className="fs-5 ms-3"> Dental Invoices </span>
                </div>
                <div>
                  <i
                    onClick={() => console.log('hello')}
                    className="icofont-edit text-primary fs-6"
                  ></i>
                </div>
              </div>
            </Accordion.Header>

            <Accordion.Body className="p-0">
              <table className="table table-bordered table-hover">
                <thead style={{ borderBottom: '2px solid #dad5d5' }}>
                  <tr>
                    <th
                      style={{ border: '1px solid #dad5d5' }}
                      className="col-1 px-2 py-3 text-center"
                    >
                      Sr.No.
                    </th>
                    <th
                      style={{ border: '1px solid #dad5d5' }}
                      className="col-1 px-2 py-3 text-center"
                    >
                      Action
                    </th>
                    <th
                      style={{ border: '1px solid #dad5d5' }}
                      className="col-2 px-2 py-3 text-center"
                    >
                      Status
                    </th>
                    <th
                      style={{ border: '1px solid #dad5d5' }}
                      className="col-4 px-2 py-3"
                    >
                      Name
                    </th>
                    <th
                      style={{ border: '1px solid #dad5d5' }}
                      className="col-4 px-2 py-3"
                    >
                      Creation Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      1
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <i className="icofont-edit text-success"></i>
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <span
                        className="badge bg-primary"
                        style={{ width: '4rem', border: '1px solid #dad5d5' }}
                      >
                        Active
                      </span>
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      DN Limited
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      03/27/2017
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      2
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <i className="icofont-edit text-success"></i>
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <span
                        className="badge bg-primary"
                        style={{ width: '4rem', border: '1px solid #dad5d5' }}
                      >
                        Active
                      </span>
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      DN Limited
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      03/27/2017
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      3
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <i className="icofont-edit text-success"></i>
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <span
                        className="badge bg-primary"
                        style={{ width: '4rem', border: '1px solid #dad5d5' }}
                      >
                        Active
                      </span>
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      DN Limited
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      03/27/2017
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      4
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <i className="icofont-edit text-success"></i>
                    </td>
                    <td
                      style={{ border: '1px solid #dad5d5' }}
                      className="p-3 text-center"
                    >
                      <span
                        className="badge bg-primary"
                        style={{ width: '4rem', border: '1px solid #dad5d5' }}
                      >
                        Active
                      </span>
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      DN Limited
                    </td>
                    <td style={{ border: '1px solid #dad5d5' }} className="p-3">
                      03/27/2017
                    </td>
                  </tr>
                </tbody>
              </table>
            </Accordion.Body>
          </Accordion.Item>
        </div>
      </Accordion>
      <EditMenu show={show} onClose={() => setShow(false)} />
    </>
  );
}

export default MenuComponent;
