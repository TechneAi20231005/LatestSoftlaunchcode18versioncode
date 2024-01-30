import { createAsyncThunk } from "@reduxjs/toolkit";
import TestingTypeServices from "../../../services/MastersService/TestingTypeService";

export const testingData = createAsyncThunk(
    "testingData",
    async (config, thunkapi) => {
      try {
        const service = new TestingTypeServices();
        const response = await service.getAlltestingType();
        return response;
      } catch (error) {
        throw error;
      }
    }
  );