import { createAsyncThunk } from "@reduxjs/toolkit";
import TemplateService from "../../../services/MastersService/TemplateService";
import TaskTicketTypeService from "../../../services/MastersService/TaskTicketTypeService";
import BasketService from "../../../services/TicketService/BasketService";

export const templateData = createAsyncThunk(
    "templateData",
    async (config, thunkapi) => {
      try {
        const service = new TemplateService();
        const response = await service.getTemplate();
        console.log("resss", response);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );


  export const exportTempateData = createAsyncThunk(
    "exportTempateData",
    async (config, thunkapi) => {
      try {
        const service = new TemplateService();
        const response = await service.exporttempData();
        console.log("tempalate", response);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  export const getParentData = createAsyncThunk(
    "getParentData",
    async (config, thunkapi) => {
      try {
        const service = new TaskTicketTypeService();
        const response = await service.getParent();
        console.log("resss", response);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  export const getAllTypeData = createAsyncThunk(
    "getAllTypeData",
    async (config, thunkapi) => {
      try {
        const service = new TaskTicketTypeService();
        const response = await service.getAllType();
        console.log("pppppppppp",response);
      
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  //_____________postTemplate______________________

  export const postTemplateData = createAsyncThunk(
    "postTemplateData",
    async (config, thunkapi) => {
      try {
        const service = new TemplateService();
        const response = await service.postTemplate(config);
        console.log("pppppppppp",response);
      
        return response;
      } catch (error) {
        throw error;
      }
    }
  );
  //___updateBasketModal___________________

  export const updateBasketModalData = createAsyncThunk(
    "updateBasketModalData",
    async (config, thunkapi) => {
      try {
        const service = new BasketService();
        const response = await service.updatetempalateBasket(config.id,config.payload);
        console.log("pppppppppp",response);
      
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  //_______________AddBasketinEditData__________________


  export const basketinEditData = createAsyncThunk(
    "basketinEditData",
    async (config, thunkapi) => {
      try {
        const service = new TemplateService();
        const response = await service.addBasketinEdit(config.id,config.payload);
        console.log("pppppppppp",response);
      
        return response;
      } catch (error) {
        throw error;
      }
    }
  );
  //____________________updateTempalateComponent________________

  export const updateTemplateData = createAsyncThunk(
    "updateTemplateData",
    async (config, thunkapi) => {
      try {
        const service = new TemplateService();
        const response = await service.updateTemplate(config.id,config.payload);
        console.log("pppppppppp",response);
      
        return response;
      } catch (error) {
        throw error;
      }
    }
  );
  //_______________________addTaskInBasket______________


  export const addTaskinBasketData = createAsyncThunk(
    "addTaskinBasketData",
    async (config, thunkapi) => {
      try {
        const service = new TemplateService();
        const response = await service.addTaskinBasket(config.templateId,config.basketId,config.payload);
        console.log("pppppppppp",response);
      
        return response;
      } catch (error) {
        throw error;
      }
    }
  );

  //____________________________getEelementById____________________

  export const getTemplateByIdData = createAsyncThunk(
    "getTemplateByIdData",
    async (config, thunkapi) => {
      try {
        const service = new TemplateService();
        const response = await service.getTemplateById(config.id); 
        console.log("response in action" , response)
        return response;
      } catch (error) {
        throw error;
      }
    }
  );




