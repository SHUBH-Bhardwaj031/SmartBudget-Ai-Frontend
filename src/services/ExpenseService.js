import { serverBaseURL } from "../config/config";
import axios from "axios";
import { axiosInstance } from "../utils/AxiosHelper";

// get all expenses + filters
export const getExpenses = async (minPrice = "", maxPrice = "",fromDate="",toDate="") => {
  const response = await axiosInstance.get(
   `/expenses?minPrice=${minPrice || ""}&maxPrice=${maxPrice || ""}&fromDate=${fromDate || ""}&toDate=${toDate || ""}`
  );

  return response.data;
};

//creating expense

export const createExpense = async (expenseData) => {
  const response = await axiosInstance.post(`/expenses`, expenseData);

  return response.data;
};

//delete expense
export const deleteExpense = async (expenseId) => {
  const response = await axiosInstance.delete(`/expenses/${expenseId}`);
  return response.data;
};
