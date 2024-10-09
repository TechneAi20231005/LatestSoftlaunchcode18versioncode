import React, { useEffect, useState } from 'react';
import { Col, Container, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PageHeader from '../../../../components/Common/PageHeader';
import { customSearchHandler } from '../../../../utils/customFunction';
import TableLoadingSkelton from '../../../../components/custom/loader/TableLoadingSkelton';
import './style.scss';
import { _base } from '../../../../settings/constants';
import { useDispatch, useSelector } from 'react-redux';
import { getQrCodeList } from '../../../../redux/services/hrms/employeeJoining/qrCodeListMaster';
import Alert from '../../../../components/Common/Alert';
// import ViewQrImageModal from './viewQrImageModal';
import ViewQrImageModal from './ViewQrImageModal';
import { toast } from 'react-toastify';

const GenerateQrList = () => {
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState('');
  const [filterQrList, setFilterQrList] = useState([]);
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getQrCodeList());
  }, []);

  const { qrCodeMasterList, isLoading, notify } = useSelector(
    (state) => state?.qrCodeMaster
  );

  useEffect(() => {
    setFilterQrList(qrCodeMasterList?.data);
    setMessage(notify);
  }, [qrCodeMasterList]);
  const handleSearch = () => {
    const filteredList = customSearchHandler(
      qrCodeMasterList?.data,
      searchValue
    );
    setFilterQrList(filteredList);
  };

  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  const handleReset = () => {
    setSearchValue('');
    setFilterQrList(qrCodeMasterList?.data);
  };
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const formattedDate = `${month}-${day}-${year}`;
  const handleDownload = (pngUrl) => {
    if (pngUrl) {
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
     downloadLink.download = `${'QR Code'}-${formattedDate}.jpg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success("QR Code downloaded successfully");
    }
  };

  const columns = [
    {
      name: 'Action',
      selector: (row) => (
        <>
          <div style={{ display: 'flex', gap: 12 }}>
            <i
              class="icofont-eye-alt text-primary cp"
              onClick={() =>
                navigate(`${row?.id}`, {
                  state: { currentCandidateId: row?.id }
                })
              }
            />
            <i
              onClick={() => handleDownload(row?.qr_scanner)}
              class="icofont-download cp"
            ></i>
          </div>
        </>
      ),
      sortable: false,
      width: '70px'
    },
    {
      name: 'Sr. No.',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '70px'
    },
    {
      name: 'Logo',
      sortable: true,
      width: "150px",
      selector: (row) => (
        <a
          href="#"
          onClick={() => {
           if(row?.logo_image){
            setOpen(true);
            setSrc(row?.logo_image);
           }
          }}
          style={{ textDecoration: 'underline', color: 'blue' }}
        >

          {row?.logo_image?.split('/').pop() || '_'}
        </a>
      )
    },

    {
      name: 'Source',
      selector: (row) =>
        row?.source?.length > 0
          ? row.source.map((src) => src.source_name).join(', ')
          : '-',
      sortable: true
    },

    {
      name: 'Email ',
      selector: (row) => row?.email_id || '--',
      sortable: true
    },
    {
      name: 'Contact No',
      selector: (row) => row?.contact_no || '--',
      sortable: true
    },
    {
      name: 'Location',
      selector: (row) =>
        row?.locations?.length > 0
          ? row.locations.map((location) => location.location_name).join(', ')
          : '-',
      sortable: true
    },
    {
      name: 'Openings',
      selector: (row) =>
        row.designations.length > 0
          ? row.designations.map((item) => item.designation_name).join(', ')
          : '-',
      sortable: true
    },
    {
      name: 'Created At',
      selector: (row) => row?.created || '--',
      sortable: true
    }
  ];

  return (
    <Container fluid>
      {message && <Alert alertData={message} />}

      <PageHeader
        headerTitle="QR Generator"
        renderRight={() => {
          return (
            <Link to={`/${_base + '/create-qr-generator'}`}>
              <button className="btn btn-dark px-5">
                <i className="icofont-plus me-2 fs-6" />
                Generate QR
              </button>
            </Link>
          );
        }}
      />
      <Row className="row_gap_3">
        <Col xs={12} md={7} xxl={8}>
          <input
            type="search"
            name="interview_search"
            value={searchValue}
            onChange={(e) => setSearchValue(e?.target?.value)}
            placeholder="Enter candidate name..."
            className="form-control"
          />
        </Col>
        <Col
          xs={12}
          md={5}
          xxl={4}
          className="d-flex justify-content-sm-end btn_container"
        >
          <button
            className="btn btn-warning text-white"
            type="button"
            onClick={handleSearch}
          >
            <i className="icofont-search-1 " /> Search
          </button>
          <button
            className="btn btn-info text-white"
            type="button"
            onClick={handleReset}
          >
            <i className="icofont-refresh text-white" /> Reset
          </button>
        </Col>
      </Row>
      <DataTable
        columns={columns}
        data={filterQrList}
        // defaultSortField="role_id"
        pagination
        selectableRows={false}
        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
        highlightOnHover={true}
        progressPending={isLoading?.getQrCodeMasterList}
        progressComponent={<TableLoadingSkelton />}
      />
      {open && (
        <ViewQrImageModal
          show={open}
          src={src}
          onClose={() => setOpen(false)}
          close={() => setOpen(false)}
        />
      )}
    </Container>
  );
};

export default GenerateQrList;
