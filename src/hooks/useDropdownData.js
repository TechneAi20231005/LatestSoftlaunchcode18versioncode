import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import { customHandlerDropdownData } from '../utils/customFunction';
import { getBranchMasterListThunk } from '../redux/services/hrms/employeeJoining/branchMaster';
import { getSourceMasterListThunk } from '../redux/services/hrms/employeeJoining/sourceMaster';
import { getDesignationDataListThunk } from '../screens/Masters/DesignationMaster/DesignationAction';
import { departmentData } from '../screens/Masters/DepartmentMaster/DepartmentMasterAction';
import { getRemarkMasterListThunk } from '../redux/services/hrms/employeeJoining/remarkMaster';

const useDropdownData = ({ render }) => {
  // // initial state
  const dispatch = useDispatch();

  // // redux state
  const {
    sourceMasterList,
    isLoading: { getSourceMasterList }
  } = useSelector((state) => state?.sourceMaster);
  const {
    branchMasterList,
    isLoading: { getBranchMasterList }
  } = useSelector((state) => state?.branchMaster);
  const {
    getDesignationData: designationMasterList,
    isLoading: { DesignationList }
  } = useSelector((state) => state.designationMaster);
  const {
    departmentData: departmentDataList,
    status: isDepartmentDataListLoading
  } = useSelector((state) => state?.department);
  const {
    remarkMasterList,
    isLoading: { getRemarkMasterList }
  } = useSelector((state) => state?.remarkMaster);

  useEffect(() => {
    if (render) {
      if (!designationMasterList?.length) {
        dispatch(getDesignationDataListThunk());
      }
      if (!branchMasterList?.length) {
        dispatch(getBranchMasterListThunk());
      }
      if (!sourceMasterList?.length) {
        dispatch(getSourceMasterListThunk());
      }
      if (!remarkMasterList?.length) {
        dispatch(getRemarkMasterListThunk());
      }
      if (!departmentDataList?.length) {
        dispatch(departmentData());
      }
    }
  }, [render]);

  const sourceDropdown = useMemo(
    () =>
      customHandlerDropdownData({
        data: sourceMasterList,
        labelKey: 'source_name',
        valueKey: 'id'
      }),
    [sourceMasterList]
  );
  const preferredDesignationDropdown = useMemo(
    () =>
      customHandlerDropdownData({
        data: designationMasterList,
        labelKey: 'designation',
        valueKey: 'id'
      }),
    [designationMasterList]
  );
  const preferredDepartmentDropdown = useMemo(
    () =>
      customHandlerDropdownData({
        data: departmentDataList,
        labelKey: 'department',
        valueKey: 'id'
      }),
    [departmentDataList]
  );
  const preferredLocationDropdown = useMemo(
    () =>
      customHandlerDropdownData({
        data: branchMasterList,
        labelKey: 'location_name',
        valueKey: 'id'
      }),
    [branchMasterList]
  );
  const remarkDropdown = useMemo(
    () =>
      customHandlerDropdownData({
        data: remarkMasterList,
        labelKey: 'remark_description',
        valueKey: 'id'
      }),
    [remarkMasterList]
  );

  return {
    sourceDropdown,
    sourceDropdownLoading: getSourceMasterList,
    preferredDesignationDropdown,
    preferredDesignationDropdownLoading: DesignationList,
    preferredDepartmentDropdown,
    preferredDepartmentDropdownLoading: isDepartmentDataListLoading,
    preferredLocationDropdown,
    preferredLocationDropdownLoading: getBranchMasterList,
    remarkDropdown,
    remarkDropdownLoading: getRemarkMasterList
  };
};

export default useDropdownData;
