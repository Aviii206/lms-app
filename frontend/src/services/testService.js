import axios from "axios";

const API_URL = "http://import.meta.env.VITE_API_URL/tests";

const getConfig = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo && userInfo.token) {
    return { headers: { Authorization: `Bearer ${userInfo.token}` } };
  }
  return {};
};

// Teacher functions
export const createTest = async (testData) => {
  const response = await axios.post(API_URL, testData, getConfig());
  return response.data;
};

export const getTeacherTests = async () => {
  const response = await axios.get(`${API_URL}/teacher`, getConfig());
  return response.data;
};

export const addQuestions = async (testId, questions) => {
  const response = await axios.put(`${API_URL}/${testId}/questions`, { questions }, getConfig());
  return response.data;
};

export const getTestById = async (testId) => {
  const response = await axios.get(`${API_URL}/${testId}`, getConfig());
  return response.data;
};

export const updateTest = async (testId, fullTestData) => {
  const response = await axios.put(`${API_URL}/${testId}`, fullTestData, getConfig());
  return response.data;
};

export const deleteTest = async (testId) => {
  const response = await axios.delete(`${API_URL}/${testId}`, getConfig());
  return response.data;
};

// Student functions
export const getAvailableTests = async () => {
  const response = await axios.get(`${API_URL}/available`, getConfig());
  return response.data;
};
