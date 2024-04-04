import React from 'react';

function TableLoadingSkelton({ rowLength = 7, columnLength = 6 }) {
  return (
    <>
      <table className="table table-borderless mt-4">
        <tbody>
          {[...new Array(rowLength)]?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {[...new Array(columnLength)]?.map((column, colIndex) => (
                <td key={colIndex} className="p-1">
                  <div className="skeleton" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default TableLoadingSkelton;
