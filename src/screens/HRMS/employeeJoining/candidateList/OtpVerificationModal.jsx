import React, { useEffect, useState } from 'react';
import OTPInput from 'react-otp-input';
import CustomModal from '../../../../components/custom/modal/CustomModal';
import { RenderIf } from '../../../../utils';
import CustomAlertModal from '../../../../components/custom/modal/CustomAlertModal';

function OtpVerificationModal({ show, close, addCandidateClose }) {
  // // local state
  const [OTPValue, setOTPValue] = useState('');
  const [isErrorOTP, setIsErrorOTP] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  // // function
  const handleChange = otp => {
    if (isErrorOTP && otp.length === 4) {
      setIsErrorOTP(false);
    }
    setOTPValue(otp);
  };

  const handleVerify = () => {
    if (OTPValue?.length === 4) {
      setIsErrorOTP(false);
      setOpenSuccessModal(true);
    } else {
      setIsErrorOTP(true);
    }
  };

  const handelResendCode = () => {
    console.log('dd');
  };

  // // this functionality add for demo purposes in feature it will be removed
  useEffect(() => {
    if (openSuccessModal) {
      setTimeout(() => {
        close();
        setOpenSuccessModal(false);
        addCandidateClose();
      }, 1000);
    }
  }, [openSuccessModal]);
  return (
    <>
      <CustomModal show={show} width="sm">
        <div className="text-center pt-3 pb-2 ">
          <h3 className="text_primary fw-bold">Enter OTP</h3>
          <p className="mb-0">Received on your mobile number</p>
          <div className="py-4">
            <OTPInput
              value={OTPValue}
              onChange={handleChange}
              numInputs={4}
              renderInput={props => <input {...props} />}
              shouldAutoFocus={true}
              containerStyle={{ display: 'flex', justifyContent: 'center' }}
              inputStyle={{
                margin: '0 5px',
                padding: '10px',
                width: '40px',
                height: '40px',
                borderRadius: '5px',
                border: '1px solid',
                borderColor: isErrorOTP ? '#c52626' : '#ced4da',
                color: isErrorOTP ? '#c52626' : '#484c7f',
                fontSize: '20px',
                fontWeight: '600',
              }}
            />
            <RenderIf render={isErrorOTP}>
              <p className="invalid-feedback d-block mb-0 mt-1">
                {OTPValue.length === 0 ? 'Please enter your code' : 'Please enter correct code'}
              </p>
            </RenderIf>
          </div>

          <p className="pb-3">
            If you don't receive a code!{' '}
            <u className="fw-bold cp" onClick={handelResendCode}>
              Resend
            </u>
          </p>
          <button className="btn btn-dark" onClick={handleVerify}>
            VERIFY CODE
          </button>
        </div>
      </CustomModal>
      <CustomAlertModal
        show={openSuccessModal}
        type="success"
        message="Our team review your application and contact you shortly."
        heading="Profile has been submitted successfully!"
        footerMsg="Your Reference ID : TT56898"
      />
    </>
  );
}

export default OtpVerificationModal;
