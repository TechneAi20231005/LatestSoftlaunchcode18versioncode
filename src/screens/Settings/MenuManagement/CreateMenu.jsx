import React from 'react';

import PageHeader from '../../../components/Common/PageHeader';

import { CustomerDropdown } from '../../Masters/CustomerMaster/CustomerComponent';

export default function CreateMenu() {
  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Create Menu" />

      <div className="row clearfix g-3">
        <div className="col-sm-12">
          <div className="card mt-2">
            <div className="card-body">
              <form method="post" encType="multipart/form-data">
                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>Select Customer :</b>
                  </label>
                  <div className="col-sm-4">
                    <CustomerDropdown
                      id="department_id"
                      name="department_id"
                      placeholder=""
                      required={true}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
