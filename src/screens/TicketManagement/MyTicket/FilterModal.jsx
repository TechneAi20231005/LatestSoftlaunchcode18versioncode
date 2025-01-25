import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Field, Form, Formik } from 'formik';
import { RenderIf } from '../../../utils';
import Select from 'react-select';
import animatedComponents from 'react-select/animated';

const FilterModal = ({
  showModal,
  setShowModal,
  allUsersData,
  allStatusData,
  allDepartmentData,
  setAllUsersData,
  onSubmit
}) => {
  const onChangeHandler = (selectedOptions, setFieldValue, type) => {
    try {
      const departmentId = selectedOptions[selectedOptions.length - 1].value;

      // Filter assigned users for Assigned Department
      if (type === 'assign_to_department_id') {
        const assignedUsersAsPerDepartment = allUsersData.data
          .filter((user) =>
            user.departments.find(
              (department) => department.id === departmentId
            )
          )
          .map((user) => ({
            value: user.id,
            label: `${user.first_name} ${user.middle_name} ${user.last_name}`
          }));

          console.log(assignedUsersAsPerDepartment,"assignedUsersAsPerDepartment")

        setAllUsersData((prevState) => ({
          ...prevState,
          assignedUsersAsPerDepartment
        }));

        setFieldValue('assigned_user', []); // Reset "Assigned User" on department change
      }

      // Filter entry users for Entry Department
      if (type === 'department_id') {
        const entryUsersAsPerDepartment = allUsersData.data
          .filter((user) =>
            user.departments.find(
              (department) => department.id === departmentId
            )
          )
          .map((user) => ({
            value: user.id,
            label: `${user.first_name} ${user.middle_name} ${user.last_name}`
          }));

        setAllUsersData((prevState) => ({
          ...prevState,
          entryUsersAsPerDepartment
        }));

        setFieldValue('entry_user', []); // Reset "Entry User" on department change
      }
    } catch (error) {
      console.error(error);
    }
  };

  const inputDataList = [
    { id: 1, name: 'From Date', type: 'date', placeholder: 'Enter From Date' },
    { id: 2, name: 'To Date', type: 'date', placeholder: 'Select To Date' },
    {
      id: 3,
      name: 'Assigned Department',
      type: 'dropdown',
      placeholder: 'Select Assigned Department',
      options: allDepartmentData.selectData,
      onChange: (selectedOptions, setFieldValue) =>
        onChangeHandler(
          selectedOptions,
          setFieldValue,
          'assign_to_department_id'
        )
    },
    {
      id: 4,
      name: 'Assigned User',
      type: 'dropdown',
      placeholder: 'Select Assigned User',
      options:
        allUsersData.assignedUsersAsPerDepartment ||
        allUsersData?.data?.map((user) => ({
          value: user.id,
          label: `${user.first_name} ${user.middle_name} ${user.last_name}`
        }))
    },
    {
      id: 5,
      name: 'Entry Department',
      type: 'dropdown',
      placeholder: 'Select Entry Department',
      options: allDepartmentData.selectData,
      onChange: (selectedOptions, setFieldValue) =>
        onChangeHandler(selectedOptions, setFieldValue, 'department_id')
    },
    {
      id: 6,
      name: 'Entry User',
      type: 'dropdown',
      placeholder: 'Select Entry User',
      options:
        allUsersData.entryUsersAsPerDepartment ||
        allUsersData?.data?.map((user) => ({
          value: user.id,
          label: `${user.first_name} ${user.middle_name} ${user.last_name}`
        }))
    },
    {
      id: 7,
      name: 'Select Status',
      type: 'dropdown',
      placeholder: 'Enter Status',
      options: allStatusData.selectData
    },
    {
      id: 8,
      name: 'Ticket Id',
      type: 'input',
      placeholder: 'Enter Ticket Id'
    }
  ];

  const initialValues = {
    from_date: '',
    to_date: '',
    assigned_department: [],
    assigned_user: [],
    entry_department: [],
    entry_user: [],
    // assign_to_department_id: [],
    // assign_to_user_id: [],
    // user_id: [],
    status_id: [],
    ticket_id: '',
    export: ''
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => onSubmit(values)}
      // enableReinitialize
    >
      {({ values, setFieldValue }) => (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Filter Ticket
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="row align-items-center">
                {inputDataList.map((item) => (
                  <div key={item.id} className="col-lg-6">
                    <RenderIf render={item.type === 'date'}>
                      <label className="form-label fw-bold mb-2">
                        {item.name}:
                      </label>
                      <Field
                        type="date"
                        className="form-control mb-4"
                        name={item.name.replace(' ', '_').toLowerCase()}
                      />
                    </RenderIf>
                    <RenderIf render={item.type === 'input'}>
                      <label className="form-label fw-bold mb-2">
                        {item.name}:
                      </label>
                      <Field
                        type="text"
                        className="form-control mb-4"
                        placeholder={item.placeholder}
                        name={item.name.replace(' ', '_').toLowerCase()}
                      />
                    </RenderIf>
                    <RenderIf render={item.type === 'dropdown'}>
                      <label className="form-label fw-bold mb-2">
                        {item.name}:
                      </label>
                      <Select
                        options={item.options}
                        className="mb-4"
                        components={animatedComponents}
                        isMulti
                        value={
                          Array.isArray(values[item.name.replace(' ', '_').toLowerCase()])
                            ? values[item.name.replace(' ', '_').toLowerCase()].map((id) =>
                                item.options.find((option) => option.value === id)
                              )
                            : []
                        }
                        onChange={(selectedOptions) => {
                          console.log(selectedOptions, 'selectedOptions');
                          setFieldValue(
                            item?.name?.replace(' ', '_')?.toLowerCase(),
                            selectedOptions
                              ? selectedOptions?.map((option) => option?.value)
                              : []
                          );
                          if (item.onChange) {
                            item.onChange(selectedOptions, setFieldValue);
                          }
                        }}
                        placeholder={item.placeholder}
                      />
                    </RenderIf>
                  </div>
                ))}
              </div>
              <Modal.Footer>
                <Button variant="warning" className="text-white" type="submit">
                  Save
                </Button>
                <Button onClick={() => setShowModal(false)}>Close</Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Formik>
  );
};

export default FilterModal;
