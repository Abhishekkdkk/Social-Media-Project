import axios from "axios";
const BASE_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // needed for cookies
});

export const loginUser = async (data) => {
  // console.log(data);
  return axios.post(`${BASE_URL}/users/login`, data, { withCredentials: true });
};

export const registerUser = async (data) => {
  return axios.post(`${BASE_URL}/users/register`, data, {
    withCredentials: true,
  });
};
// Logout user
export const logoutUser = () => api.post("/users/logout");

// Change password
export const changePassword = (data) => api.post("/users/changePassword", data);

export default api;
