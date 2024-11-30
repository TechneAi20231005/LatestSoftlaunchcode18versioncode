import * as saveAs from 'file-saver';
import * as XLSX from 'xlsx';

export const transformDataForExportHandler = (data, headers, keys) => {
  return data?.map((row, index) => {
    const transformedRow = {};
    headers.forEach((header, i) => {
      if (header === 'Sr No.') {
        transformedRow[header] = index + 1;
      } else if (header === 'Status') {
        transformedRow[header] =
          Number(row?.[keys[i]]) === 1 ? 'Active' : 'Deactive';
      } else {
        transformedRow[header] = row?.[keys[i]] || '--';
      }
    });
    return transformedRow;
  });
};

export const customSearchHandler = (list, searchValue) => {
  if (!searchValue) return list;

  const filteredList = list.filter((branch) => {
    const searchInObject = (obj) => {
      return Object.values(obj).some((value) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchValue.toLowerCase());
        } else if (Array.isArray(value)) {
          return value.some((item) => searchInObject(item));
        } else if (typeof value === 'object' && value !== null) {
          return searchInObject(value);
        }
        return false;
      });
    };

    return searchInObject(branch);
  });

  return filteredList;
};

export const formatNumberWithCurrency = (
  number,
  locale = 'en-IN',
  currency = 'INR'
) => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'narrowSymbol'
  });
  return formatter.format(number);
};

export function customHandlerDropdownData({ data, labelKey, valueKey }) {
  if (!data?.length) {
    return [];
  }
  const filteredAndMappedData = data
    .filter((item) => item?.is_active === 1)
    .map((item) => ({
      label: item?.[labelKey],
      value: item?.[valueKey]
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const result = [
    { label: 'Select', value: undefined, isDisabled: true },
    ...filteredAndMappedData
  ];

  if (labelKey === 'remark_description') {
    result.push({ label: 'Other', value: 0 });
  }

  return result;
}

export const exportToExcelCustomHandler = ({
  data,
  fileName = 'data.xlsx'
}) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], {
    type: 'application/octet-stream'
  });

  saveAs(dataBlob, `${fileName}.xlsx`);
};

//

export const formatingTableNameData = (str) => {
  if (str.length > 51) {
    return str.slice(0, 50) + '...';
  } else {
    return str;
  }
};
