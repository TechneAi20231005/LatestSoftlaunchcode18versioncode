import React, { useState, useEffect } from 'react';
import ProjectService from '../../../services/ProjectManagementService/ProjectService';
import Select from 'react-select';
import 'react-select-plus/dist/react-select-plus.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { errorHandler } from '../../../utils';

export default function ProjectDropdown(props) {
  const [data, setData] = useState([]);
  const [value, setValue] = useState([]);

  const loadData = () => {
    getData();
  };

  const getData = async () => {
    new ProjectService()
      .getProject()
      .then((res) => {
        const data = [];
        const defaultValue = [];

        if (res.status === 200) {
          const temp = res.data.data;
          for (const key in temp) {
            data.push({
              labelKey: temp[key].id,
              value: temp[key].project_name
            });
          }
          setData(data);
          setValue(defaultValue);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  useEffect(() => {
    loadData();
  });

  return (
    <>
      {value && props.defaultValue?.length > 0 && (
        <span>
          Here
          <Select
            classNamePrefix="react-select"
            defaultValue={value}
            options={data}
            id={props.id}
            name={props.name}
            isMulti={props.isMulti ? true : false}
            isClearable={true}
            required={props.required ? true : false}
            onChange={props.onChange ? this.props.onChange : ''}
          />
        </span>
      )}

      {
        <Select
          classNamePrefix="react-select"
          options={data}
          id={props.id}
          name={props.name}
          isMulti={props.isMulti ? true : false}
          isClearable={true}
          required={props.required ? true : false}
          onChange={props.onChange ? props.onChange : ''}
        />
      }
    </>
  );
}
