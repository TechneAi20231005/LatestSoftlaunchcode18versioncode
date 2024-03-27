import React, { useState, useEffect } from "react";
import PageHeader from "../../../components/Common/PageHeader";
import { _base } from "../../../settings/constants";
import { Link, useParams } from "react-router-dom";
import PaymentTemplateService from "../../../services/Bill Checking/Masters/PaymentTemplateService";
import VendorMasterService from "../../../services/Bill Checking/Masters/VendorMasterService";

const ViewPaymentTemplateDetails = ({ match }) => {
  const { id } = useParams();
  const templateId = id;
  const [data, setData] = useState(null);

  const loadData = async () => {
    await new PaymentTemplateService()
      .getPaymentTemplateById(templateId)
      .then((res) => {
        if (res.status === 200) {
          const temp = res.data.data;
          setData(temp);
        }
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <PageHeader headerTitle="Payment Template Details" />
      <div className="deadline-form mt-5">
        <div className="row g-3 mb-3">
          <div className="col-sm-4">
            <label className="form-label font-weight-bold">
              Template Name :
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              id="template_name"
              name="template_name"
              readOnly
              defaultValue={data && data.template_name}
            />
          </div>

          <div className="col-sm-4">
            <label className="form-label font-weight-bold">
              Payment Type :
            </label>
            <select
              type="text"
              className="form-control"
              id="payment_type"
              name="payment_type"
              required={true}
              disabled
            >
              <option value="">Select Payment Type</option>
              <option
                selected={data && data.payment_type_name == "Monthly"}
                value="Monthly"
              >
                Monthly
              </option>
              <option
                selected={data && data.payment_type_name == "Weekly"}
                value="Weekly"
              >
                Weekly
              </option>
            </select>
          </div>
          <div className="col-sm-4">
            <label className="form-label font-weight-bold">
              Bill Date Type :
            </label>

            <select
              type="text"
              className="form-control"
              id="bill_type"
              name="bill_type"
              disabled
            >
              <option value="">Select Bill Type</option>
              <option
                selected={data && data.bill_type_name == "Bill Date"}
                value="Bill Date"
              >
                Bill Date
              </option>
              <option
                selected={data && data.bill_type_name == "Received Date"}
                value="Received Date"
              >
                Received Date
              </option>
            </select>
          </div>
        </div>

        <div className="row g-3 mb-3">
          {data && data.payment_weekly != "" && (
            <div className="col-sm-4">
              <label className="form-label font-weight-bold">
                Payment Weekly :
              </label>
              <input
                className="form-control"
                id="payment_weekly"
                name="payment_weekly[]"
                defaultValue={data && data.payment_weekly}
                isMulti
                readOnly
              />
            </div>
          )}

          <div className="col-sm-4">
            <label className="form-label font-weight-bold">Bill Day :</label>
            <input
              type="text"
              className="form-control form-control-sm"
              id="bill_day"
              name="bill_day"
              defaultValue={data && data.bill_day}
              readOnly
            />
          </div>

          <div className="col-sm-4">
            <label className="form-label font-weight-bold">Min Days :</label>
            <input
              type="number"
              className="form-control form-control-sm"
              id="min_days"
              name="min_days"
              defaultValue={data && data.min_days}
              readOnly
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-sm-12">
            <label className="form-label font-weight-bold">Remark :</label>
            <textarea
              type="text"
              className="form-control form-control-sm"
              id="remark"
              name="remark"
              defaultValue={data && data.remark}
              readOnly
            />
          </div>

          <div className="col-sm-12">
            <label className="form-label font-weight-bold">Status :</label>
            <div className="row">
              <div className="col-md-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="is_active"
                    key={Math.random()}
                    id="is_active"
                    value="1"
                    disabled
                    defaultChecked={data && data.is_active === 1}
                  />
                  <label className="form-check-label" htmlFor="is_active_1">
                    Active
                  </label>
                </div>
              </div>
              <div className="col-md-1">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="is_active"
                    key={Math.random()}
                    id="is_active"
                    value="0"
                    disabled
                    defaultChecked={data && data.is_active === 0}
                  />
                  <label className="form-check-label" htmlFor="is_active">
                    Deactive
                  </label>
                </div>
              </div>

              <div className="mt-3" style={{ textAlign: "right" }}>
                <Link
                  to={`/${_base}/paymentTemplateMaster`}
                  className="btn btn-danger text-white"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPaymentTemplateDetails;
