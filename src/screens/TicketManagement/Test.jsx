import React from 'react';
import Table from 'react-bootstrap/Table';

export default function Test(props) {
  return (
    <div>
      {props.data && JSON.stringify(props.data)}

      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            {props.columns.map((ele, index) => {
              return <th>{ele.name}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {props.data.map((item, index) => {
            return (
              <tr key={index}>
                {props.columns.map((ele, i) => {
                  var columnName = ele.name.replace(' ', '_').toLowerCase();
                  if (item[columnName]) {
                    return <td>{item[columnName]}</td>;
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
