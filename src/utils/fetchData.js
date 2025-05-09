export const fetchData = async (
  callApi,
  inputRequired = '',
  isLoading,
  setIsLoading,
  errorHandler,
  filterObj = {},
  name
) => {
  try {
    // if (isLoading) return;
    // setIsLoading(true);
    const response = await callApi(inputRequired);
    if (response.status === 200 && response.statusText === 'OK') {
      if (response?.data?.status === 1) {
        const {
          data: { data = [] }
        } = response;

        let getData = [...data.data];

        let filteredData = [...data.data];

        if (filterObj?.isActive) {
          filteredData = getData.filter((data) => data.is_active === 1);
        }
        let selectData = [];
        if (name === 'User') {
          selectData = filteredData.map((data) => ({
            value: data.id,
            label: `${data.first_name} ${data.last_name} (${data.id})`
          }));
        } else {
          selectData = filteredData.map((data) => ({
            value: data.id,
            label: `${data[name]} `
          }));
        }

        if (filterObj?.accountFor === 'SELF') {
          filteredData = getData.filter((data) => data.account_for === 'SELF');
        }
        if (filterObj?.accountFor === 'CUSTOMER') {
          filteredData = getData.filter(
            (data) => data.account_for === 'CUSTOMER'
          );
        }
        return {
          data: getData,
          filteredData,
          selectData
        };
      }
    } else {
      errorHandler(response);
    }
  } catch (error) {
    errorHandler(error.response);
  } finally {
    // setIsLoading(false);
  }
};
