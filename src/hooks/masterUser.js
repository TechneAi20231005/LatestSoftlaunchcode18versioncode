const allowedMasterIds = ['761', '25', '733', '523', '14'];

export const masterUser = () => {
  const userId = localStorage.getItem('id');
  return allowedMasterIds.includes(userId);
};
