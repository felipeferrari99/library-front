import axios from "axios";

const url = import.meta.env.VITE_AXIOS_URL;

const libraryFetch = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
});

export default libraryFetch;