import axios from "axios";

const url = import.meta.env.VITE_AXIOS_URL;

const libraryAPI = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
});

export default libraryAPI;