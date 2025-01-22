import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { RenderIf } from '../../../utils';
import Select from 'react-select';
import animatedComponents from 'react-select/animated';

const FilterModal = ({
  showModal,
  setShowModal,
  allUsersData,
  allStatusData,
  allDepartmentData,
  setAllUsersData
}) => {
  const onChangeHandler = (e, type) => {
    try {
      const departmentId = e[e.length - 1].value;
      const assignedUsersAsPerAsDepartment = allUsersData.data
        .filter((item) =>
          item.departments.find((item) => item.id === departmentId)
        )
        .map((item) => ({
          value: item.id,
          label: `${item.first_name} ${item.middle_name} ${item.last_name}`
        }));
      setAllUsersData({
        ...allUsersData,
        assignedUsersAsPerAsDepartment: assignedUsersAsPerAsDepartment
      });

      console.log('all data user chnage', allUsersData);
      if (type === 'department') {
      }
    } catch (error) {}
  };
  const inputDataList = [
    { id: 1, name: 'From Date', type: 'date', placeholder: 'Enter From Date' },
    {
      id: 2,
      name: 'To Date',
      type: 'date',
      placeholder: 'Select To Date'
    },
    {
      id: 3,
      name: 'Assigned Department',
      type: 'dropdown',
      placeholder: 'Select Assigned Department',
      options: allDepartmentData.selectData,
      onChange: onChangeHandler
    },
    {
      id: 4,
      name: 'Assigned User',
      type: 'dropdown',
      placeholder: 'Select Assigned User',
      options: allUsersData.assignedUsersAsPerAsDepartment
    },
    {
      id: 5,
      name: 'Entry Department',
      type: 'dropdown',
      placeholder: 'Select Entry Department',
      options: allDepartmentData.selectData
    },
    {
      id: 6,
      name: 'Entry User',
      type: 'dropdown',
      placeholder: 'Select Entry Use'
      //   options: allStatusData.selectData
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
      placeholder: 'Select Entry Use'
      //   options: allStatusData.selectData
    }
  ];
  return (
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
        <div className="row align-items-center">
          {inputDataList.map((item) => {
            return (
              <div key={item.id} className="col-lg-6">
                <RenderIf render={item.type === 'date'}>
                  <label className="form-label fw-bold mb-2">
                    {item.name}:
                  </label>
                  <input
                    type="date"
                    className="form-control  mb-4"
                    name="to_date"
                    id="to_date"
                  />
                </RenderIf>
                <RenderIf render={item.type === 'input'}>
                  <label className="form-label fw-bold mb-2">
                    {item.name}:
                  </label>
                  <input
                    type={item.type}
                    className="form-control mb-4"
                    placeholder={item.placeholder}
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
                    onChange={(e) => item.onChange(e, item.name)}
                    placeholder={item.placeholder}
                  />
                </RenderIf>
              </div>
            );
          })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="warning" className="text-white">
          Save
        </Button>
        <Button onClick={() => setShowModal(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FilterModal;
