import axios from "axios";

const libraryFetch = axios.create({
    baseURL: "http://localhost:8000"
});

export default libraryFetch;