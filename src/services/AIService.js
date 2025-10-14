// services/AiService.js
import { axiosInstance } from "../utils/AxiosHelper.js";

export const getDashboardData = async () => {
  const response = await axiosInstance.get("/dashboard/data");
  return response.data;
};

export const getAIResponse = async (message) => {
  const response = await axiosInstance.post("/ai/suggestions", { message });
  return response.data;
};
