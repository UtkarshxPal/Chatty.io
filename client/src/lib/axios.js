import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chatty-io-la0v.onrender.com/api",
  withCredentials: true,
});
