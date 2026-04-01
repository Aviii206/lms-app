import axios from "axios";

const API_URL = "http://import.meta.env.VITE_API_URL/attempts";

const getConfig = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo && userInfo.token) {
    return { headers: { Authorization: `Bearer ${userInfo.token}` } };
  }
  return {};
};

export const startAttempt = async (testId) => {
  // Use post to testId route, but backend route is /attempts/:testId/start 
  // Wait, the backend attempt route is /:testId/start -> /api/attempts/:testId/start
  const response = await axios.post(`${API_URL}/${testId}/start`, {}, getConfig());
  return response.data;
};

export const syncAttempt = async (attemptId, syncData) => {
  const response = await axios.patch(`${API_URL}/${attemptId}/sync`, syncData, getConfig());
  return response.data;
};

export const submitAttempt = async (attemptId) => {
  const response = await axios.post(`${API_URL}/${attemptId}/submit`, {}, getConfig());
  return response.data;
};
