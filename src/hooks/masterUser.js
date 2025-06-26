const allowedMasterIds = ['761', '25', '733', '523'];

export const masterUser = () => {
  const userId = localStorage?.getItem('id');
  return allowedMasterIds?.includes(userId);
};
