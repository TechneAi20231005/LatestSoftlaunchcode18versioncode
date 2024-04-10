export const transformDataForExportHandler = (data, headers, keys) => {
  return data?.map((row, index) => {
    const transformedRow = {};
    headers.forEach((header, i) => {
      if (header === 'Sr No.') {
        transformedRow[header] = index + 1;
      } else if (header === 'Status') {
        transformedRow[header] = Number(row?.[keys[i]]) === 1 ? 'Active' : 'Deactive';
      } else {
        transformedRow[header] = row?.[keys[i]] || '--';
      }
    });
    return transformedRow;
  });
};

export const customSearchHandler = (list, searchValue) => {
  if (!searchValue) return list;

  const filteredList = list.filter(branch => {
    const branchValues = Object.values(branch);
    return branchValues.some(value => {
      return (
        typeof value === 'string' && value?.toLowerCase()?.includes(searchValue?.toLowerCase())
      );
    });
  });

  return filteredList;
};
