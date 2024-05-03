import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import ModuleSetting from "../../../services/SettingService/ModuleSetting";
import Select from "react-select";
import PageHeader from "../../../components/Common/PageHeader";
import ErrorLogService from "../../../services/ErrorLogService";
import Alert from "../../../components/Common/Alert";

const ModuleSettings = ({ match }) => {
  const moduleRef = useRef();
  const submoduleRef = useRef();

  const [selected, setSelected] = useState({
    module_name: null,
    submodule_name: null,
  });
  const [data, setData] = useState(null);
  const [settingData, setSettingData] = useState(null);
  const [module, setModule] = useState(null);
  const [submodule, setSubmodule] = useState(null);
  const [table, setTable] = useState(null);
  const [notify, setNotify] = useState();
  const[modal, setModal] = useState();

  const columns =[
    { name: "Setting Name", selector: (row) => row.updated_at, sortable: true },
    { name: "Visibility", selector: (row) => row.updated_by, sortable: true },
  ]

  const loadData = () => {
    new ModuleSetting().getAllModuleSetting().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setData(res.data.data);
          const t = res.data.data.map((d) => ({
            label: d.module_name,
            value: d.module_name,
          }));
          setModule(t);
        }
      
      }
    });
  };

  const handleSubmoduleChange = (e) => {
    setSelected((prev) => ({ ...prev, submodule_name: e.value }));

    const url = selected.module_name + "/" + e.value;

    new ModuleSetting().getModuleSetting(url).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setSettingData(null);
          setSettingData(res.data.data);
        }
      }
    });
  };

  const handleModuleChange = (e) => {
    const t = data.filter((d) => d.module_name == e.value);

    setSelected((prev) => ({ ...prev, module_name: e.value }));

    const sub = t[0].submodule_name.map((d) => ({ label: d, value: d }));

    setSubmodule(sub);
  };

   const handleForm =  async (e) =>{
        e.preventDefault();
        const formData = new FormData(e.target);
        setNotify(null)
        await new ModuleSetting().updateAllModuleSetting(formData).then((res)=>{
          if(res.status === 200){
            if(res.data.status === 1){
              setNotify(null)
              setNotify({ type: 'success', message: res.data.message })
            }else{
              setNotify({ type: 'danger', message: res.data.message })
            }
          }else{
            new ErrorLogService().sendErrorLog("moduleSetting", "Create_moduleSetting", "INSERT", res.message);
          }
          
        }).catch(error => {
          const { response } = error;
          const { request, ...errorObject } = response;
          new ErrorLogService().sendErrorLog("moduleSetting", "Create_moduleSetting", "INSERT", errorObject.data.message);
      })
   }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <PageHeader headerTitle="Module Settings" />
      {notify && <Alert alertData={notify} />}
      <form method="post"  onSubmit={handleForm}>
        <div className="card mt-2">
          <div className="card-body">
            <div className="form-group row justify-content-center">
              <div className="col-sm-3">
                <label className="col-form-label ">
                  <b>Module :</b>
                </label>
                {module && (
                  <Select
                    options={module}
                    ref={moduleRef}
                    onChange={handleModuleChange}
                    name="module_id"
                    id="module_id"
                  />
                )}
              </div>

              <div className="col-sm-3">
                <label className=" col-form-label">
                  <b>Sub Module :</b>
                </label>
                {submodule && (
                  <Select
                    options={submodule}
                    onChange={handleSubmoduleChange}
                    name="submodule_id"
                    id="submodule_id"
                  />
                )}

                {!submodule && (
                  <Select
                    options={{value:null,label:"Select Sub-module"}}
                  />
                )}

              </div>
            </div>
          </div>
        </div>
       
      {settingData && <div className="card mt-2">
          <div className="card-body">            
            <table className="table">
              <thead>
                <tr className="text-center">
                  <th scope="col">Setting Name</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {settingData && settingData.map((item) => {
                    return (
                      <tr className="font-weight-bold" key={item}>
                        <td className="text-center">

                          <input type="hidden" 
                            name="setting_id[]"
                            value={item.id} />

                          {item.setting_name}
                        </td>
                        <td className="text-center">
                          {item.field_type == "input" && (
                            <select className="form-control form-control sm-2 text-center" name="setting_value[]">
                              {item.field_value.split("|").map((d) => {
                                return (
                                  <option value={d}> {d == 1 ?  "Yes" : "No"} </option>
                                );
                            })}
                            </select>
                          )}
                        </td>
                      </tr>
                  );
                })}
              </tbody>
            </table>
          
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary text-white">
                Submit
              </button>
            </div>
          </div>
        </div>}
      </form>
    </>
  );
};

export default ModuleSettings;
