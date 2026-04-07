import axios from "axios";

const BASE_URL = "https://lms-app-backend-ruzu.onrender.com";
const API_URL = `${BASE_URL}/api/blogs/`;

export const getPublicBlogs = async () => {
  const response = await axios.get(API_URL + "public");
  return response.data;
};

export const getBlogs = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createBlog = async (blogData, token) => {
  const response = await axios.post(API_URL, blogData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const likeBlog = async (blogId, token) => {
  const response = await axios.put(
    API_URL + blogId + "/like",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const addComment = async (blogId, text, token) => {
  const response = await axios.post(
    API_URL + blogId + "/comment",
    { text },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const uploadFile = async (formData, token) => {
  const response = await axios.post(
    `${BASE_URL}/api/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteBlog = async (blogId, token) => {
  const response = await axios.delete(API_URL + blogId, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

