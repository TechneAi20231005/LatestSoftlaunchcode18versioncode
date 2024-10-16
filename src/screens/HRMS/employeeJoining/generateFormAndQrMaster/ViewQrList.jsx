import React, { useEffect, useRef, useMemo } from 'react';
import { Card, CardBody, Col, Container, Row, Stack } from 'react-bootstrap';
import { useLocation, useParams } from 'react-router-dom';
import PageHeader from '../../../../components/Common/PageHeader';
import './style.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getQrCodeListById } from '../../../../redux/services/hrms/employeeJoining/qrCodeListMaster';
import Alert from '../../../../components/Common/Alert';

const ViewQrList = () => {
  const dispatch = useDispatch();
  const { qrCodeDetailsData, notify } = useSelector(
    (state) => state?.qrCodeMaster
  );
  const qrRef = useRef(null);
  const location = useLocation();
  const info = useParams();

  const currentId = location?.state?.currentCandidateId || info.id;

  const { data = {} } = qrCodeDetailsData || {};
  const {
    locations = [],
    source = [],
    designations = [],
    email_id,
    contact_no,
    logo_image,
    company_name
  } = data;

  const locationData = useMemo(
    () => locations.map((loc) => loc.location_name).join(', '),
    [locations]
  );

  const sourceData = useMemo(
    () => source.map((src) => src.source_name).join(', '),
    [source]
  );
  const designationData = useMemo(
    () => designations.map((src) => src.designation_name).join(', '),
    [designations]
  );

  const DetailRow = ({ label, value }) => (
    <div className="mb-3 d-flex">
      <span style={{ minWidth: '180px', fontWeight: 'bold' }}>{label}:</span>
      <span style={{ flex: 1, wordWrap: 'break-word', wordBreak: 'break-all' }}>{value || '-'}</span>
    </div>
  );
  const details = [
    { label: 'Logo', value:  logo_image?.split('/')?.pop() },
    { label: 'Company Name', value: company_name },
    { label: 'Source', value: sourceData },
    { label: 'Email ID', value: email_id },
    { label: 'Contact Number', value: contact_no },
    { label: 'Location', value: locationData },
    { label: 'Openings', value: designationData }
  ];
  useEffect(() => {
    dispatch(getQrCodeListById({ currentId: currentId }));
  }, []);

  return (
    <Container fluid>
      {notify && <Alert alertData={notify} />}
      <PageHeader showBackBtn headerTitle="View QR Code Details" />
      <Row className="mt-2 row_gap_3 generate_from_qr_container">
        <Col xs={12} className="form_container">
          <Card className="w-100">
            <CardBody>
              {details.map((detail, index) => (
                <DetailRow
                  key={index}
                  label={detail.label}
                  value={detail.value}
                />
              ))}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewQrList
