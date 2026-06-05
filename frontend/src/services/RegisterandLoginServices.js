import axios from "axios";
const BASE_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}`;

export const loginUser = async (data) => {
  // console.log(data);
  console.log("Login URL:", `${BASE_URL}/users/login`);
  try {
    return axios.post(`${BASE_URL}/users/login`, data, {
      withCredentials: true,
    });
  } catch (err) {
    console.error("Login error:", err.response?.data);
    throw err;
  }
};

export const registerUser = async (data) => {
  try {
    return axios.post(`${BASE_URL}/users/register`, data, {
      withCredentials: true,
    });
  } catch (err) {
    console.error("Registration error:", err.response?.data);
    throw err;
  }
};
// Logout user
export const logoutUser = () => axios.post("/users/logout");

// Change password
export const changePassword = (data) =>
  axios.post("/users/changePassword", data);
