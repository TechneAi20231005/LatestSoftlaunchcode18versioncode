import React, { Component } from 'react';
import DynamicFormService from '../../../services/MastersService/DynamicFormService';
import Select from 'react-select';
import 'react-select-plus/dist/react-select-plus.css';

export default class DynamicFormDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      defaultValue: []
    };
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    new DynamicFormService().getDynamicForm().then((res) => {
      const data = [];
      const defaultValue = [];

      if (res.status === 200) {
        const temp = res.data.data;
        for (const key in temp) {
          data.push({
            value: temp[key].id.toString(),
            label: temp[key].template_name
          });

          if (this.props.defaultValue && this.props.defaultValue !== '') {
            if (Array.isArray(this.props.defaultValue)) {
              if (this.props.defaultValue.includes(temp[key].id.toString())) {
                defaultValue.push({
                  value: temp[key].id.toString(),
                  label: temp[key].template_name
                });
              }
            } else {
              if (this.props.defaultValue === temp[key].id) {
                defaultValue.push({
                  value: temp[key].id.toString(),
                  label: temp[key].template_name
                });
              }
            }
          }
        }
        this.setState({ defaultValue: defaultValue });
        this.setState({ data: data });
      }
    });
  }

  render() {
    if (this.props.defaultValue && this.state.defaultValue?.length > 0) {
      return (
        <>
          <span style={{ display: 'none' }}></span>
          <Select
            defaultValue={this.state.defaultValue}
            options={this.state.data}
            id={this.props.id}
            name={this.props.name}
            isMulti={this.props.isMulti ? true : false}
            isClearable={true}
            required={this.props.required ? true : false}
            onChange={this.props.onChange ? this.props.onChange : ''}
          />
        </>
      );
    } else {
      return (
        <>
          <Select
            options={this.state.data}
            id={this.props.id}
            name={this.props.name}
            isMulti={this.props.isMulti ? true : false}
            isClearable={true}
            required={this.props.required ? true : false}
            onChange={this.props.onChange ? this.props.onChange : ''}
          />
        </>
      );
    }
  }
}
