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
    const branchValues = Object.values(branch);
    return branchValues.some((value) => {
      return (
        typeof value === 'string' &&
        value?.toLowerCase()?.includes(searchValue?.toLowerCase())
      );
    });
  });

  return filteredList;
};

// export const customSearchHandler = (function () {
//   let timeoutId;
//   let filteredList;

//   return function (list, searchValue, delay = 1000) {
//     clearTimeout(timeoutId);

//     if (!searchValue) return list;

//     timeoutId = setTimeout(() => {
//       filteredList = list.filter(branch => {
//         const branchValues = Object.values(branch);
//         return branchValues.some(value => {
//           return (
//             typeof value === 'string' && value?.toLowerCase()?.includes(searchValue?.toLowerCase())
//           );
//         });
//       });
//     }, delay);
//     console.log(filteredList);

//     return filteredList || list;
//   };
// })();

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
