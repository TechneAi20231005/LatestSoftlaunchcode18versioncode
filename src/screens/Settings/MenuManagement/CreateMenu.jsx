import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import CustomerMappingService from '../../../services/SettingService/CustomerMappingService'
import { callMultipleURL } from '../../../services/DynamicService/MultipleCallService'

import { _base, masterURL } from '../../../settings/constants'

import DataTable from "react-data-table-component";
import ErrorLogService from "../../../services/ErrorLogService";
import PageHeader from "../../../components/Common/PageHeader";
import Alert from "../../../components/Common/Alert";
import Select from 'react-select';

import { CustomerDropdown } from '../../Masters/CustomerMaster/CustomerComponent'
import { CustomerTypeDropdown } from '../../Masters/CustomerTypeMaster/CustomerTypeComponent'
import { ProjectDropdown } from '../../ProjectManagement/ProjectMaster/ProjectComponent'
import { ModuleDropdown } from '../../ProjectManagement/ModuleMaster/ModuleComponent'
import { SubModuleDropdown } from '../../ProjectManagement/SubModuleMaster/SubModuleComponent'
import { TemplateDropdown } from '../../Masters/TemplateMaster/TemplateComponent'
import { DepartmentDropdown } from '../../Masters/DepartmentMaster/DepartmentComponent'
import { QueryTypeDropdown } from '../../Masters/QueryTypeMaster/QueryTypeComponent'
import { DynamicFormDropdown } from '../../Masters/DynamicFormMaster/DynamicFormComponent'

export default function CreateMenu({ location }) {
    const [dependent, setDependent] = useState({ project_id: null, module_id: null, sub_module_id: null });

    const handleDependent = (e, name) => {
        setDependent({
            ...dependent,
            [name]: e.value
        });
    }
    const [approach, setApproach] = useState();
    const handleApproach = e => {
        setApproach(e.target.value);
    }

    const loadData = async () => {

    }

    useEffect(() => {
        loadData();
    }, [])

    return (
        <div className="container-xxl">


            <PageHeader headerTitle="Create Menu" />

            <div className="row clearfix g-3">
                <div className="col-sm-12">
                    <div className='card mt-2'>
                        <div className='card-body'>
                            <form method="post" encType='multipart/form-data'>
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
    )
}
