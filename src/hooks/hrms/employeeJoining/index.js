import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useCurrentInterviewStep = () => {
  const { interviewProcessData } = useSelector(state => state?.interViewProcess);

  const getCurrentStep = () => {
    if (!interviewProcessData || !interviewProcessData.details) {
      return null;
    }

    return interviewProcessData.details.find(data => {
      if (interviewProcessData.application_status === 2) {
        return interviewProcessData.step_details_id === data.step_details_id;
      } else {
        return interviewProcessData.application_status === data.application_status_id;
      }
    });
  };

  return getCurrentStep();
};

export const useJobOfferSalaryFiltered = (data, designationId, locationId, experienceLevel) => {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const filterData = () => {
      const filtered = data?.find(
        item =>
          parseInt(item.designation_id) === +designationId &&
          item.location_id?.includes(+locationId) &&
          item.experience_level === experienceLevel,
      );
      setFilteredData(filtered);
    };

    filterData();
  }, [data, designationId, locationId, experienceLevel]);

  return filteredData;
};
