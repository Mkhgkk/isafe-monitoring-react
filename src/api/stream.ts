import apiClient from "./apiClient";

export const startStream = async (streamDetails: any) => {
  try {
    const response = await apiClient.post(
      "/api/stream/start_stream",
      streamDetails
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createSchedule = async (schedule: any) => {
  try {
    const response = await apiClient.post(
      "/api/stream/create_schedule",
      schedule
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
