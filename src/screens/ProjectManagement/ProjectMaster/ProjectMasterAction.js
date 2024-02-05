import { createAsyncThunk } from "@reduxjs/toolkit";

import ProjectService from "../../../services/ProjectManagementService/ProjectService";


export const getprojectData = createAsyncThunk(
  "getprojectData",
  async (config, thunkapi) => {
    try {
      const service = new ProjectService();
      const response = await service.getProject();
      console.log("resss", response);
      return response;
    } catch (error) {
      throw error;
    }
  }
);


export const postprojectData = createAsyncThunk(
  "postprojectData",
  async (config, thunkapi) => {
    try {
      const service = new ProjectService();
      const response = await service.postProject(config);
      console.log("dd", response);
      return response;
    } catch (error) {
      throw error;
    }
  }
);


export const updateprojectMaster = createAsyncThunk(
  "updateprojectMaster",
  async (config, thunkapi) => {
    try {
      const service = new ProjectService();
      const response = await service.updateProject(config.id, config.payload);;
      console.log("resss", response);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const getprojectByID = createAsyncThunk(
  "getprojectByID",
  async (config, thunkapi) => {
    try {
      const service = new ProjectService();
      const response = await service.getProjectById(config.id, config.payload);;
      console.log("resss", response);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

