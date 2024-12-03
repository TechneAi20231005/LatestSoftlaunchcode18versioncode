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
import ViewQrImageModal from './ViewQrImageModal';
import { toast } from 'react-toastify';
import moment from 'moment';

const GenerateQrList = () => {
  const dispatch = useDispatch();
  const { qrCodeMasterList, isLoading, notify } = useSelector(
    (state) => state?.qrCodeMaster
  );
  const currentDate = moment().format('MM-DD-YYYY');
  const [searchValue, setSearchValue] = useState('');
  const [filterQrList, setFilterQrList] = useState([]);
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    const filteredList = customSearchHandler(
      qrCodeMasterList?.data,
      searchValue
    );
    setFilterQrList(filteredList);
  };

  const handleReset = () => {
    setSearchValue('');
    setFilterQrList(qrCodeMasterList?.data);
  };

  const DownloadSvg = (svgData) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgSize = 800;
    canvas.width = svgSize;
    canvas.height = svgSize;
    const img = new Image();
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml'
    });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      // const currentDate = new Date().toISOString().split('T')[0];
      // YYYY-MM-DD format for filename
      link.href = pngUrl;
      link.download = `QR_Code-
${currentDate}
.png`;
      document.body.appendChild(link);
      link.click();
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('QR Code downloaded successfully');
    };
    img.onerror = (error) => {
      console.error('Error loading image', error);
      toast.error('Failed to download QR Code');
    };
    img.src = url;
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
              // onClick={() => handleDownload(row?.qr_scanner)}
              onClick={() => DownloadSvg(row?.qr_scanner)}
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
      width: '120px',
      selector: (row) => (
        <a
          href="#"
          onClick={() => {
            if (row?.logo_image) {
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
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row?.source?.length > 0 &&
            row.source.map((src, index) => (
              <OverlayTrigger
                key={index}
                overlay={<Tooltip>{src.source_name}</Tooltip>}
              >
                <span>{src.source_name}</span>
              </OverlayTrigger>
            ))}
        </div>
      )
    },

    {
      name: 'Email ',
      selector: (row) => row?.email_id || '--',
      sortable: true,
      width: '150px',
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <OverlayTrigger overlay={<Tooltip>{row?.email_id}</Tooltip>}>
            <span className="ms-0">{row?.email_id || '--'}</span>
          </OverlayTrigger>
        </div>
      )
    },
    {
      name: 'Contact No',
      selector: (row) => row?.contact_no || '--',
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <OverlayTrigger overlay={<Tooltip>{row?.contact_no}</Tooltip>}>
            <span>{row?.contact_no || '--'}</span>
          </OverlayTrigger>
        </div>
      )
    },
    {
      name: 'Location',
      selector: (row) =>
        row?.locations?.length > 0
          ? row.locations.map((location) => location.location_name).join(', ')
          : '-',
      sortable: true,
      cell: (row) => {
        const locationNames = row?.locations
          ?.map((location) => location.location_name)
          .join(', ');

        return (
          <div
            className="btn-group"
            role="group"
            aria-label="Basic outlined example"
          >
            {row?.locations?.length > 0 ? (
              <OverlayTrigger
                overlay={<Tooltip>{locationNames || '-'}</Tooltip>}
              >
                <span>{locationNames || '-'}</span>
              </OverlayTrigger>
            ) : (
              '-'
            )}
          </div>
        );
      }
    },

    {
      name: 'Openings',
      selector: (row) =>
        row.designations.length > 0
          ? row.designations.map((item) => item.designation_name).join(', ')
          : '-',
      sortable: true,
      cell: (row) => {
        const designationNames = row?.designations
          ?.map((designation) => designation.designation_name)
          .join(', ');

        return (
          <div
            className="btn-group"
            role="group"
            aria-label="Basic outlined example"
          >
            {row.designations.length > 0 ? (
              <OverlayTrigger
                overlay={<Tooltip>{designationNames || '-'}</Tooltip>}
              >
                <span>{designationNames || '-'}</span>
              </OverlayTrigger>
            ) : (
              '-'
            )}
          </div>
        );
      }
    },
    {
      name: 'Created At',
      selector: (row) => row?.created_at || '--',
      sortable: true
    },
    {
      name: 'Created By',
      selector: (row) => row?.created_by || '--',
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <OverlayTrigger overlay={<Tooltip>{row?.created_by}</Tooltip>}>
            <span>{row?.created_by || '--'}</span>
          </OverlayTrigger>
        </div>
      )
    }
  ];
  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  useEffect(() => {
    dispatch(getQrCodeList());
  }, []);

  useEffect(() => {
    setFilterQrList(qrCodeMasterList?.data);
    setMessage(notify);
  }, [qrCodeMasterList]);

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
            placeholder="Search here..."
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
        persistTableHead={true}
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
