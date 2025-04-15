import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PageHeader from '../../../../components/Common/PageHeader';
import './style.scss';
import { _base } from '../../../../settings/constants';
import { useDispatch, useSelector } from 'react-redux';
import { getQrCodeList } from '../../../../redux/services/hrms/employeeJoining/qrCodeListMaster';
import ViewQrImageModal from './ViewQrImageModal';
import { toast } from 'react-toastify';
import moment from 'moment';
import MaterialTable from '../../../../components/custom/MUI Table/MaterialTable';
import { Box } from '@mui/material';

const GenerateQrList = () => {
  const dispatch = useDispatch();
  const { qrCodeMasterList, isLoading, notify } = useSelector(
    (state) => state?.qrCodeMaster
  );
  const currentDate = moment().format('MM-DD-YYYY');
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState(null);
  const navigate = useNavigate();

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
      accessorKey: 'action',
      header: 'Action',
      size: 110,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <>
          <div style={{ display: 'flex', gap: 12 }}>
            <i
              class="icofont-eye-alt text-primary cp"
              onClick={() =>
                navigate(`${row?.original?.id}`, {
                  state: { currentCandidateId: row?.original?.id }
                })
              }
            />
            <i
              onClick={() => DownloadSvg(row?.original?.qr_scanner)}
              class="icofont-download cp"
            ></i>
          </div>
        </>
      )
    },
    {
      accessorFn: (row, i) => i + 1 || '--',
      header: 'Sr',
      size: 120,
      enableColumnFilter: false
    },
    {
      accessorFn: (originalRow) => originalRow?.logo_image || '--',
      header: 'Logo',
      size: 240,
      Cell: ({ row }) => (
        <a
          href="#"
          onClick={() => {
            if (row?.original?.logo_image) {
              setOpen(true);
              setSrc(row?.original?.logo_image);
            }
          }}
          style={{ textDecoration: 'underline', color: 'blue' }}
        >
          {row?.original?.logo_image?.split('/').pop() || '_'}
        </a>
      )
    },
    {
      accessorFn: (originalRow) => originalRow?.source || '--',
      header: 'Source',
      size: 160,
      Cell: ({ row }) =>
        row?.original?.source?.length > 0
          ? row?.original?.source.map((src) => src.source_name).join(', ')
          : '-'
    },
    {
      accessorFn: (originalRow) => originalRow?.email_id || '--',
      header: 'Email ',
      size: 160
    },
    {
      accessorFn: (originalRow) => originalRow?.contact_no || '--',
      header: 'Contact No',
      size: 200
    },
    {
      accessorFn: (originalRow) => originalRow?.location_name || '--',
      header: 'Location',
      size: 180,
      Cell: ({ row }) =>
        row?.original?.locations?.length > 0
          ? row?.original?.locations
              .map((location) => location.location_name)
              .join(', ')
          : '-'
    },
    {
      accessorFn: (originalRow) => originalRow?.designation_name || '--',
      header: 'Openings',
      size: 200,
      Cell: ({ row }) =>
        row?.original?.designations?.length > 0
          ? row?.original?.designations
              .map((item) => item.designation_name)
              .join(', ')
          : '--'
    },
    {
      accessorFn: (originalRow) => new Date(originalRow.created_at) || '--',
      header: 'Created At',
      filterVariant: 'date-range',
      Cell: ({ cell }) =>
        `${cell.getValue().toLocaleDateString()} ${cell
          .getValue()
          .toLocaleTimeString()}`
    },
    {
      accessorFn: (originalRow) => originalRow?.created_by?.trim() || '--',
      header: 'Created By',
      size: 190
    }
  ];

  useEffect(() => {
    dispatch(getQrCodeList());
  }, []);

  return (
    <Container fluid>
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
      <Box mt={1}>
        {qrCodeMasterList && (
          <MaterialTable
            isLoading={isLoading?.getQrCodeMasterList}
            columns={columns}
            data={qrCodeMasterList}
            isExportData={false}
          />
        )}
      </Box>
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
