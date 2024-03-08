import axios from "axios";

const libraryFetch = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
});

export default libraryFetch;