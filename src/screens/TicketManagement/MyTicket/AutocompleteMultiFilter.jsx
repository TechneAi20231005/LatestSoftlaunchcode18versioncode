// components/AutocompleteMultiFilter.js

import React from 'react';
import { Autocomplete, Checkbox, Chip, TextField } from '@mui/material';

const AutocompleteMultiFilter = ({ column, options = [], placeholder = 'Filter' }) => {
  const values = column.getFilterValue() || [];

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      limitTags={2}
      options={options}
      getOptionLabel={(option) => option.label}
      value={options.filter((opt) => values.includes(opt.value))}
      onChange={(event, newValue) => {
        column.setFilterValue(newValue.map((item) => item.value));
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={option.value}
            label={option.label}
            title={option.label}
            {...getTagProps({ index })}
          />
        ))
      }
      renderOption={(props, option, { selected }) => (
        <li title={option?.label} {...props}>
          <Checkbox style={{ marginRight: 8 }} checked={selected} />
          {option.label}
        </li>
      )}
      slotProps={{
        popper: { style: { width: 'fit-content', maxWidth: '30%' } },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          variant="standard"
          onKeyDown={(e) => e.stopPropagation()}
        />
      )}
    />
  );
};

export default AutocompleteMultiFilter;
